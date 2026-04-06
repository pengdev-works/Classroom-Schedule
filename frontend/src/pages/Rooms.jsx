import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit3, MapPin, Layers, Users as UsersIcon, Search, LayoutGrid } from 'lucide-react';
import api from '../utils/api';
import Swal from 'sweetalert2';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ capacity: '', building: '', room_number: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    const filteredRooms = rooms.filter(room => 
        room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.building.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const SkeletonCard = () => (
        <div className="premium-card animate-pulse">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 mb-6" />
            <div className="w-3/4 h-6 bg-slate-800 rounded-lg mb-4" />
            <div className="space-y-3">
                <div className="w-full h-4 bg-slate-800 rounded-md" />
                <div className="w-2/3 h-4 bg-slate-800 rounded-md" />
            </div>
        </div>
    );

    const fetchRooms = async () => {
        try {
            const response = await api.get('/rooms');
            setRooms(response.data);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch rooms', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/rooms', formData);
            Swal.fire('Success', 'Room added successfully', 'success');
            setShowModal(false);
            setFormData({ capacity: '', building: '', room_number: '' });
            fetchRooms();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'Failed to add room', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!',
            background: '#1e293b',
            color: '#f1f5f9'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/rooms/${id}`);
                Swal.fire('Deleted!', 'Room has been deleted.', 'success');
                fetchRooms();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete room', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold gradient-text">Classrooms</h2>
                    <p className="text-slate-400">Manage school facilities and capacities</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group no-print">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                        <input 
                            type="text"
                            placeholder="Find a classroom..."
                            className="bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-6 outline-none focus:ring-2 focus:ring-indigo-500/50 w-64 lg:w-80 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {isAdmin && (
                      <button 
                        onClick={() => setShowModal(true)}
                        className="btn-premium"
                      >
                          <Plus size={18} />
                          Add Room
                      </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRooms.map((room) => (
                        <div key={room.id} className="premium-card group hover:scale-[1.02] active:scale-[0.98] transition-all cursor-default">
                            <div className="flex justify-between items-start mb-6">
                               <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-inner">
                                  <MapPin size={22} />
                               </div>
                               {isAdmin && (
                                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                                    <button className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-slate-100 transition-colors">
                                      <Edit3 size={16} />
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(room.id)}
                                      className="p-2 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                 </div>
                               )}
                            </div>
                            <h3 className="text-xl font-black text-slate-100 tracking-tight">{room.room_number}</h3>
                            <div className="mt-5 space-y-3 pt-5 border-t border-slate-700/30">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <div className="p-1.5 rounded-lg bg-slate-800/50">
                                        <LayoutGrid size={12} className="text-indigo-400" />
                                    </div>
                                    <span className="text-sm font-bold tracking-wide">Building: <span className="text-slate-200">{room.building}</span></span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <div className="p-1.5 rounded-lg bg-slate-800/50">
                                        <UsersIcon size={12} className="text-purple-400" />
                                    </div>
                                    <span className="text-sm font-bold tracking-wide">Capacity: <span className="text-slate-200">{room.capacity} Max</span></span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredRooms.length === 0 && (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-4 glass-morphism border-2 border-dashed border-slate-800/50">
                            <div className="w-20 h-20 rounded-full bg-slate-800/30 flex items-center justify-center text-slate-700 mb-2">
                                <MapPin size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-300">No rooms match your search</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your filters or check back later for updates.</p>
                            {isAdmin && (
                                <button onClick={() => setShowModal(true)} className="text-indigo-400 font-bold hover:text-indigo-300 underline underline-offset-4 decoration-2 px-6 py-2 transition-all">
                                    Create one now
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="premium-card w-full max-w-lg bg-slate-900 border-indigo-500/30"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/30">
                                <Plus size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-100 tracking-tight">Create Classroom</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.1em]">Facility Registration</p>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Room Identifier</label>
                                <input 
                                  type="text"
                                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-100"
                                  value={formData.room_number}
                                  onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                                  required
                                  placeholder="e.g. Lab 401"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Location</label>
                                    <input 
                                      type="text"
                                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-100"
                                      value={formData.building}
                                      onChange={(e) => setFormData({...formData, building: e.target.value})}
                                      required
                                      placeholder="Building Name"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Max Capacity</label>
                                    <input 
                                      type="number"
                                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-100"
                                      value={formData.capacity}
                                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                      required
                                      placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button 
                                  type="button"
                                  onClick={() => setShowModal(false)}
                                  className="flex-1 px-8 py-4 rounded-2xl bg-slate-800/50 text-slate-400 font-bold hover:bg-slate-800 hover:text-slate-100 transition-all"
                                >
                                    Discard
                                </button>
                                <button type="submit" className="btn-premium flex-[2]">
                                    Finish & Save
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Rooms;
