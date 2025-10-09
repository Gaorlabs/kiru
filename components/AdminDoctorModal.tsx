import React, { useState, useEffect } from 'react';
import type { AdminDoctorModalProps } from '../types';
import { CloseIcon } from './icons';

export const AdminDoctorModal: React.FC<AdminDoctorModalProps> = ({ doctor, onClose, onSave }) => {
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (doctor) {
             setFormData(doctor);
        }
    }, [doctor]);

    if (!doctor) return null;

    const isNew = !('id' in doctor);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg">
                <form onSubmit={handleSave}>
                    <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{isNew ? 'Añadir Nuevo Doctor' : 'Editar Doctor'}</h2>
                        <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 w-8 h-8">
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Nombre Completo</label>
                            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-2 text-slate-900 dark:text-white" />
                        </div>
                         <div>
                            <label htmlFor="specialty" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Especialidad</label>
                            <input type="text" name="specialty" id="specialty" value={formData.specialty || ''} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-2 text-slate-900 dark:text-white" />
                        </div>
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