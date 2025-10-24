import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Odontogram } from './Odontogram';
import { Toolbar } from './Toolbar';
import { TreatmentPlan } from './TreatmentPlan';
import type { OdontogramState, ToothCondition, ToothSurfaceName, WholeToothCondition, ToothState, AppliedTreatment, Session, ClinicalFinding, Appointment, PatientRecord, Prescription, ConsentForm } from '../types';
import { ALL_TEETH_PERMANENT, ALL_TEETH_DECIDUOUS, DENTAL_TREATMENTS, QUADRANTS_PERMANENT, QUADRANTS_DECIDUOUS } from '../constants';
import { DentalIcon, SaveIcon, MoonIcon, SunIcon, CalendarIcon, ArrowLeftIcon, OdontogramIcon, BriefcaseIcon, ChevronLeftIcon, ChevronRightIcon, FileTextIcon, ClipboardListIcon, DollarSignIcon } from './icons';
import { ClinicalFindings } from './ClinicalFindings';
import { StatusBar } from './StatusBar';
import { PatientFile } from './PatientFile';
import { ClinicalHistory } from './ClinicalHistory';
import { Prescriptions } from './Prescriptions';
import { Consents } from './Consents';
import { Accounts } from './Accounts';

type OdontogramType = 'permanent' | 'deciduous';
type Theme = 'light' | 'dark';
type MainView = 'odontogram' | 'plan' | 'history' | 'prescriptions' | 'consents' | 'accounts';

interface ConsultationRoomProps {
    patient: Appointment;
    patientRecord: PatientRecord;
    onSave: (record: PatientRecord) => void;
    onNavigateToAdmin: () => void;
    onNavigateToPatient: (direction: 'next' | 'previous') => void;
    isFirstPatient: boolean;
    isLastPatient: boolean;
}


