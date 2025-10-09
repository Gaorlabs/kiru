import React, { useState, useEffect } from 'react';
import type { Appointment } from '../types';
import { CloseIcon, UserIcon, PhoneIcon, EmailIcon, ServiceIcon, CalendarIcon } from './icons';
import { DENTAL_SERVICES } from '../constants';

interface AdminAppointmentModalProps {
    appointment: Appointment | null;
    onClose: () => void;
    onSave: (appointment: Appointment) => void;
}

export const AdminAppointmentModal: React.FC<AdminAppointmentModalProps> = ({ appointment, onClose, onSave }) => {
    const [formData, setFormData] = useState<Appointment | null>(null);

    useEffect(() => {
        setFormData(appointment);
    }, [appointment]);

    if (!formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSave = () => {
        if (formData) {
            onSave(formData);
            onClose();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Editar Cita</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 w-8 h-8">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                     {/* Fields */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Nombre</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-2" />
                    </div>
                    <div>
                        <label htmlFor="dateTime" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Fecha y Hora</label>
                        <input type="datetime-local" name="dateTime" value={new Date(formData.dateTime).toISOString().substring(0, 16)} onChange={(e) => handleChange({ target: { name: 'dateTime', value: new Date(e.target.value).toISOString() } } as any)} className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-2" />
                    </div>
                    <div>
                        <label htmlFor="service" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Servicio</label>
                         <select name="service" value={formData.service} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-2">
                             {DENTAL_SERVICES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                         </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Estado</label>
                         <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-2">
                            <option value="confirmed">Confirmada</option>
                            <option value="completed">Completada</option>
                            <option value="canceled">Cancelada</option>
                         </select>
                    </div>
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl flex justify-end gap-3">
                    <button onClick={onClose} className="bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors">Cancelar</button>
                    <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Guardar Cambios</button>
                </div>
            </div>
        </div>
    );
};
