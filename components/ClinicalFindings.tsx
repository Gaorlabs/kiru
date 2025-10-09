
import React, { useState } from 'react';
// FIX: Changed import to be a relative path.
import type { ClinicalFinding, Session } from '../types';
import { TREATMENTS_MAP } from '../constants';

interface ClinicalFindingsProps {
    findings: ClinicalFinding[];
    sessions: Session[];
    onAssignToSession: (finding: ClinicalFinding, sessionId: string) => void;
}

const FindingItem: React.FC<{ finding: ClinicalFinding; sessions: Session[]; onAssignToSession: (finding: ClinicalFinding, sessionId: string) => void; }> = ({ finding, sessions, onAssignToSession }) => {
    const [selectedSessionId, setSelectedSessionId] = useState<string>('');
    const treatmentInfo = TREATMENTS_MAP[finding.condition];
    
    if (!treatmentInfo) return null;

    let description = `Diente: ${finding.toothId}`;
    if (treatmentInfo.appliesTo !== 'whole_tooth') {
        description += ` - Sup: ${finding.surface}`;
    }

    const handleAssign = () => {
        if (selectedSessionId) {
            onAssignToSession(finding, selectedSessionId);
        }
    }

    return (
        <li className="p-3 bg-red-500/10 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500/50 space-y-2">
            <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{treatmentInfo.label}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
            </div>
            {sessions.length > 0 ? (
                <div className="flex items-center space-x-2">
                    <select 
                        value={selectedSessionId}
                        onChange={(e) => setSelectedSessionId(e.target.value)}
                        className="flex-grow p-1 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white focus:ring-teal-500 focus:border-teal-500"
                    >
                        <option value="" disabled>Asignar a sesión...</option>
                        {sessions.map(session => (
                            <option key={session.id} value={session.id}>{session.name}</option>
                        ))}
                    </select>
                    <button 
                        onClick={handleAssign}
                        disabled={!selectedSessionId}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-md text-sm transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        Planificar
                    </button>
                </div>
            ) : (
                <p className="text-xs text-slate-500 dark:text-slate-500">Cree una sesión en el Plan de Tratamiento para continuar.</p>
            )}
        </li>
    );
}

export const ClinicalFindings: React.FC<ClinicalFindingsProps> = ({ findings, sessions, onAssignToSession }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-slate-100">Hallazgos Clínicos</h3>
            {findings.length === 0 ? (
                 <div className="text-center p-6 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-slate-500 dark:text-slate-400">Seleccione un tratamiento y un diente para registrar un hallazgo.</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {findings.map(finding => (
                        <FindingItem 
                            key={finding.id} 
                            finding={finding}
                            sessions={sessions} 
                            onAssignToSession={onAssignToSession}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};