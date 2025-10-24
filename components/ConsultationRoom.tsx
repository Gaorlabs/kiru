import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Odontogram } from './Odontogram';
import { Toolbar } from './Toolbar';
import { TreatmentPlan } from './TreatmentPlan';
import type { OdontogramState, ToothCondition, ToothSurfaceName, WholeToothCondition, ToothState, AppliedTreatment, Session, ClinicalFinding, Appointment } from '../types';
import { ALL_TEETH_PERMANENT, ALL_TEETH_DECIDUOUS, DENTAL_TREATMENTS, QUADRANTS_PERMANENT, QUADRANTS_DECIDUOUS } from '../constants';
import { DentalIcon, SaveIcon, MoonIcon, SunIcon, CalendarIcon, ArrowLeftIcon, OdontogramIcon } from './icons';
import { ClinicalFindings } from './ClinicalFindings';
import { StatusBar } from './StatusBar';
import { AgendaView } from './AgendaView';
import { PatientFile } from './PatientFile';

const initialToothState: ToothState = {
    surfaces: { buccal: [], lingual: [], occlusal: [], distal: [], mesial: [], root: [] },
    whole: [],
    findings: [],
};

const createInitialState = (teeth: number[]): OdontogramState => {
    return teeth.reduce((acc, toothId) => {
        acc[toothId] = structuredClone(initialToothState);
        return acc;
    }, {} as OdontogramState);
};

type OdontogramType = 'permanent' | 'deciduous';
type Theme = 'light' | 'dark';
type MainView = 'odontogram' | 'plan' | 'agenda';

interface ConsultationRoomProps {
    allAppointments: Appointment[];
    isAuthenticated: boolean;
    onNavigateToAdmin: () => void;
    patient: Appointment | null;
}


