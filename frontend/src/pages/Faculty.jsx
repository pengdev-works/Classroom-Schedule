import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Users, Mail, Briefcase, Loader2 } from 'lucide-react';
import api from '../utils/api';
import Swal from 'sweetalert2';

const Faculty = () => {
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', department: '', email: '' });

    const fetchFaculty = async () => {
        try {
            const response = await api.get('/faculty');
            setFaculty(response.data);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch faculty list', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaculty();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/faculty', formData);
            Swal.fire('Success', 'Faculty member added', 'success');
            setShowModal(false);
            setFormData({ name: '', department: '', email: '' });
            fetchFaculty();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'Failed to add faculty', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Faculty?',
            text: "This will remove their history as well.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Delete',
            background: '#1e293b',
            color: '#f1f5f9'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/faculty/${id}`);
                Swal.fire('Removed!', 'Faculty member deleted.', 'success');
                fetchFaculty();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete faculty', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold gradient-text">Faculty</h2>
                    <p className="text-slate-400">Manage teaching assignments and staff</p>
                </div>
                <button 
                  onClick={() => setShowModal(true)}
                  className="btn-premium flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Faculty Member
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {faculty.map((member) => (
                        <div key={member.id} className="premium-card group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex gap-2">
                                  <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-300">
                                    <Edit3 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(member.id)}
                                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-400"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-100">{member.name}</h3>
                                    <p className="text-xs text-indigo-400 font-medium uppercase tracking-wider">{member.department}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-400 text-sm">
                                    <Mail size={16} className="text-slate-500" />
                                    <span>{member.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 text-sm">
                                    <Briefcase size={16} className="text-slate-500" />
                                    <span>Academic Professional</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {faculty.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
                            No faculty members found.
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="premium-card w-full max-w-lg bg-slate-900 border-indigo-500/30">
                        <h3 className="text-xl font-bold mb-6">Add Faculty Member</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Full Name</label>
                                <input 
                                  type="text"
                                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  required
                                  placeholder="e.g. Dr. Jane Doe"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Department</label>
                                <input 
                                  type="text"
                                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                                  value={formData.department}
                                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                                  required
                                  placeholder="e.g. Math & Computing"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Email Address</label>
                                <input 
                                  type="email"
                                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                                  value={formData.email}
                                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                                  required
                                  placeholder="jane.doe@ua.edu.ph"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                  type="button"
                                  onClick={() => setShowModal(false)}
                                  className="flex-1 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-premium flex-1">
                                    Register Faculty
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Faculty;
