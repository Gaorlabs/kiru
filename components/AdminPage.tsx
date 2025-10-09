import React, { useState } from 'react';
import type { Appointment, AppSettings } from '../types';
import { DENTAL_SERVICES_MAP } from '../constants';
import { DentalIcon, CalendarIcon, SettingsIcon, UserIcon, OdontogramIcon } from './icons'; // Assuming OdontogramIcon exists
import { AdminAppointmentModal } from './AdminAppointmentModal';

interface AdminPageProps {
    appointments: Appointment[];
    onUpdateAppointment: (appointment: Appointment) => void;
    settings: AppSettings;
    onUpdateSettings: (settings: AppSettings) => void;
    onNavigateToOdontogram: () => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

export const AdminPage: React.FC<AdminPageProps> = ({ appointments, onUpdateAppointment, settings, onUpdateSettings, onNavigateToOdontogram }) => {
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const upcomingAppointments = appointments.filter(a => new Date(a.dateTime) > new Date() && a.status === 'confirmed');
    const totalAppointmentsToday = appointments.filter(a => new Date(a.dateTime).toDateString() === new Date().toDateString()).length;

    const handleEditClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200">
            <header className="bg-white dark:bg-slate-800 shadow py-3 px-6 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 text-blue-600 dark:text-blue-400"><DentalIcon /></div>
                    <h1 className="text-xl font-bold">Panel de Administración</h1>
                 </div>
                 <button 
                    onClick={onNavigateToOdontogram}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                 >
                    <div className="w-5 h-5"><UserIcon/></div> {/* Placeholder icon */}
                    <span>Ir al Odontograma</span>
                 </button>
            </header>
            <main className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <StatCard title="Citas de Hoy" value={totalAppointmentsToday} icon={<CalendarIcon />} />
                    <StatCard title="Próximas Citas" value={upcomingAppointments.length} icon={<CalendarIcon />} />
                    <StatCard title="Pacientes Totales" value={appointments.length} icon={<UserIcon />} />
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Próximas Citas</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                                <tr>
                                    <th className="py-2 px-4">Paciente</th>
                                    <th className="py-2 px-4">Fecha y Hora</th>
                                    <th className="py-2 px-4">Servicio</th>
                                    <th className="py-2 px-4">Estado</th>
                                    <th className="py-2 px-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcomingAppointments.map(app => (
                                    <tr key={app.id} className="border-b border-slate-100 dark:border-slate-700/50">
                                        <td className="py-3 px-4 font-medium">{app.name}</td>
                                        <td className="py-3 px-4">{new Date(app.dateTime).toLocaleString('es-ES')}</td>
                                        <td className="py-3 px-4">{DENTAL_SERVICES_MAP[app.service] || app.service}</td>
                                        <td className="py-3 px-4">
                                            <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">{app.status}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <button onClick={() => handleEditClick(app)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">Editar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            {selectedAppointment && <AdminAppointmentModal appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} onSave={onUpdateAppointment} />}
        </div>
    );
};
