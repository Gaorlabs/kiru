
import React from 'react';
// FIX: Changed import to be a relative path.
import type { Session, AppliedTreatment } from '../types';
import { TREATMENTS_MAP } from '../constants';
// FIX: Changed import to be a relative path.
import { CheckIcon, UndoIcon } from './icons';

interface TreatmentPlanProps {
    sessions: Session[];
    onAddSession: () => void;
    onToggleTreatmentStatus: (sessionId: string, treatmentId: string) => void;
}

const SessionCard: React.FC<{ session: Session; onToggleTreatmentStatus: (sessionId: string, treatmentId: string) => void; }> = ({ session, onToggleTreatmentStatus }) => {
    const proposedItems = session.treatments.filter(t => t.status === 'proposed');
    const completedItems = session.treatments.filter(t => t.status === 'completed');

    const calculateTotal = (items: AppliedTreatment[]): number => {
        return items.reduce((total, item) => {
            const treatmentInfo = TREATMENTS_MAP[item.treatmentId];
            return total + (treatmentInfo ? treatmentInfo.price : 0);
        }, 0);
    };

    const proposedTotal = calculateTotal(proposedItems);
    const completedTotal = calculateTotal(completedItems);

    const renderItems = (items: AppliedTreatment[], type: 'proposed' | 'completed') => {
        if (items.length === 0) {
            return <p className="text-slate-500 dark:text-slate-400 px-2 text-sm">No hay tratamientos en esta sección.</p>;
        }
        
        const borderColor = type === 'proposed' ? 'border-red-500/50' : 'border-blue-500/50';

        return (
             <ul className="space-y-2">
                {items.map((item) => {
                    const treatmentInfo = TREATMENTS_MAP[item.treatmentId];
                    if (!treatmentInfo) return null;
                    
                    let description = `Diente: ${item.toothId}`;
                    if (treatmentInfo.appliesTo === 'surface' || treatmentInfo.appliesTo === 'root') {
                        description += ` - Sup: ${item.surface}`;
                    }

                    const actionButton = type === 'proposed' ? (
                        <button 
                            onClick={() => onToggleTreatmentStatus(session.id, item.id)}
                            className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                            title="Marcar como completado"
                        >
                            <CheckIcon />
                        </button>
                    ) : (
                         <button 
                            onClick={() => onToggleTreatmentStatus(session.id, item.id)}
                            className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors"
                            title="Marcar como propuesto"
                        >
                            <UndoIcon />
                        </button>
                    );


                    return (
                        <li key={item.id} className={`flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md border-l-4 ${borderColor}`}>
                           <div className="flex items-center space-x-3">
                                <div className="w-5 h-5">
                                     {actionButton}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{treatmentInfo.label}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
                                </div>
                           </div>
                            <div className="text-right">
                                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">S/ {treatmentInfo.price.toFixed(2)}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
            <h4 className="text-lg font-semibold mb-3 text-slate-900 dark:text-slate-100">{session.name}</h4>
            
            <div className="mb-2">
                <h5 className="text-md font-semibold mb-2 text-red-500 dark:text-red-400">Propuestos</h5>
                {renderItems(proposedItems, 'proposed')}
                 <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-md text-slate-700 dark:text-slate-300">
                    <span>Subtotal:</span>
                    <span className="text-red-500 dark:text-red-400">S/ {proposedTotal.toFixed(2)}</span>
                </div>
            </div>

             <div className="mt-4">
                <h5 className="text-md font-semibold mb-2 text-blue-500 dark:text-blue-400">Completados</h5>
                {renderItems(completedItems, 'completed')}
                 <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-md text-slate-700 dark:text-slate-300">
                    <span>Subtotal:</span>
                    <span className="text-blue-500 dark:text-blue-400">S/ {completedTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export const TreatmentPlan: React.FC<TreatmentPlanProps> = ({ sessions, onAddSession, onToggleTreatmentStatus }) => {
    const grandTotal = sessions.reduce((total, session) => {
        return total + session.treatments.reduce((sessionTotal, treatment) => {
             const treatmentInfo = TREATMENTS_MAP[treatment.treatmentId];
             return sessionTotal + (treatmentInfo ? treatmentInfo.price : 0);
        }, 0);
    }, 0);
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-200">Plan de Tratamiento</h3>
                <button 
                    onClick={onAddSession}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-3 rounded-lg text-sm transition-colors shadow"
                >
                    + Nueva Sesión
                </button>
            </div>
            
            {sessions.length === 0 ? (
                <div className="text-center p-6 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-slate-500 dark:text-slate-400">Añada una sesión para empezar a planificar.</p>
                </div>
            ) : (
                sessions.map(session => <SessionCard key={session.id} session={session} onToggleTreatmentStatus={onToggleTreatmentStatus} />)
            )}
            
            {sessions.length > 0 && (
                 <div className="mt-6 pt-4 border-t-2 border-slate-300 dark:border-slate-700 flex justify-between font-bold text-xl text-slate-900 dark:text-slate-100">
                    <span>Total General:</span>
                    <span>S/ {grandTotal.toFixed(2)}</span>
                </div>
            )}
        </div>
    );
};