import React, { useState, useEffect } from 'react';
// FIX: Changed import to be a relative path.
import type { AdminPromotionModalProps, Promotion } from '../types';
import { CloseIcon } from './icons';

export const AdminPromotionModal: React.FC<AdminPromotionModalProps> = ({ promotion, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Promotion>>({
        title: '',
        subtitle: '',
        imageUrl: '',
        ctaText: '',
        details: '',
    });

    useEffect(() => {
        if (promotion) {
            setFormData(promotion);
        } else {
            setFormData({ title: '', subtitle: '', imageUrl: '', ctaText: '', details: '' });
        }
    }, [promotion]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { id, isActive, ...saveData } = formData;
        onSave({ id, ...(saveData as Omit<Promotion, 'id' | 'isActive'>) });
        onClose();
    };

    if (!promotion) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="p-4 flex justify-between items-center border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">{formData.id ? 'Editar Promoción' : 'Nueva Promoción'}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 w-8 h-8"><CloseIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-600 mb-1">Título</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="subtitle" className="block text-sm font-medium text-slate-600 mb-1">Subtítulo</label>
                        <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-600 mb-1">URL de la Imagen</label>
                        <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="ctaText" className="block text-sm font-medium text-slate-600 mb-1">Texto del Botón (CTA)</label>
                        <input type="text" name="ctaText" value={formData.ctaText} onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="details" className="block text-sm font-medium text-slate-600 mb-1">Detalles (un item por línea)</label>
                        <textarea name="details" value={formData.details} onChange={handleChange} required rows={4} className="w-full p-2 border border-slate-300 rounded-md"></textarea>
                    </div>
                </form>
                <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 font-semibold transition-colors">Cancelar</button>
                    <button type="submit" onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition-colors">Guardar</button>
                </div>
            </div>
        </div>
    );
};