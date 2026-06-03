import React from 'react';
import type { Appointment, PatientRecord } from '../types';
import { PhoneIcon, EmailIcon } from './icons';

interface PatientFileProps {
    patient: Appointment | null;
    record: PatientRecord;
    onUpdateRecord: (updated: Partial<PatientRecord>) => void;
}

const InfoCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex items-start">
        <div className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 mt-1 flex-shrink-0">{icon}</div>
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    </div>
);

export const PatientFile: React.FC<PatientFileProps> = ({ patient, record, onUpdateRecord }) => {
    
    if (!patient) {
        return (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <p>No se ha seleccionado ningún paciente.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{record.name}</h2>
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    ID: {record.patientId}
                </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                <InfoCard label="Teléfono" value={record.phone} icon={<PhoneIcon />} />
                <InfoCard label="Email" value={record.email} icon={<EmailIcon />} />
            </div>
            
            <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Alertas Médicas</h3>
                <textarea
                    value={record.medicalAlerts}
                    onChange={(e) => onUpdateRecord({ medicalAlerts: e.target.value })}
                    className="w-full text-sm p-3 rounded-lg border border-red-200 bg-red-50 text-red-900 placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-900/10 dark:border-red-900/50 dark:text-red-200"
                    placeholder="Ej. Alergia a Penicilina, Hipertensión..."
                    rows={3}
                />
            </div>

            <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Antecedentes Odontológicos</h3>
                <textarea
                    value={record.dentalHistory}
                    onChange={(e) => onUpdateRecord({ dentalHistory: e.target.value })}
                    className="w-full text-sm p-3 rounded-lg border border-gray-200 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                    placeholder="Historia de tratamientos previos relevantes..."
                    rows={4}
                />
            </div>
        </div>
    );
};