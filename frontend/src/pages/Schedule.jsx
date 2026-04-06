import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Calendar, Clock, MapPin, Users, BookOpen, Layers, Loader2, AlertCircle, Printer } from 'lucide-react';
import api from '../utils/api';
import Swal from 'sweetalert2';
import uaLogo from '../assets/ua_logo.jpg';
import cmcsLogo from '../assets/cmcs_logo.jpg';

const Schedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedSection, setSelectedSection] = useState('All');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdminOrTeacher = ['admin', 'teacher'].includes(user.role);
    
    const [formData, setFormData] = useState({
        room_id: '',
        faculty_id: '',
        subject_id: '',
        section: '',
        day_of_week: '',
        start_time: '',
        end_time: ''
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const printDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const fetchData = async () => {
        try {
            const [schedulesRes, roomsRes, facultyRes, subjectsRes, sectionsRes] = await Promise.all([
                api.get('/schedules'),
                api.get('/rooms'),
                api.get('/faculty'),
                api.get('/subjects'),
                api.get('/sections')
            ]);
            setSchedules(schedulesRes.data);
            setRooms(roomsRes.data);
            setFaculty(facultyRes.data);
            setSubjects(subjectsRes.data);
            setSections(sectionsRes.data);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch scheduling data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/schedules', formData);
            Swal.fire('Success', 'Schedule created successfully', 'success');
            setShowModal(false);
            setFormData({
                room_id: '',
                faculty_id: '',
                subject_id: '',
                section: '',
                day_of_week: '',
                start_time: '',
                end_time: ''
            });
            fetchData();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Scheduling Conflict',
                text: error.response?.data?.message || 'Failed to create schedule',
                background: '#1e293b',
                color: '#f1f5f9'
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Remove Schedule?',
            text: "This entry will be permanently deleted.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Remove',
            background: '#1e293b',
            color: '#f1f5f9'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/schedules/${id}`);
                Swal.fire('Deleted!', 'Schedule has been removed.', 'success');
                fetchData();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete schedule', 'error');
            }
        }
    };
    
    const uniqueSections = ['All', ...new Set(schedules.map(item => item.section_name))].sort();
    
    const filteredSchedules = selectedSection === 'All' 
        ? schedules 
        : schedules.filter(item => item.section_name === selectedSection);
    
    const groupedSchedules = printDays.reduce((acc, day) => {
        acc[day] = filteredSchedules
            .filter(item => item.day_of_week === day)
            .sort((a, b) => a.start_time.localeCompare(b.start_time));
        return acc;
    }, {});
    
    const formatTime12h = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        let h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${minutes} ${ampm}`;
    };

    const getYearLevel = (sectionName) => {
        const match = sectionName.match(/\d/);
        const year = match ? match[0] : 'Other';
        if (year === '1') return '1st Year';
        if (year === '2') return '2nd Year';
        if (year === '3') return '3rd Year';
        if (year === '4') return '4th Year';
        return 'Other';
    };

    const getSubjectColor = (id) => {
        const colors = [
            { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' }, // Blue
            { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c' }, // Red
            { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' }, // Green
            { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' }, // Orange
            { bg: '#faf5ff', border: '#e9d5ff', text: '#7e22ce' }, // Purple
            { bg: '#fdf2f8', border: '#fbcfe8', text: '#be185d' }, // Pink
            { bg: '#f0f9ff', border: '#bae6fd', text: '#0369a1' }, // Sky
            { bg: '#fefce8', border: '#fef08a', text: '#a16207' }, // Yellow
            { bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' }  // Indigo
        ];
        const safeId = parseInt(id) || 0;
        return colors[safeId % colors.length];
    };

    const handlePrint = () => {
        window.print();
    };

    // Grouping for print
    const yearLevels = selectedSection === 'All' 
        ? [...new Set(filteredSchedules.map(item => getYearLevel(item.section_name)))].sort()
        : [getYearLevel(selectedSection)];

    const groupedByYear = yearLevels.reduce((acc, year) => {
        acc[year] = filteredSchedules.filter(item => getYearLevel(item.section_name) === year);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold gradient-text">Class Schedule</h2>
                    <p className="text-slate-400">Build and manage academic timetables</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="no-print relative min-w-[200px]">
                        <select 
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 cursor-pointer appearance-none"
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                        >
                            <option value="All">All Sections</option>
                            {uniqueSections.filter(s => s !== 'All').map(sec => (
                                <option key={sec} value={sec}>{sec}</option>
                            ))}
                        </select>
                        <Layers size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700 no-print"
                    >
                        <Printer size={18} />
                        Print Schedule
                    </button>
                    {isAdminOrTeacher && (
                        <button 
                          onClick={() => setShowModal(true)}
                          className="btn-premium flex items-center gap-2 no-print"
                        >
                            <Plus size={18} />
                            New Allocation
                        </button>
                    )}
                </div>
            </div>

            <style>
                {`
                @media print {
                    .no-print { display: none !important; }
                    aside, header, .premium-card button, .main-schedule-list { display: none !important; }
                    main { padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
                    .p-10 { padding: 0 !important; }
                    
                    .calendar-print-view {
                        display: block !important;
                        width: 100%;
                        background: white !important;
                        color: black !important;
                    }
                    
                    .calendar-grid {
                        display: grid;
                        grid-template-columns: repeat(5, 1fr);
                        border-top: 1px solid #e2e8f0;
                        border-left: 1px solid #e2e8f0;
                    }
                    
                    .calendar-day-col {
                        border-right: 1px solid #e2e8f0;
                        border-bottom: 1px solid #e2e8f0;
                        min-height: 100px;
                    }
                    
                    .calendar-day-header {
                        background: #f8fafc !important;
                        border-bottom: 2px solid #e2e8f0;
                        padding: 8px;
                        font-weight: bold;
                        text-align: center;
                        font-size: 12px;
                        color: #1e293b !important;
                    }
                    
                    .calendar-entry {
                        padding: 8px;
                        border-bottom: 1px solid #f1f5f9;
                        font-size: 10px;
                        line-height: 1.2;
                    }
                    
                    .calendar-entry:last-child {
                        border-bottom: none;
                    }
                    
                    .calendar-entry .time {
                        font-weight: bold;
                        color: #4f46e5 !important;
                        display: block;
                        margin-bottom: 2px;
                    }
                    
                    .calendar-entry .subject {
                        font-weight: 700;
                        margin-bottom: 2px;
                    }
                    
                    .calendar-entry .details {
                        color: #64748b !important;
                        font-size: 9px;
                    }
                    
                    .gradient-text { 
                        background: none !important; 
                        color: black !important; 
                        -webkit-text-fill-color: black !important;
                        font-size: 24px !important;
                        margin-bottom: 10px !important;
                    }
                    
                    body { background: white !important; color: black !important; -webkit-print-color-adjust: exact; }
                }
                
                @media screen {
                    .calendar-print-view {
                        display: none;
                    }
                }
                `}
            </style>

            <div className="calendar-print-view">
                {yearLevels.map((yearGroupName, yearIdx) => (
                    <div key={yearGroupName} className={yearIdx > 0 ? "mt-12 pt-12 border-t-2 border-dashed border-slate-300" : ""}>
                        <div className="mb-6 flex items-center justify-between border-b-2 border-slate-900 pb-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center -space-x-2">
                                    <img src={uaLogo} alt="UA" className="w-12 h-12 rounded-lg object-contain bg-white border border-slate-200 p-0.5" />
                                    <img src={cmcsLogo} alt="CMCS" className="w-12 h-12 rounded-lg object-contain bg-white border border-slate-200 p-0.5" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                                        {yearGroupName} Schedule
                                    </h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                                        {selectedSection === 'All' ? 'University Academic Timetable' : `Section: ${selectedSection}`} • {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-900 uppercase">University of Abra</p>
                                <p className="text-[8px] text-slate-500 font-bold uppercase">College of Mathematics & Computing Science</p>
                            </div>
                        </div>
                        
                        <div className="calendar-grid" style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '80px repeat(5, 1fr)', 
                            gridTemplateRows: '40px repeat(18, 50px)', // Larger rows for better clarity
                            border: '1px solid #e2e8f0',
                            pageBreakAfter: 'always'
                        }}>
                            {/* Header Row */}
                            <div className="border-b border-r bg-slate-50" style={{ gridRow: 1, gridColumn: 1 }} />
                            {printDays.map((day, idx) => (
                                <div key={day} className="flex items-center justify-center font-black text-[10px] uppercase bg-slate-50 border-b border-r text-slate-900" style={{ gridRow: 1, gridColumn: idx + 2 }}>
                                    {day}
                                </div>
                            ))}

                            {/* Time Column Labels - 7AM to 6PM */}
                            {[7,8,9,10,11,12,1,2,3,4,5].map((hourLabel, idx) => {
                                const displayHour = hourLabel === 12 ? "12:00 PM" : (hourLabel >= 7 && hourLabel <= 11) ? `${hourLabel}:00 AM` : `${hourLabel}:00 PM`;
                                return (
                                    <div key={idx} className="flex items-start justify-center pt-2 font-bold text-[9px] border-b border-r bg-slate-50/50 text-slate-500" style={{ gridRow: `${idx * 2 + 2} / span 2`, gridColumn: 1 }}>
                                        {displayHour}
                                    </div>
                                );
                            })}

                            {/* Grid Lines */}
                            {Array.from({ length: 22 }).map((_, i) => (
                                printDays.map((_, j) => (
                                    <div key={`${i}-${j}`} className="border-b border-r border-slate-50" style={{ gridRow: i + 2, gridColumn: j + 2 }} />
                                ))
                            ))}

                            {/* Schedule Entries for this Year Level */}
                            {printDays.map(day => 
                                (groupedByYear[yearGroupName] || []).filter(item => item.day_of_week === day).map(item => {
                                    const startH = parseInt(item.start_time.split(':')[0]);
                                    const startM = parseInt(item.start_time.split(':')[1]);
                                    const endH = parseInt(item.end_time.split(':')[0]);
                                    const endM = parseInt(item.end_time.split(':')[1]);

                                    const startRow = (startH - 7) * 2 + (startM >= 30 ? 1 : 0) + 2;
                                    const endRow = (endH - 7) * 2 + (endM >= 30 ? 1 : 0) + 2;
                                    const dayIdx = printDays.indexOf(day) + 2;
                                    const color = getSubjectColor(item.subject_id);

                                    return (
                                        <div 
                                            key={item.id} 
                                            className="calendar-entry-grid m-0.5 rounded p-2 border shadow-sm flex flex-col justify-center overflow-hidden" 
                                            style={{ 
                                                gridRow: `${startRow} / ${endRow}`, 
                                                gridColumn: dayIdx,
                                                backgroundColor: color.bg,
                                                borderColor: color.border,
                                                borderLeftWidth: '4px',
                                                zIndex: 10
                                            }}
                                        >
                                            <span className="text-[7px] font-black leading-tight block mb-0.5" style={{ color: color.text }}>
                                                {formatTime12h(item.start_time)}
                                            </span>
                                            <div className="text-[9px] font-black text-slate-900 leading-tight uppercase">
                                                {item.subject_name}
                                            </div>
                                            <div className="text-[7px] font-bold text-slate-600 leading-none mt-1">
                                                {item.room_number} • {item.section_name}
                                            </div>
                                            <div className="text-[7px] font-bold text-slate-400 italic mt-0.5 truncate">
                                                {item.faculty_name}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                </div>
            ) : (
                <div className="space-y-4 main-schedule-list">
                    {filteredSchedules.length > 0 ? (
                        filteredSchedules.map((item) => {
                            const color = getSubjectColor(item.subject_id);
                            return (
                                <div key={item.id} className="premium-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-indigo-500/50">
                                    <div className="flex items-center gap-6 flex-1">
                                        <div 
                                            className="w-16 h-16 rounded-2xl border flex flex-col items-center justify-center"
                                            style={{ backgroundColor: `${color.bg}40`, borderColor: color.border, color: color.text }}
                                        >
                                            <span className="text-[10px] font-bold uppercase">{item.day_of_week.substring(0, 3)}</span>
                                            <Calendar size={20} />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold text-slate-100">{item.subject_name} ({item.section_name})</h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Users size={14} className="text-indigo-400" />
                                                    {item.faculty_name}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={14} className="text-purple-400" />
                                                    {item.room_number}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
                                                    <Clock size={14} />
                                                    {formatTime12h(item.start_time)} - {formatTime12h(item.end_time)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {isAdminOrTeacher && (
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 no-print"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-20 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center gap-4">
                            <Calendar size={48} className="text-slate-700" />
                            <p>No schedules found for the selected filter. Try selecting a different section.</p>
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
                    <div className="premium-card w-full max-w-2xl bg-slate-900 border-indigo-500/30">
                        <div className="flex items-center gap-3 mb-6">
                            <Calendar className="text-indigo-500" />
                            <h3 className="text-2xl font-bold">New Class Allocation</h3>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Subject</label>
                                    <select 
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                                        value={formData.subject_id}
                                        onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.code} - {sub.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Section</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                                        value={formData.section}
                                        onChange={(e) => setFormData({...formData, section: e.target.value})}
                                        required
                                        placeholder="e.g. BSCS 4A"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Faculty</label>
                                    <select 
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                                        value={formData.faculty_id}
                                        onChange={(e) => setFormData({...formData, faculty_id: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Instructor</option>
                                        {faculty.map(fac => <option key={fac.id} value={fac.id}>{fac.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Room</label>
                                    <select 
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                                        value={formData.room_id}
                                        onChange={(e) => setFormData({...formData, room_id: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Classroom</option>
                                        {rooms.map(room => <option key={room.id} value={room.id}>{room.room_number} ({room.building})</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Day of Week</label>
                                    <select 
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                                        value={formData.day_of_week}
                                        onChange={(e) => setFormData({...formData, day_of_week: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Day</option>
                                        {days.map(day => <option key={day} value={day}>{day}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                       <label className="text-xs font-bold text-slate-400 uppercase ml-1">Start Time</label>
                                       <input 
                                         type="time"
                                         className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                                         value={formData.start_time}
                                         onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                                         required
                                       />
                                   </div>
                                   <div className="space-y-2">
                                       <label className="text-xs font-bold text-slate-400 uppercase ml-1">End Time</label>
                                       <input 
                                         type="time"
                                         className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                                         value={formData.end_time}
                                         onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                                         required
                                       />
                                   </div>
                                </div>
                            </div>
                            
                            <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-xl flex gap-3 text-indigo-300">
                               <AlertCircle size={20} className="flex-shrink-0" />
                               <p className="text-xs">The system will automatically check for room, faculty, and section conflicts before saving.</p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                  type="button"
                                  onClick={() => setShowModal(false)}
                                  className="flex-1 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    Discard
                                </button>
                                <button type="submit" className="btn-premium flex-1">
                                    Confirm Allocation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;
