import React, { useState } from 'react';
import type { TreatmentPlanItem } from '../types';

interface TreatmentPlanProps {
    plan: TreatmentPlanItem[];
    onUpdatePlan: (plan: TreatmentPlanItem[]) => void;
}

export const TreatmentPlan: React.FC<TreatmentPlanProps> = ({ plan, onUpdatePlan }) => {
    const [newItem, setNewItem] = useState<Partial<TreatmentPlanItem>>({
        pieza: '', procedimiento: '', estado: 'pendiente', costoEstimado: 0
    });

    const handleAddItem = () => {
        if (!newItem.pieza || !newItem.procedimiento) return;
        const item: TreatmentPlanItem = {
            id: crypto.randomUUID(),
            pieza: newItem.pieza,
            procedimiento: newItem.procedimiento,
            estado: newItem.estado as any,
            costoEstimado: newItem.costoEstimado || 0,
        };
        onUpdatePlan([...plan, item]);
        setNewItem({ pieza: '', procedimiento: '', estado: 'pendiente', costoEstimado: 0 });
    };

    const handleDeleteItem = (id: string) => {
        onUpdatePlan(plan.filter(i => i.id !== id));
    };

    const handleStatusChange = (id: string, estado: string) => {
        onUpdatePlan(plan.map(i => i.id === id ? { ...i, estado: estado as any } : i));
    };

    const totalPendiente = plan.filter(i => i.estado === 'pendiente').reduce((sum, i) => sum + i.costoEstimado, 0);
    const totalCompletado = plan.filter(i => i.estado === 'completado').reduce((sum, i) => sum + i.costoEstimado, 0);

    return (
        <div className="max-w-5xl mx-auto py-6">
            <h3 className="text-2xl font-bold text-slate-100 mb-6 font-sans">Plan de Tratamiento</h3>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                <h4 className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-4">Añadir Tratamiento</h4>
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 uppercase font-semibold">Pieza</label>
                        <input type="text" value={newItem.pieza} onChange={e => setNewItem({...newItem, pieza: e.target.value})}
                            className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 w-24 focus:outline-none focus:border-teal-500" placeholder="Ej: 46" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-[200px]">
                        <label className="text-xs text-slate-500 uppercase font-semibold">Procedimiento</label>
                        <input type="text" value={newItem.procedimiento} onChange={e => setNewItem({...newItem, procedimiento: e.target.value})}
                            className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 w-full focus:outline-none focus:border-teal-500" placeholder="Ej: Obturación Resina Compleja" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 uppercase font-semibold">S/ Estimado</label>
                        <input type="number" value={newItem.costoEstimado || ''} onChange={e => setNewItem({...newItem, costoEstimado: parseFloat(e.target.value) || 0})}
                            className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 w-32 focus:outline-none focus:border-teal-500" placeholder="0.00" />
                    </div>
                    <button onClick={handleAddItem} className="bg-teal-600 hover:bg-teal-500 text-white font-medium py-2 px-6 rounded-lg text-sm transition-colors">
                        Agregar
                    </button>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-950/50 border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Pieza</th>
                            <th className="px-6 py-4 font-semibold">Procedimiento</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold text-right">Costo Est.</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {plan.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center bg-slate-900">
                                    No hay tratamientos planificados.
                                </td>
                            </tr>
                        ) : plan.map(item => (
                            <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                                <td className="px-6 py-4 font-medium text-slate-200">{item.pieza}</td>
                                <td className="px-6 py-4 text-slate-300">{item.procedimiento}</td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={item.estado}
                                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                        className={`text-xs font-semibold rounded-full px-3 py-1 outline-none appearance-none cursor-pointer ${
                                            item.estado === 'completado' ? 'bg-teal-900/30 text-teal-400 border border-teal-800' :
                                            item.estado === 'en_curso' ? 'bg-amber-900/30 text-amber-500 border border-amber-800' :
                                            'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="en_curso">En Curso</option>
                                        <option value="completado">Completado</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right text-slate-200">S/ {item.costoEstimado.toFixed(2)}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDeleteItem(item.id)} className="text-red-400 hover:text-red-300">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="bg-slate-950/50 border-t border-slate-800 p-6 flex justify-end gap-12">
                    <div className="text-right">
                        <p className="text-xs uppercase text-slate-500 font-semibold mb-1">Total Pendiente</p>
                        <p className="text-xl font-bold text-amber-500">S/ {totalPendiente.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs uppercase text-slate-500 font-semibold mb-1">Total Completado</p>
                        <p className="text-xl font-bold text-teal-500">S/ {totalCompletado.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};