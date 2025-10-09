import React from 'react';
import type { Appointment } from '../types';

interface AgendaViewProps {
    appointments: Appointment[];
}

export const AgendaView: React.FC<AgendaViewProps> = ({ appointments }) => {
    
    const groupedAppointments = appointments.reduce((acc, appointment) => {
        const date = new Date(appointment.dateTime).toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(appointment);
        return acc;
    }, {} as Record<string, Appointment[]>);

    const formatDateHeader = (dateString: string) => {
        const date = new Date(dateString);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-200 mb-4">Agenda de Citas</h3>
            {appointments.length === 0 ? (
                <div className="text-center p-6 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-slate-500 dark:text-slate-400">No hay citas agendadas.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedAppointments).map(([date, appointmentsForDay]) => (
                        <div key={date}>
                            <h4 className="text-lg font-semibold text-teal-600 dark:text-teal-400 mb-2 pb-1 border-b border-slate-300 dark:border-slate-600 capitalize">
                                {formatDateHeader(date)}
                            </h4>
                            <ul className="space-y-3">
                                {appointmentsForDay.map(app => (
                                    <li key={app.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-start space-x-4">
                                        <div className="bg-blue-500 text-white font-bold rounded-md p-2 text-center w-20">
                                            <span className="block text-xl">
                                                {new Date(app.dateTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-100">{app.name}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{app.email}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{app.phone}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
