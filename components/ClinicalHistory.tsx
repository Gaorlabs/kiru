import React, { useState } from 'react';
import type { ClinicalSession } from '../types';
import { InteractiveOdontogram } from './InteractiveOdontogram';

interface ClinicalHistoryProps {
    sessions: ClinicalSession[];
    onUpdateSession: (sessionId: string, updatedData: Partial<ClinicalSession>) => void;
}

const SessionCard: React.FC<{ session: ClinicalSession, index: number, isExpanded: boolean, onToggle: () => void }> = ({ session, index, isExpanded, onToggle }) => {
    return (
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-800 transition-all duration-200">
            {/* Header (always visible) */}
            <div 
                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors ${isExpanded ? 'bg-slate-800 border-b border-slate-700' : ''}`}
                onClick={onToggle}
            >
                <div className="flex flex-col">
                    <span className="text-sm font-semibold tracking-wider text-teal-400">
                        Sesión {index} · {new Date(session.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-slate-300 font-medium mt-1">
                        {session.motivoConsulta ? session.motivoConsulta.substring(0, 50) + (session.motivoConsulta.length > 50 ? '...' : '') : 'Mantenimiento preventivo'}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    {session.urgency === 'urgencia' || session.urgency === 'emergencia' ? (
                        <span className="px-2 py-1 text-xs font-bold rounded bg-amber-900/40 text-amber-500 uppercase border border-amber-800/50">
                            {session.urgency}
                        </span>
                    ) : null}
                    <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="p-5 space-y-6 animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Motivo */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">1. Motivo de Consulta</h4>
                            <div className="bg-slate-800/50 border border-slate-800 p-3 rounded-lg text-sm text-slate-300">
                                <p><span className="font-medium text-slate-400">Descripción:</span> {session.motivoConsulta || '-'}</p>
                                <p className="mt-1"><span className="font-medium text-slate-400">Escala de Dolor:</span> {session.painScale}/10</p>
                            </div>
                        </div>

                        {/* Tratamiento Realizado */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">4. Tratamiento Realizado</h4>
                            <div className="bg-slate-800/50 border border-slate-800 p-3 rounded-lg text-sm text-slate-300">
                                <p><span className="font-medium text-slate-400">Piezas:</span> {session.piezasTratadas || '-'}</p>
                                <p className="mt-1"><span className="font-medium text-slate-400">Procedimientos:</span> {session.procedimientos?.join(', ') || '-'}</p>
                                <p className="mt-1"><span className="font-medium text-slate-400">Material/Anestesia:</span> {session.material} {session.anestesia ? `/ ${session.anestesia}` : ''}</p>
                            </div>
                        </div>
                    </div>

                    {/* Examen / Odontograma */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">2. Odontograma y Observaciones</h4>
                        <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-2">
                            <InteractiveOdontogram 
                                odontogramData={session.odontograma} 
                                onChange={()=>{}} 
                                examenObservaciones={session.examenObservaciones} 
                                onChangeObservaciones={()=>{}} 
                                readOnly={true} 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Diagnóstico */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">3. Diagnóstico</h4>
                            <div className="bg-slate-800/50 border border-slate-800 p-3 rounded-lg text-sm text-slate-300 h-full">
                                <p><span className="font-medium text-slate-400">CIE-10:</span> {session.cie10 || '-'}</p>
                                <p className="mt-1"><span className="font-medium text-slate-400">Descripción:</span> {session.diagnosticoDesc || '-'}</p>
                            </div>
                        </div>

                        {/* Cierre */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">5. Cierre de Sesión</h4>
                            <div className="bg-slate-800/50 border border-slate-800 p-3 rounded-lg text-sm text-slate-300 h-full">
                                <p><span className="font-medium text-slate-400">Receta:</span> {session.receta || '-'}</p>
                                <p className="mt-1"><span className="font-medium text-slate-400">Indicaciones:</span> {session.indicaciones || '-'}</p>
                                {session.proximaCitaFecha && (
                                    <p className="mt-1"><span className="font-medium text-slate-400">Próxima Cita:</span> {session.proximaCitaFecha} ({session.proximaCitaMotivo})</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const ClinicalHistory: React.FC<ClinicalHistoryProps> = ({ sessions, onUpdateSession }) => {
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const [expandedId, setExpandedId] = useState<string | null>(sortedSessions.length > 0 ? sortedSessions[0].id : null);
    
    return (
        <div className="max-w-4xl mx-auto py-6">
            <h3 className="text-2xl font-bold text-slate-100 mb-6 font-sans">Línea de Tiempo</h3>
            {sortedSessions.length === 0 ? (
                <div className="text-center p-10 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    </div>
                    <p className="text-slate-300 font-medium text-lg">Aún no hay sesiones registradas.</p>
                    <p className="text-sm text-slate-500 mt-2">Inicie una nueva sesión en el Flujo de Atención.</p>
                </div>
            ) : (
                <div className="space-y-4 relative">
                    <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-800 z-0"></div>
                    {sortedSessions.map((session, i) => (
                        <div key={session.id} className="relative z-10">
                            <SessionCard 
                                session={session} 
                                index={sortedSessions.length - i}
                                isExpanded={expandedId === session.id}
                                onToggle={() => setExpandedId(expandedId === session.id ? null : session.id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};