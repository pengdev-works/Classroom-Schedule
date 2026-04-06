import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, MapPin, Layers, Users as UsersIcon, Loader2 } from 'lucide-react';
import api from '../utils/api';
import Swal from 'sweetalert2';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ capacity: '', building: '', room_number: '' });
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

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
                {isAdmin && (
                  <button 
                    onClick={() => setShowModal(true)}
                    className="btn-premium flex items-center gap-2"
                  >
                      <Plus size={18} />
                      Add New Room
                  </button>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div key={room.id} className="premium-card group">
                            <div className="flex justify-between items-start mb-4">
                               <div className="bg-indigo-600/20 p-3 rounded-xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                  <MapPin size={24} />
                               </div>
                               {isAdmin && (
                                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-300">
                                      <Edit3 size={16} />
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(room.id)}
                                      className="p-2 hover:bg-red-500/20 rounded-lg text-red-400"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                 </div>
                               )}
                            </div>
                            <h3 className="text-xl font-bold text-slate-100">{room.room_number}</h3>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Layers size={14} />
                                    <span>Building: {room.building}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <UsersIcon size={14} />
                                    <span>Capacity: {room.capacity} Students</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {rooms.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
                            No rooms found. Click "Add New Room" to get started.
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="premium-card w-full max-w-lg bg-slate-900 border-indigo-500/30">
                        <h3 className="text-xl font-bold mb-6">Add Classroom</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Room Number</label>
                                <input 
                                  type="text"
                                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                                  value={formData.room_number}
                                  onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                                  required
                                  placeholder="e.g. Lab 401"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-slate-400 mb-1 block">Building</label>
                                    <input 
                                      type="text"
                                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                                      value={formData.building}
                                      onChange={(e) => setFormData({...formData, building: e.target.value})}
                                      required
                                      placeholder="e.g. CMCS Bldg"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400 mb-1 block">Capacity</label>
                                    <input 
                                      type="number"
                                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                                      value={formData.capacity}
                                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                      required
                                      placeholder="0"
                                    />
                                </div>
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
                                    Create Room
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rooms;
