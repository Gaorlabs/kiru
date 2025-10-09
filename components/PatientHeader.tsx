import React from 'react';
import type { Appointment } from '../types';

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <span className="text-sm text-slate-500 dark:text-slate-400">{label}: </span>
        <span className="font-semibold text-slate-800 dark:text-slate-100">{value}</span>
    </div>
);

interface PatientHeaderProps {
    patient: Appointment | null;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
    return (
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoItem label="Paciente" value={patient?.name || 'No seleccionado'} />
                <InfoItem label="ID Paciente" value={patient?.id || 'N/A'} />
                <InfoItem label="Teléfono" value={patient?.phone || 'N/A'} />
                <InfoItem label="Email" value={patient?.email || 'N/A'} />
            </div>
        </div>
    );
};