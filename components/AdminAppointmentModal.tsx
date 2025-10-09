import React, { useState, useEffect } from 'react';
import type { AdminAppointmentModalProps, Appointment } from '../types';
import { DENTAL_SERVICES } from '../constants';
import { CloseIcon, UserIcon, PhoneIcon, EmailIcon, ServiceIcon, CalendarIcon, BriefcaseIcon } from './icons';

export const AdminAppointmentModal: React.FC<AdminAppointmentModalProps> = ({ appointment, doctors, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Appointment>>({
        name: '',
        phone: '',
        email: '',
        dateTime: '',
        service: '',
        doctorId: '',
        status: 'confirmed',
    });

    useEffect(() => {
        if (appointment) {
            const localDateTime = appointment.dateTime ? new Date(appointment.dateTime).toISOString().slice(0, 16) : '';
            setFormData({ ...appointment, dateTime: localDateTime });
        }
    }, [appointment]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { id, ...saveData } = formData;
        
        const dataToSave = {
            ...saveData,
            id: id,
            dateTime: new Date(formData.dateTime || '').toISOString(),
        } as Omit<Appointment, 'id'> & { id?: string };

        onSave(dataToSave);
        onClose();
    };

    if (!appointment) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{formData.id ? 'Editar Cita' : 'Nueva Cita'}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 w-8 h-8">
                        <CloseIcon />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Nombre Paciente</label>
                        <div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" /><input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full pl-10 p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" /></div>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Teléfono</label>
                        <div className="relative"><PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" /><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full pl-10 p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" /></div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label>
                        <div className="relative"><EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" /><input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-10 p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" /></div>
                    </div>
                    <div>
                        <label htmlFor="dateTime" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Fecha y Hora</label>
                        <div className="relative"><CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" /><input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} required className="w-full pl-10 p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" /></div>
                    </div>
                    <div>
                        <label htmlFor="service" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Servicio</label>
                        <div className="relative"><ServiceIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" /><select name="service" value={formData.service} onChange={handleChange} required className="w-full pl-10 p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"><option value="" disabled>Seleccione un servicio</option>{DENTAL_SERVICES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
                    </div>
                    <div>
                        <label htmlFor="doctorId" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Doctor</label>
                        <div className="relative"><BriefcaseIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" /><select name="doctorId" value={formData.doctorId} onChange={handleChange} className="w-full pl-10 p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"><option value="">Sin asignar</option>{doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                    </div>
                     <div>
                        <label htmlFor="status" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Estado</label>
                        <select name="status" value={formData.status} onChange={handleChange} required className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700">
                            <option value="confirmed">Confirmada</option>
                            <option value="completed">Completada</option>
                            <option value="canceled">Cancelada</option>
                        </select>
                    </div>
                </form>
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-b-xl flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold transition-colors">Cancelar</button>
                    <button type="submit" onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition-colors">Guardar</button>
                </div>
            </div>
        </div>
    );
};