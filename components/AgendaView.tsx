import React, { useState, useMemo } from 'react';
import type { Appointment } from '../types';
import { DENTAL_SERVICES_MAP } from '../constants';
import { CalendarIcon } from './icons';

interface AgendaViewProps {
    appointments: Appointment[];
}

export const AgendaView: React.FC<AgendaViewProps> = ({ appointments }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const days = useMemo(() => Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + i);
        return date;
    }), []);

    const timeSlots = useMemo(() => {
        const slots = [];
        const now = new Date();
        const isToday = selectedDate.toDateString() === now.toDateString();

        for (let hour = 9; hour < 19; hour++) {
            const slotStart = new Date(selectedDate);
            slotStart.setHours(hour, 0, 0, 0);

            const slotEnd = new Date(slotStart);
            slotEnd.setMinutes(slotStart.getMinutes() + 35);

            const appointmentInSlot = appointments.find(app => {
                const appDate = new Date(app.dateTime);
                return appDate.getFullYear() === slotStart.getFullYear() &&
                       appDate.getMonth() === slotStart.getMonth() &&
                       appDate.getDate() === slotStart.getDate() &&
                       appDate.getHours() === slotStart.getHours();
            });

            slots.push({
                start: slotStart,
                end: slotEnd,
                isBooked: !!appointmentInSlot,
                appointment: appointmentInSlot,
                isPast: isToday && slotStart < now,
            });
        }
        return slots;
    }, [selectedDate, appointments]);
    
    const appointmentsByDay = useMemo(() => {
        // FIX: Changed the reduce function to type the initial value instead of using a type argument on the function call for better compatibility.
        return appointments.reduce((acc, app) => {
            const dateStr = new Date(app.dateTime).toDateString();
            acc[dateStr] = (acc[dateStr] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [appointments]);

    const formatTime = (date: Date) => date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    return (
        <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-200 mb-4">Agenda Semanal</h3>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Days Column */}
                <div className="lg:w-1/3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                    {days.map(day => {
                        const dayStr = day.toDateString();
                        const isSelected = dayStr === selectedDate.toDateString();
                        const appointmentCount = appointmentsByDay[dayStr] || 0;
                        
                        return (
                            <button
                                key={dayStr}
                                onClick={() => setSelectedDate(day)}
                                className={`p-4 rounded-xl text-center transition-all duration-200 transform hover:scale-105 ${
                                    isSelected 
                                        ? 'bg-white dark:bg-slate-800 ring-2 ring-blue-500 shadow-lg' 
                                        : 'bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700/50'
                                }`}
                            >
                                <p className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400">{day.toLocaleDateString('es-ES', { weekday: 'long' })}</p>
                                <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 my-1">{day.getDate()}</p>
                                <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">{day.toLocaleDateString('es-ES', { month: 'short' })}</p>
                                {appointmentCount > 0 && (
                                    <div className="mt-2 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded-full px-2 py-0.5 text-xs font-semibold">
                                        {appointmentCount} Cita{appointmentCount > 1 ? 's' : ''}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Time Slots Column */}
                <div className="lg:w-2/3">
                     <h4 className="text-lg font-semibold text-teal-600 dark:text-teal-400 mb-3 pb-2 border-b border-slate-300 dark:border-slate-600 capitalize">
                        Horarios para {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h4>
                    {timeSlots.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {timeSlots.map(slot => (
                                <div
                                    key={slot.start.toISOString()}
                                    className={`p-4 rounded-lg border-l-4 ${
                                        slot.isBooked 
                                            ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-500' 
                                            : slot.isPast 
                                                ? 'bg-slate-100 dark:bg-slate-800/60 border-slate-400 text-slate-400 dark:text-slate-500' 
                                                : 'bg-white dark:bg-slate-800 border-green-500'
                                    }`}
                                >
                                    <p className="font-bold text-slate-800 dark:text-slate-100">{formatTime(slot.start)} - {formatTime(slot.end)}</p>
                                    {slot.isBooked && slot.appointment ? (
                                        <div className="mt-2">
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{slot.appointment.name}</p>
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{DENTAL_SERVICES_MAP[slot.appointment.service] || slot.appointment.service}</p>
                                        </div>
                                    ) : slot.isPast ? (
                                         <p className="text-sm font-semibold mt-2">No disponible</p>
                                    ) : (
                                        <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-2">Disponible</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center p-6 bg-slate-100 dark:bg-slate-700/50 rounded-lg h-full flex flex-col justify-center items-center">
                            <div className="w-16 h-16 text-slate-400 dark:text-slate-500 mb-4">
                                <CalendarIcon />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400">No hay horarios disponibles para este día.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};