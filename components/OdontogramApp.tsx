import React, { useState, useCallback, useMemo, useEffect, PropsWithChildren } from 'react';
import { Odontogram } from './Odontogram';
import { Toolbar } from './Toolbar';
import { TreatmentPlan } from './TreatmentPlan';
import type { OdontogramState, ToothCondition, ToothSurfaceName, WholeToothCondition, ToothState, AppliedTreatment, Session, ClinicalFinding, Appointment } from '../types';
import { ALL_TEETH_PERMANENT, ALL_TEETH_DECIDUOUS, DENTAL_TREATMENTS, QUADRANTS_PERMANENT, QUADRANTS_DECIDUOUS } from '../constants';
import { DentalIcon, PrintIcon, SaveIcon, MoonIcon, SunIcon, CalendarIcon } from './icons';
import { ClinicalFindings } from './ClinicalFindings';
import { PatientHeader } from './PatientHeader';
import { Tabs } from './Tabs';
import { StatusBar } from './StatusBar';
import { AgendaView } from './AgendaView';

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

interface OdontogramAppProps {
    appointments: Appointment[];
}

// FIX: Redefined TabPanel with a Props interface to fix an issue where TypeScript was not correctly inferring the `children` prop.
type TabPanelProps = PropsWithChildren<{
    title: React.ReactNode;
}>;

// FIX: Create a wrapper component for Tab panels to allow ReactNode in title prop,
// which is not supported by standard div elements. This component consumes the 'title'
// prop and only renders its children, preventing the 'title' from being passed to the DOM.
const TabPanel = ({ children }: TabPanelProps) => {
    return <>{children}</>;
};

export function OdontogramApp({ appointments }: OdontogramAppProps) {
    const [permanentState, setPermanentState] = useState<OdontogramState>(createInitialState(ALL_TEETH_PERMANENT));
    const [deciduousState, setDeciduousState] = useState<OdontogramState>(createInitialState(ALL_TEETH_DECIDUOUS));
    const [odontogramType, setOdontogramType] = useState<OdontogramType>('permanent');
    
    const [selectedTreatmentId, setSelectedTreatmentId] = useState<ToothCondition | WholeToothCondition | null>(null);
    const [activeTooth, setActiveTooth] = useState<{ toothId: number; surface: ToothSurfaceName | 'whole' } | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const isPermanent = odontogramType === 'permanent';
    const odontogramState = isPermanent ? permanentState : deciduousState;
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

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300">
            <header className="bg-slate-100 dark:bg-slate-800 shadow-md py-1 px-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center">
                    <div className="w-8 h-8 mr-2 text-teal-500 dark:text-teal-400"><DentalIcon /></div>
                    <h1 className="text-lg font-bold">Odontograma Digital</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <button title="Guardar" className="flex items-center justify-center w-8 h-8 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-md transition-colors">
                        <SaveIcon />
                    </button>
                    <button title="Imprimir" className="flex items-center justify-center w-8 h-8 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-md transition-colors">
                        <PrintIcon />
                    </button>
                     <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title={theme === 'light' ? 'Activar tema oscuro' : 'Activar tema claro'} className="flex items-center justify-center w-8 h-8 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-md transition-colors">
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                </div>
            </header>
            <main className="flex flex-1 overflow-hidden">
                <aside className="w-80 flex flex-col bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
                    <Tabs>
                        <TabPanel title="Diagnóstico">
                             <div className="p-4 space-y-4">
                                <Toolbar selectedTreatmentId={selectedTreatmentId} onSelectTreatment={setSelectedTreatmentId} />
                                {selectedTreatment && activeTooth && (
                                    <div className="mt-2">
                                        <button onClick={handleAddFinding} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md">
                                            Añadir Hallazgo: {selectedTreatment.label}
                                        </button>
                                         <p className="text-sm text-center text-slate-500 dark:text-gray-400 mt-1">en Diente {activeTooth.toothId}</p>
                                    </div>
                                )}
                                <hr className="border-slate-200 dark:border-slate-700"/>
                                <ClinicalFindings 
                                    findings={allFindings}
                                    sessions={sessions}
                                    onAssignToSession={handleAssignFindingToSession}
                                />
                            </div>
                        </TabPanel>
                        <TabPanel title="Plan de Tratamiento">
                            <div className="p-4">
                                <TreatmentPlan 
                                    sessions={sessions} 
                                    onAddSession={handleAddSession} 
                                    onToggleTreatmentStatus={handleToggleTreatmentStatus}
                                />
                            </div>
                        </TabPanel>
                         <TabPanel title={
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4"><CalendarIcon /></div>
                                Agenda
                            </span>
                         }>
                            <div className="p-4">
                               <AgendaView appointments={appointments} />
                            </div>
                        </TabPanel>
                    </Tabs>
                </aside>
                
                <div className="flex-1 flex flex-col p-4 overflow-hidden">
                    <PatientHeader />
                     <div className="flex items-center justify-center mb-4">
                        <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
                            <button onClick={() => setOdontogramType('permanent')} className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${odontogramType === 'permanent' ? 'bg-white dark:bg-white text-slate-800 shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Permanente</button>
                            <button onClick={() => setOdontogramType('deciduous')} className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${odontogramType === 'deciduous' ? 'bg-white dark:bg-white text-slate-800 shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Temporal</button>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex-1 flex flex-col items-center justify-center overflow-auto">
                         <Odontogram
                            quadrants={quadrants}
                            odontogramState={odontogramState}
                            onToothClick={setActiveTooth}
                            activeToothInfo={activeTooth}
                        />
                    </div>
                     <StatusBar activeTooth={activeTooth} selectedTreatment={selectedTreatment} />
                </div>
            </main>
        </div>
    );
}