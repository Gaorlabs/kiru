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
                <p className="font-semibold text-gray-800 dark:text-gray-200">{treatmentInfo.label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>
            {sessions.length > 0 ? (
                <div className="flex items-center space-x-2">
                    <select 
                        value={selectedSessionId}
                        onChange={(e) => setSelectedSessionId(e.target.value)}
                        className="flex-grow p-1 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="" disabled>Asignar a sesión...</option>
                        {sessions.map(session => (
                            <option key={session.id} value={session.id}>{session.name}</option>
                        ))}
                    </select>
                    <button 
                        onClick={handleAssign}
                        disabled={!selectedSessionId}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-md text-sm transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600"
                    >
                        Planificar
                    </button>
                </div>
            ) : (
                <p className="text-xs text-gray-500 dark:text-gray-500">Cree una sesión en el Plan de Tratamiento para continuar.</p>
            )}
        </li>
    );
}

export const ClinicalFindings: React.FC<ClinicalFindingsProps> = ({ findings, sessions, onAssignToSession }) => {
    return (
        <div>
            {findings.length === 0 ? (
                 <div className="text-center p-6 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">Seleccione un tratamiento y un diente para registrar un hallazgo.</p>
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