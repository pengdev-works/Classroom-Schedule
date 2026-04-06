import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Calendar, Clock, MapPin, Users, BookOpen, Layers, Loader2, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import Swal from 'sweetalert2';

const Schedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold gradient-text">Class Schedule</h2>
                    <p className="text-slate-400">Build and manage academic timetables</p>
                </div>
                <button 
                  onClick={() => setShowModal(true)}
                  className="btn-premium flex items-center gap-2"
                >
                    <Plus size={18} />
                    New Allocation
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                </div>
            ) : (
                <div className="space-y-4">
                    {schedules.map((item) => (
                        <div key={item.id} className="premium-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-indigo-500/50">
                            <div className="flex items-center gap-6 flex-1">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex flex-col items-center justify-center text-indigo-400">
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
                                            {item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {schedules.length === 0 && (
                        <div className="py-20 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center gap-4">
                            <Calendar size={48} className="text-slate-700" />
                            <p>No schedules allocated yet. Start by creating a new allocation.</p>
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
