import React, { useState, useEffect } from 'react';
import type { Appointment, PatientRecord, ClinicalSession, TreatmentPlanItem } from '../types';
import { DentalIcon, SaveIcon, ArrowLeftIcon, CalendarIcon, BriefcaseIcon, PlusIcon } from './icons';
import { PatientFile } from './PatientFile';
import { ClinicalHistory } from './ClinicalHistory';
import { TreatmentPlan } from './TreatmentPlan';
import { ClinicalSessionFlow } from './ClinicalSessionFlow';

type MainView = 'new_session' | 'history' | 'plan';

interface ConsultationRoomProps {
    allAppointments: Appointment[];
    isAuthenticated: boolean;
    onNavigateToAdmin: () => void;
    patient: Appointment | null;
    patientRecord: PatientRecord;
    onSave: (record: PatientRecord) => void;
}

export function ConsultationRoom({ isAuthenticated, onNavigateToAdmin, patient, patientRecord, onSave }: ConsultationRoomProps) {
    const [record, setRecord] = useState(patientRecord);
    const [activeView, setActiveView] = useState<MainView>('history');

    useEffect(() => {
        setRecord(patientRecord);
    }, [patientRecord]);
    
    // Always enforce dark mode for clinical view
    useEffect(() => {
        document.documentElement.classList.add('dark');
        return () => document.documentElement.classList.remove('dark');
    }, []);

    const handleUpdateRecord = (fields: Partial<PatientRecord>) => {
        setRecord(prev => ({ ...prev, ...fields }));
    };

    const handleSaveSession = (session: ClinicalSession) => {
        setRecord(prev => {
            const newRecord = { ...prev, sessions: [...prev.sessions, session] };
            
            // If they registered treatments, optionally add them as completed in the plan
            if (session.procedimientos && session.procedimientos.length > 0) {
                 const newPlans: TreatmentPlanItem[] = session.procedimientos.map(proc => ({
                     id: crypto.randomUUID(),
                     pieza: session.piezasTratadas || '',
                     procedimiento: proc,
                     estado: 'completado',
                     costoEstimado: session.montoCobrado / session.procedimientos!.length
                 }));
                 newRecord.treatmentPlan = [...newRecord.treatmentPlan, ...newPlans];
            }
            
            return newRecord;
        });
        setActiveView('history');
    };

    const handleUpdateSession = (sessionId: string, fields: Partial<ClinicalSession>) => {
        setRecord(prev => ({
            ...prev,
            sessions: prev.sessions.map(s => s.id === sessionId ? { ...s, ...fields } : s)
        }));
    };

    const handleUpdatePlan = (plan: TreatmentPlanItem[]) => {
        setRecord(prev => ({ ...prev, treatmentPlan: plan }));
    };

    const TabButton = ({ view, label, icon }: { view: MainView; label: string; icon: React.ReactNode }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center space-x-2 px-5 py-3 text-sm font-semibold transition-all border-b-2 ${
                activeView === view
                    ? 'border-teal-500 text-teal-400 bg-slate-800/50'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans">
            <header className="bg-slate-900 py-3 px-6 flex items-center justify-between border-b border-slate-800 z-10 shadow-md">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 text-teal-500"><DentalIcon /></div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">Ficha Clínica Kiru</h1>
                    </div>
                    {isAuthenticated && (
                        <button
                            onClick={onNavigateToAdmin}
                            className="flex items-center space-x-2 text-sm font-semibold text-slate-400 hover:text-teal-400 transition-colors py-2 px-3 rounded-lg hover:bg-slate-800"
                        >
                            <ArrowLeftIcon className="w-4 h-4"/>
                            <span>Volver a Agenda</span>
                        </button>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => onSave(record)} className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-5 rounded-lg transition-colors shadow-lg shadow-teal-900/20">
                        <SaveIcon className="w-4 h-4" />
                        <span>Guardar Ficha</span>
                    </button>
                </div>
            </header>
            
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-80 bg-slate-900 border-r border-slate-800 p-6 overflow-y-auto shrink-0 shadow-lg z-0">
                    <PatientFile patient={patient} record={record} onUpdateRecord={handleUpdateRecord} />
                </aside>
                
                {/* Main Content */}
                <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
                    <div className="bg-slate-900 border-b border-slate-800 px-6 shrink-0 z-10">
                        <nav className="flex space-x-4">
                            <TabButton view="new_session" label="Flujo de Atención" icon={<PlusIcon className="w-5 h-5"/>} />
                            <TabButton view="history" label="Historial Clínico" icon={<BriefcaseIcon className="w-5 h-5"/>} />
                            <TabButton view="plan" label="Plan de Tratamiento" icon={<CalendarIcon className="w-5 h-5"/>} />
                        </nav>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8">
                        {activeView === 'new_session' && (
                            <ClinicalSessionFlow 
                                doctorId={patient?.doctorId || ''} 
                                onSaveSession={handleSaveSession}
                                onCancel={() => setActiveView('history')}
                            />
                        )}
                         {activeView === 'plan' && (
                            <TreatmentPlan 
                                plan={record.treatmentPlan}
                                onUpdatePlan={handleUpdatePlan}
                            />
                         )}
                         {activeView === 'history' && (
                            <ClinicalHistory 
                                sessions={record.sessions} 
                                onUpdateSession={handleUpdateSession} 
                            />
                         )}
                    </div>
                </main>
            </div>
        </div>
    );
}