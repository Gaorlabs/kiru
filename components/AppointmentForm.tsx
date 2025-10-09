import React, { useState, useMemo } from 'react';
import type { Appointment } from '../types';
import { CloseIcon } from './icons';

interface AppointmentFormProps {
    onClose: () => void;
    onBookAppointment: (appointmentData: Omit<Appointment, 'id'>) => void;
}

const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() + i);
        
        // Skip Sundays (day 0)
        if (date.getDay() === 0) continue;

        const daySlots = [];
        for (let hour = 9; hour < 19; hour++) {
            const slotDate = new Date(date);
            slotDate.setHours(hour, 0, 0, 0);
            daySlots.push(slotDate);
        }
        slots.push({
            date: date.toISOString().split('T')[0],
            slots: daySlots,
        });
    }
    return slots;
};

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ onClose, onBookAppointment }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const timeSlotsByDay = useMemo(() => generateTimeSlots(), []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot || !name || !email || !phone) {
            alert('Por favor, complete todos los campos y seleccione un horario.');
            return;
        }
        onBookAppointment({ name, phone, email, dateTime: selectedSlot });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        // Adjust for timezone offset to show the correct local day
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-2xl font-bold text-slate-800">Agendar Cita</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 w-8 h-8">
                        <CloseIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-slate-700">1. Tus Datos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-600">Nombre Completo</label>
                                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-600">Teléfono</label>
                                <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-slate-600">Correo Electrónico</label>
                                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-slate-700">2. Elige un Horario</h3>
                        <div className="space-y-4">
                            {timeSlotsByDay.map(({ date, slots }) => (
                                <div key={date}>
                                    <h4 className="font-semibold capitalize text-slate-600 mb-2">{formatDate(date)}</h4>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                        {slots.map(slot => (
                                            <button 
                                                type="button"
                                                key={slot.toISOString()}
                                                onClick={() => setSelectedSlot(slot.toISOString())}
                                                className={`p-2 rounded-md border text-sm font-semibold transition-colors ${
                                                    selectedSlot === slot.toISOString() 
                                                    ? 'bg-blue-600 text-white border-blue-700 shadow' 
                                                    : 'bg-slate-100 hover:bg-blue-100 border-slate-300'
                                                }`}
                                            >
                                                {slot.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
                
                <div className="p-4 border-t bg-slate-50 rounded-b-xl">
                    <button 
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!selectedSlot || !name || !email || !phone}
                        className="w-full bg-pink-600 text-white px-8 py-3 rounded-md hover:bg-pink-700 font-semibold shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                    >
                        Confirmar Cita
                    </button>
                </div>
            </div>
        </div>
    );
};
