import React, { useState, useEffect } from 'react';
import type { AdminAppointmentModalProps } from '../types';
import { CloseIcon } from './icons';
import { DENTAL_SERVICES } from '../constants';

export const AdminAppointmentModal: React.FC<AdminAppointmentModalProps> = ({ appointment, onClose, onSave }) => {
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (appointment) {
             const { dateTime } = appointment;
             // Format date for datetime-local input
             const formattedDateTime = dateTime ? new Date(new Date(dateTime).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : '';
             setFormData({ ...appointment, dateTime: formattedDateTime });
        }
    }, [appointment]);

    if (!appointment) return null;

    const isNew = !('id' in appointment);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            dateTime: new Date(formData.dateTime).toISOString(),
        };
        onSave(finalData);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg">
                <form onSubmit={handleSave}>
                    <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{isNew ? 'Crear Nueva Cita' : 'Editar Cita'}</h2>
                        <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 w-8 h-8">
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Nombre</label>
                            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-2 text-slate-900 dark:text-white" />
                        </div>
                         <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Teléfono</label>
                            <input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-2 text-slate-900 dark:text-white" />
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Email</label>
                            <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-2 text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="dateTime" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Fecha y Hora</label>
                            <input type="datetime-local" name="dateTime" id="dateTime" value={formData.dateTime || ''} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-2 text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="service" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Servicio</label>
                             <select name="service" id="service" value={formData.service || ''} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-2 text-slate-900 dark:text-white">
                                <option value="" disabled>Seleccione un servicio</option>
                                 {DENTAL_SERVICES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                             </select>
                        </div>
                        {!isNew && (
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Estado</label>
                                 <select name="status" id="status" value={formData.status || 'confirmed'} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-2 text-slate-900 dark:text-white">
                                    <option value="confirmed">Confirmada</option>
                                    <option value="completed">Completada</option>
                                    <option value="canceled">Cancelada</option>
                                 </select>
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors">Cancelar</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};