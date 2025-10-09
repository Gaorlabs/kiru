import React from 'react';

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <span className="text-sm text-slate-500 dark:text-slate-400">{label}: </span>
        <span className="font-semibold text-slate-800 dark:text-slate-100">{value}</span>
    </div>
);

export const PatientHeader: React.FC = () => {
    return (
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoItem label="Paciente" value="Juan Pérez" />
                <InfoItem label="ID Paciente" value="789456" />
                <InfoItem label="Edad" value="34 años" />
                <InfoItem label="Sexo" value="Masculino" />
            </div>
        </div>
    );
};