export function ConsultationRoom({ patient, patientRecord, onSave, onNavigateToAdmin, onNavigateToPatient, isFirstPatient, isLastPatient }: ConsultationRoomProps) {
    const [record, setRecord] = useState(patientRecord);
    const [theme, setTheme] = useState<Theme>('light');
    const [activeView, setActiveView] = useState<MainView>('odontogram');
    const [odontogramType, setOdontogramType] = useState<OdontogramType>('permanent');
    const [selectedTreatmentId, setSelectedTreatmentId] = useState<ToothCondition | WholeToothCondition | null>(null);
    const [activeTooth, setActiveTooth] = useState<{ toothId: number; surface: ToothSurfaceName | 'whole' } | null>(null);
    
    useEffect(() => {
        setRecord(patientRecord);
    }, [patientRecord]);

    useEffect(() => {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
    }, [theme]);
    
    const isPermanent = odontogramType === 'permanent';
    const odontogramState = isPermanent ? record.permanentOdontogram : record.deciduousOdontogram;
    
    const setOdontogramState = (updater: React.SetStateAction<OdontogramState>) => {
        setRecord(prev => {
            const newOdontogramState = typeof updater === 'function' ? updater(isPermanent ? prev.permanentOdontogram : prev.deciduousOdontogram) : updater;
            if (isPermanent) {
                return { ...prev, permanentOdontogram: newOdontogramState };
            } else {
                return { ...prev, deciduousOdontogram: newOdontogramState };
            }
        });
    };

    const allFindings = useMemo(() => {
        const permanentFindings = Object.values(record.permanentOdontogram).flatMap((tooth: ToothState) => tooth.findings);
        const deciduousFindings = Object.values(record.deciduousOdontogram).flatMap((tooth: ToothState) => tooth.findings);
        return [...permanentFindings, ...deciduousFindings];
    }, [record.permanentOdontogram, record.deciduousOdontogram]);

    const handleAddFinding = useCallback(() => {
        if (!selectedTreatmentId || !activeTooth) return;
        
        const treatmentInfo = DENTAL_TREATMENTS.find(t => t.id === selectedTreatmentId);
        if (!treatmentInfo) return;

        setOdontogramState(prevState => {
            const newState = structuredClone(prevState);
            const { toothId, surface } = activeTooth;
            const tooth = newState[toothId];

            const newFinding: ClinicalFinding = {
                id: crypto.randomUUID(),
                toothId: toothId,
                surface: surface,
                condition: selectedTreatmentId,
            };
            
            const alreadyExists = tooth.findings.some(f => f.toothId === toothId && f.surface === surface && f.condition === selectedTreatmentId);
            if (!alreadyExists) {
                tooth.findings.push(newFinding);
            }

            return newState;
        });

    }, [selectedTreatmentId, activeTooth, setOdontogramState]);

    const handleAddSession = () => {
        const newSession: Session = {
            id: crypto.randomUUID(),
            name: `Sesión ${record.sessions.length + 1}`,
            status: 'pending',
            treatments: [],
            date: new Date().toISOString(),
            notes: '',
            documents: [],
        };
        setRecord(prev => ({...prev, sessions: [...prev.sessions, newSession]}));
    };

    const handleAssignFindingToSession = (finding: ClinicalFinding, sessionId: string) => {
        const treatmentInfo = DENTAL_TREATMENTS.find(t => t.id === finding.condition);
        if (!treatmentInfo) return;

        const newTreatment: AppliedTreatment = {
            id: crypto.randomUUID(),
            treatmentId: finding.condition,
            toothId: finding.toothId,
            surface: finding.surface,
            status: 'proposed',
            sessionId: sessionId,
        };
        
        const isFindingPermanent = ALL_TEETH_PERMANENT.includes(finding.toothId);
        const targetOdontogramKey = isFindingPermanent ? 'permanentOdontogram' : 'deciduousOdontogram';

        setRecord(prev => {
            const newRecord = structuredClone(prev);
            // Add treatment to session
            const session = newRecord.sessions.find(s => s.id === sessionId);
            if (session) {
                session.treatments.push(newTreatment);
            }
            // Remove finding from odontogram
            const tooth = newRecord[targetOdontogramKey][finding.toothId];
            tooth.findings = tooth.findings.filter(f => f.id !== finding.id);
            return newRecord;
        });
    };
    
    const handleToggleTreatmentStatus = (sessionId: string, treatmentId: string) => {
        let treatmentToUpdate: AppliedTreatment | null = null;
        
        const newSessions = record.sessions.map(session => {
            if (session.id !== sessionId) return session;
            
            const newTreatments = session.treatments.map(treatment => {
                if (treatment.id === treatmentId) {
                    const updatedTreatment: AppliedTreatment = {
                        ...treatment,
                        status: treatment.status === 'proposed' ? 'completed' : 'proposed'
                    };
                    treatmentToUpdate = updatedTreatment;
                    return updatedTreatment;
                }
                return treatment;
            });
            return { ...session, treatments: newTreatments };
        });

        if (treatmentToUpdate) {
            const finalTreatment = treatmentToUpdate;
            const isToothPermanent = ALL_TEETH_PERMANENT.includes(finalTreatment.toothId);
            const targetOdontogramKey = isToothPermanent ? 'permanentOdontogram' : 'deciduousOdontogram';
            
            setRecord(prev => {
                 const newRecord = structuredClone(prev);
                 newRecord.sessions = newSessions;
                 
                 const tooth = newRecord[targetOdontogramKey][finalTreatment.toothId];
                 const treatmentInfo = DENTAL_TREATMENTS.find(t => t.id === finalTreatment.treatmentId);

                 if (treatmentInfo) {
                    const updateLocation = (key: ToothSurfaceName | 'whole') => {
                        const targetArray = key === 'whole' ? tooth.whole : tooth.surfaces[key as ToothSurfaceName];
                        const existingIndex = targetArray.findIndex(t => t.id === finalTreatment.id);
                        if (existingIndex > -1) {
                            targetArray[existingIndex] = finalTreatment;
                        } else {
                            targetArray.push(finalTreatment);
                        }
                    };
                     if (treatmentInfo.appliesTo === 'surface' && finalTreatment.surface !== 'whole' && finalTreatment.surface !== 'root') {
                         if (finalTreatment.treatmentId === 'crown') {
                            Object.keys(tooth.surfaces).forEach(s => {
                                if (s !== 'root') tooth.surfaces[s as ToothSurfaceName] = [finalTreatment];
                            });
                        } else {
                             updateLocation(finalTreatment.surface as ToothSurfaceName);
                        }
                    } else if (treatmentInfo.appliesTo === 'root' && (finalTreatment.surface === 'root' || finalTreatment.surface === 'whole')) {
                        updateLocation('root');
                    } else if (treatmentInfo.appliesTo === 'whole_tooth') {
                        updateLocation('whole');
                        Object.keys(tooth.surfaces).forEach(s => {
                            tooth.surfaces[s as ToothSurfaceName] = [];
                        });
                    }
                 }
                 return newRecord;
            });
        } else {
            setRecord(prev => ({...prev, sessions: newSessions}));
        }
    };

    const handleUpdateSession = (sessionId: string, updatedData: Partial<Session>) => {
        setRecord(prev => ({
            ...prev,
            sessions: prev.sessions.map(s => s.id === sessionId ? {...s, ...updatedData} : s)
        }))
    };
    
    const handleUpdatePrescriptions = (prescriptions: Prescription[]) => {
        setRecord(prev => ({ ...prev, prescriptions }));
    };

    const handleUpdateConsents = (consents: ConsentForm[]) => {
        setRecord(prev => ({ ...prev, consents }));
    };
    
    const selectedTreatment = DENTAL_TREATMENTS.find(t => t.id === selectedTreatmentId) || null;
    const quadrants = isPermanent ? QUADRANTS_PERMANENT : QUADRANTS_DECIDUOUS;
    
    const TabButton = ({ view, label, icon }: { view: MainView; label: string; icon: React.ReactNode }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center space-x-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                activeView === view
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
            <header className="bg-white dark:bg-gray-800 py-2 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                     <button
                        onClick={onNavigateToAdmin}
                        className="flex items-center space-x-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <ArrowLeftIcon className="w-5 h-5"/>
                        <span>Panel</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onNavigateToPatient('previous')} disabled={isFirstPatient} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronLeftIcon /></button>
                        <span className="font-semibold text-lg">{patient?.name}</span>
                        <button onClick={() => onNavigateToPatient('next')} disabled={isLastPatient} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronRightIcon /></button>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                     <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title={theme === 'light' ? 'Activar tema oscuro' : 'Activar tema claro'} className="flex items-center justify-center w-9 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-full transition-colors">
                        {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5"/>}
                    </button>
                     <button onClick={() => onSave(record)} title="Guardar Cambios" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm">
                        <SaveIcon className="w-5 h-5" />
                        <span>Guardar Cambios</span>
                    </button>
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
                    <PatientFile patient={patient} record={record} />
                </aside>
                
                <main className="flex-1 flex flex-col p-4 overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                        <nav className="flex space-x-1">
                            <TabButton view="odontogram" label="Odontograma" icon={<OdontogramIcon className="w-5 h-5"/>} />
                            <TabButton view="plan" label="Plan Tratamiento" icon={<CalendarIcon className="w-5 h-5"/>} />
                            <TabButton view="history" label="Historial" icon={<BriefcaseIcon className="w-5 h-5"/>} />
                            <TabButton view="prescriptions" label="Recetas" icon={<FileTextIcon className="w-5 h-5"/>} />
                            <TabButton view="consents" label="Consentimientos" icon={<ClipboardListIcon className="w-5 h-5"/>} />
                            <TabButton view="accounts" label="Cuentas" icon={<DollarSignIcon className="w-5 h-5"/>} />
                        </nav>
                    </div>

                    <div className="flex-1 overflow-y-auto p-1">
                        {activeView === 'odontogram' && (
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                                        <button onClick={() => setOdontogramType('permanent')} className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${odontogramType === 'permanent' ? 'bg-white dark:bg-gray-100 text-gray-800 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>Permanente</button>
                                        <button onClick={() => setOdontogramType('deciduous')} className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${odontogramType === 'deciduous' ? 'bg-white dark:bg-gray-100 text-gray-800 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>Temporal</button>
                                    </div>
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 flex flex-col items-center justify-center overflow-auto">
                                    <Odontogram
                                        quadrants={quadrants}
                                        odontogramState={odontogramState}
                                        onToothClick={setActiveTooth}
                                        activeToothInfo={activeTooth}
                                    />
                                </div>
                                <StatusBar activeTooth={activeTooth} selectedTreatment={selectedTreatment} />
                            </div>
                        )}
                         {activeView === 'plan' && <TreatmentPlan sessions={record.sessions} onAddSession={handleAddSession} onToggleTreatmentStatus={handleToggleTreatmentStatus}/>}
                         {activeView === 'history' && <ClinicalHistory sessions={record.sessions} onUpdateSession={handleUpdateSession} />}
                         {activeView === 'prescriptions' && <Prescriptions prescriptions={record.prescriptions} onUpdate={handleUpdatePrescriptions} patientName={patient.name} />}
                         {activeView === 'consents' && <Consents consents={record.consents} onUpdate={handleUpdateConsents} />}
                         {activeView === 'accounts' && <Accounts sessions={record.sessions} patientName={patient?.name || ''} />}
                    </div>
                </main>

                <aside className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Simbología y Diagnóstico</h3>
                        <Toolbar selectedTreatmentId={selectedTreatmentId} onSelectTreatment={setSelectedTreatmentId} />
                        {selectedTreatment && activeTooth && (
                            <div className="mt-4">
                                <button onClick={handleAddFinding} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md">
                                    Añadir Hallazgo: {selectedTreatment.label}
                                </button>
                                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-1">en Diente {activeTooth.toothId}, Sup. {activeTooth.surface}</p>
                            </div>
                        )}
                    </div>
                    <hr className="border-gray-200 dark:border-gray-700"/>
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Hallazgos Clínicos</h3>
                        <ClinicalFindings 
                            findings={allFindings}
                            sessions={record.sessions}
                            onAssignToSession={handleAssignFindingToSession}
                        />
                    </div>
                </aside>
            </div>
        </div>
    );
}