import React from 'react';
import type { Appointment } from '../types';
import { UserIcon, PhoneIcon, EmailIcon, CalendarIcon } from './icons';

interface PatientFileProps {
    patient: Appointment | null;
    allAppointments: Appointment[];
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

export const PatientFile: React.FC<PatientFileProps> = ({ patient, allAppointments }) => {
    
    const patientHistory = allAppointments
        .filter(app => app.email === patient?.email)
        .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

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
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{patient.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID Paciente: {patient.id}</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4 border border-gray-200 dark:border-gray-700">
                <InfoCard label="Teléfono" value={patient.phone} icon={<PhoneIcon />} />
                <InfoCard label="Email" value={patient.email} icon={<EmailIcon />} />
            </div>
            
            <div>
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Alertas Médicas</h3>
                <div className="p-3 text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg border border-yellow-200 dark:border-yellow-800/50">
                    Alergia a la penicilina.
                </div>
            </div>

            <div>
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">Historial de Citas</h3>
                <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {patientHistory.map(app => (
                        <li key={app.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{new Date(app.dateTime).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Estado: <span className="font-medium capitalize">{app.status.replace('_', ' ')}</span></p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};