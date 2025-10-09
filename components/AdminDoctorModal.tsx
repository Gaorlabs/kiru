import React, { useState, useEffect } from 'react';
import type { AdminDoctorModalProps, Doctor } from '../types';
import { CloseIcon, UserIcon, BriefcaseIcon } from './icons';

export const AdminDoctorModal: React.FC<AdminDoctorModalProps & { theme: 'light' | 'dark' }> = ({ doctor, onClose, onSave, theme }) => {
    const [formData, setFormData] = useState<Partial<Doctor>>({ name: '', specialty: '' });

    useEffect(() => {
        if (doctor) {
            setFormData(doctor);
        }
    }, [doctor]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { id, ...saveData } = formData;
        onSave({ id, ...(saveData as Omit<Doctor, 'id'>) });
        onClose();
    };

    if (!doctor) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md ${theme}`}>
                <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{formData.id ? 'Editar Doctor' : 'Nuevo Doctor'}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 w-8 h-8"><CloseIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Nombre Completo</label>
                        <div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" /><input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full pl-10 p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white" /></div>
                    </div>
                    <div>
                        <label htmlFor="specialty" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Especialidad</label>
                        <div className="relative"><BriefcaseIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" /><input type="text" name="specialty" value={formData.specialty} onChange={handleChange} required className="w-full pl-10 p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white" /></div>
                    </div>
                
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-b-xl flex justify-end gap-3 -mx-6 -mb-6 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold transition-colors">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition-colors">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};