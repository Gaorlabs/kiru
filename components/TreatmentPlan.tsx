import React from 'react';
// FIX: Changed import to be a relative path.
import type { Session, AppliedTreatment } from '../types';
import { TREATMENTS_MAP } from '../constants';
// FIX: Changed import to be a relative path.
import { CheckIcon, UndoIcon, PlusIcon } from './icons';

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
            return <p className="text-gray-500 dark:text-gray-400 px-2 text-sm">No hay tratamientos en esta sección.</p>;
        }
        
        const borderColor = type === 'proposed' ? 'border-yellow-500/50' : 'border-green-500/50';

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
                        <li key={item.id} className={`flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md border-l-4 ${borderColor}`}>
                           <div className="flex items-center space-x-3">
                                <div className="w-5 h-5">
                                     {actionButton}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{treatmentInfo.label}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
                                </div>
                           </div>
                            <div className="text-right">
                                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">S/ {treatmentInfo.price.toFixed(2)}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">{session.name}</h4>
            
            <div className="mb-2">
                <h5 className="text-md font-semibold mb-2 text-yellow-600 dark:text-yellow-400">Propuestos</h5>
                {renderItems(proposedItems, 'proposed')}
                 <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold text-md text-gray-700 dark:text-gray-300">
                    <span>Subtotal:</span>
                    <span className="text-yellow-600 dark:text-yellow-400">S/ {proposedTotal.toFixed(2)}</span>
                </div>
            </div>

             <div className="mt-4">
                <h5 className="text-md font-semibold mb-2 text-green-600 dark:text-green-400">Completados</h5>
                {renderItems(completedItems, 'completed')}
                 <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold text-md text-gray-700 dark:text-gray-300">
                    <span>Subtotal:</span>
                    <span className="text-green-600 dark:text-green-400">S/ {completedTotal.toFixed(2)}</span>
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
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Plan de Tratamiento</h3>
                <button 
                    onClick={onAddSession}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors shadow flex items-center space-x-2"
                >
                    <PlusIcon className="w-5 h-5"/>
                    <span>Nueva Sesión</span>
                </button>
            </div>
            
            {sessions.length === 0 ? (
                <div className="text-center p-6 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">Añada una sesión para empezar a planificar.</p>
                </div>
            ) : (
                sessions.map(session => <SessionCard key={session.id} session={session} onToggleTreatmentStatus={onToggleTreatmentStatus} />)
            )}
            
            {sessions.length > 0 && (
                 <div className="mt-6 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-gray-100">
                        <span>Total General:</span>
                        <span>S/ {grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};