export function ConsultationRoom({ allAppointments, isAuthenticated, onNavigateToAdmin, patient }: ConsultationRoomProps) {
    const [permanentState, setPermanentState] = useState<OdontogramState>(createInitialState(ALL_TEETH_PERMANENT));
    const [deciduousState, setDeciduousState] = useState<OdontogramState>(createInitialState(ALL_TEETH_DECIDUOUS));
    const [odontogramType, setOdontogramType] = useState<OdontogramType>('permanent');
    
    const [selectedTreatmentId, setSelectedTreatmentId] = useState<ToothCondition | WholeToothCondition | null>(null);
    const [activeTooth, setActiveTooth] = useState<{ toothId: number; surface: ToothSurfaceName | 'whole' } | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [theme, setTheme] = useState<Theme>('light');
    const [activeView, setActiveView] = useState<MainView>('odontogram');


    useEffect(() => {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
    }, [theme]);

    const isPermanent = odontogramType === 'permanent';
    const odontogramState = isPermanent ? permanentState : deciduousState;
    // FIX: Correctly assign the state setter function `setDeciduousState` instead of the state value `deciduousState`.
    const setOdontogramState = isPermanent ? setPermanentState : setDeciduousState;
    const quadrants = isPermanent ? QUADRANTS_PERMANENT : QUADRANTS_DECIDUOUS;
    
    const allFindings = useMemo(() => {
        const permanentFindings = Object.values(permanentState).flatMap((tooth: ToothState) => tooth.findings);
        const deciduousFindings = Object.values(deciduousState).flatMap((tooth: ToothState) => tooth.findings);
        return [...permanentFindings, ...deciduousFindings];
    }, [permanentState, deciduousState]);

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
            name: `Sesión ${sessions.length + 1}`,
            status: 'pending',
            treatments: [],
        };
        setSessions(prev => [...prev, newSession]);
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

        setSessions(prevSessions => prevSessions.map(session => 
            session.id === sessionId 
                ? { ...session, treatments: [...session.treatments, newTreatment] }
                : session
        ));
        
        const isFindingPermanent = ALL_TEETH_PERMANENT.includes(finding.toothId);
        const stateSetter = isFindingPermanent ? setPermanentState : setDeciduousState;

        stateSetter(prevState => {
            const newState = structuredClone(prevState);
            const tooth = newState[finding.toothId];
            tooth.findings = tooth.findings.filter(f => f.id !== finding.id);
            return newState;
        });
    };
    
    const handleToggleTreatmentStatus = (sessionId: string, treatmentId: string) => {
        let treatmentToUpdate: AppliedTreatment | null = null;

        const newSessions = sessions.map(session => {
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

        setSessions(newSessions);

        if (treatmentToUpdate) {
            const isToothPermanent = ALL_TEETH_PERMANENT.includes(treatmentToUpdate.toothId);
            const stateSetter = isToothPermanent ? setPermanentState : setDeciduousState;
            const finalTreatment = treatmentToUpdate;

            stateSetter(prevState => {
                const newState = structuredClone(prevState);
                const tooth = newState[finalTreatment.toothId];
                const treatmentInfo = DENTAL_TREATMENTS.find(t => t.id === finalTreatment.treatmentId);

                if (!treatmentInfo) return newState;

                const updateLocation = (location: 'surfaces' | 'whole', key: ToothSurfaceName | 'whole') => {
                    const targetArray = key === 'whole' ? tooth.whole : tooth.surfaces[key];
                    
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
                         updateLocation('surfaces', finalTreatment.surface);
                    }
                } else if (treatmentInfo.appliesTo === 'root' && (finalTreatment.surface === 'root' || finalTreatment.surface === 'whole')) {
                    updateLocation('surfaces', 'root');
                } else if (treatmentInfo.appliesTo === 'whole_tooth') {
                    updateLocation('whole', 'whole');
                    Object.keys(tooth.surfaces).forEach(s => {
                        tooth.surfaces[s as ToothSurfaceName] = [];
                    });
                }

                return newState;
            });
        }
    };
    
    const selectedTreatment = DENTAL_TREATMENTS.find(t => t.id === selectedTreatmentId) || null;
    
    const TabButton = ({ view, label, icon }: { view: MainView; label: string; icon: React.ReactNode }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
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
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 text-blue-600 dark:text-blue-400"><DentalIcon /></div>
                        <h1 className="text-xl font-bold">Sala de Consulta</h1>
                    </div>
                    {isAuthenticated && (
                        <button
                            onClick={onNavigateToAdmin}
                            className="flex items-center space-x-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <ArrowLeftIcon className="w-5 h-5"/>
                            <span>Panel Principal</span>
                        </button>
                    )}
                </div>
                <div className="flex items-center space-x-3">
                     <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title={theme === 'light' ? 'Activar tema oscuro' : 'Activar tema claro'} className="flex items-center justify-center w-9 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-full transition-colors">
                        {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5"/>}
                    </button>
                     <button title="Guardar Cambios" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm">
                        <SaveIcon className="w-5 h-5" />
                        <span>Guardar Cambios</span>
                    </button>
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Patient File */}
                <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
                    <PatientFile patient={patient} allAppointments={allAppointments} />
                </aside>
                
                {/* Main Content Area */}
                <main className="flex-1 flex flex-col p-4 overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                        <nav className="flex space-x-2">
                            <TabButton view="odontogram" label="Odontograma" icon={<OdontogramIcon className="w-5 h-5"/>} />
                            <TabButton view="plan" label="Plan de Tratamiento" icon={<CalendarIcon className="w-5 h-5"/>} />
                            <TabButton view="agenda" label="Agenda" icon={<CalendarIcon className="w-5 h-5"/>} />
                        </nav>
                    </div>

                    <div className="flex-1 overflow-y-auto">
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
                         {activeView === 'plan' && (
                            <div className="p-2">
                                <TreatmentPlan 
                                    sessions={sessions} 
                                    onAddSession={handleAddSession} 
                                    onToggleTreatmentStatus={handleToggleTreatmentStatus}
                                />
                            </div>
                         )}
                         {activeView === 'agenda' && (
                             <div className="p-2">
                               <AgendaView appointments={allAppointments} />
                            </div>
                         )}
                    </div>
                </main>

                {/* Right Sidebar - Tools */}
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
                            sessions={sessions}
                            onAssignToSession={handleAssignFindingToSession}
                        />
                    </div>
                </aside>
            </div>
        </div>
    );
}