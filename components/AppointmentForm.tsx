
import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import type { Appointment } from '../types';
import { CloseIcon, UserIcon, PhoneIcon, EmailIcon, ServiceIcon, ChevronDownIcon, AppointmentIcon } from './icons';
import { DENTAL_SERVICES } from '../constants';

interface AppointmentFormProps {
    onClose: () => void;
    onBookAppointment: (appointmentData: Omit<Appointment, 'id' | 'status'>) => void;
}

const generateTimeSlots = () => {
    const daysWithSlots = [];
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Start from today

    while (daysWithSlots.length < 3) {
        // Move to the next day if it's today and past working hours, or if it's a weekend.
        const now = new Date();
        const endOfDay = new Date(currentDate);
        endOfDay.setHours(17, 0, 0, 0); // Assuming last slot starts before 5 PM
        
        // Skip weekends (Sunday=0, Saturday=6)
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
        }

        const daySlots = [];
        // Set start time to 9:00 AM for the current day
        const slotStartTime = new Date(currentDate);
        slotStartTime.setHours(9, 0, 0, 0);

        // Generate a maximum of 8 slots
        for (let i = 0; i < 8; i++) {
             // Only add slots that are in the future
            if (new Date() < slotStartTime) {
                daySlots.push(new Date(slotStartTime));
            }
            // Add 50 minutes (30 min appointment + 20 min break) for the next slot
            slotStartTime.setMinutes(slotStartTime.getMinutes() + 50);
        }
        
        if (daySlots.length > 0) {
            daysWithSlots.push({
                date: new Date(currentDate),
                slots: daySlots,
            });
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return daysWithSlots;
};


export const AppointmentForm: React.FC<AppointmentFormProps> = ({ onClose, onBookAppointment }) => {
    const [step, setStep] = useState<'form' | 'success' | 'final'>('form');
    const [copied, setCopied] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [service, setService] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);

    const timeSlotsByDay = useMemo(() => generateTimeSlots(), []);
    
    const selectedDaySlots = useMemo(() => {
        if (!selectedDate) return [];
        return timeSlotsByDay.find(day => day.date.toDateString() === selectedDate.toDateString())?.slots || [];
    }, [selectedDate, timeSlotsByDay]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot || !name || !phone || !service) {
            alert('Por favor, complete todos los campos, seleccione un servicio y un horario.');
            return;
        }
        onBookAppointment({ name, phone, email: '', dateTime: selectedSlot, service });
        setStep('success');
    };
    
    if (step === 'success') {
        const whatsappNumber = '51987654321'; // Número de ejemplo
        const serviceName = DENTAL_SERVICES.find(s => s.id === service)?.label || service;
        const formattedDate = selectedDate ? selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : '';
        const formattedTime = selectedSlot ? new Date(selectedSlot).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }) : '';
        
        const whatsappMessage = encodeURIComponent(`Hola Kiru Dental. Acabo de registrar mi cita para el servicio de ${serviceName} el ${formattedDate} a las ${formattedTime}. Mi nombre es ${name}. En breve adjunto el pago por Yape para confirmar la cita.`);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

        const handleCopyYape = () => {
            navigator.clipboard.writeText('987654321');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };

        const handleConfirmAppointment = async () => {
            const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
            if (webhookUrl) {
                setIsSending(true);
                try {
                    await fetch(webhookUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            event: 'appointment_registered',
                            name,
                            phone,
                            service: serviceName,
                            date: formattedDate,
                            time: formattedTime,
                            rawDateTime: selectedSlot,
                            message: `Hola Kiru Dental. Acabo de registrar mi cita para el servicio de ${serviceName} el ${formattedDate} a las ${formattedTime}. Mi nombre es ${name}. En breve adjunto el pago por Yape para confirmar la cita.`,
                            status: 'pending_payment',
                        }),
                    });
                } catch (err) {
                    console.error('Error enviando datos al webhook de n8n:', err);
                } finally {
                    setIsSending(false);
                    setStep('final');
                }
            } else {
                // Si no hay Webhook URL, abrimos el WhatsApp de forma tradicional
                window.open(whatsappUrl, '_blank');
                setStep('final');
            }
        };

        return (
            <div className="fixed inset-0 bg-brand-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm sm:p-6 overflow-y-auto">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-sm flex flex-col relative overflow-hidden"
                >
                    <div className="p-8 text-center bg-gradient-to-br from-brand-50 to-white">
                        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-brand-900 transition-colors p-2 hover:bg-brand-50 rounded-full">
                            <CloseIcon />
                        </button>
                        <div className="w-20 h-20 bg-brand-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-500/30">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h2 className="text-2xl font-extrabold text-brand-900 mb-2">¡Cita Registrada!</h2>
                        <p className="text-slate-600 mb-6 font-medium">Tu solicitud ha sido recibida correctamente.</p>
                        
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-left relative">
                            <h4 className="text-brand-800 font-bold mb-3 flex items-center">
                                <span className="w-2 h-2 bg-brand-500 rounded-full mr-2"></span>
                                Confirmación y Pago
                            </h4>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                Puedes pagar tu consulta por adelantado para asegurar tu cita, o pagar el día de la consulta.
                            </p>
                            
                            <div className="space-y-3 mb-4">
                                {/* Yape / Plin */}
                                <div className="bg-white border-2 border-brand-100 rounded-lg p-3 text-center shadow-sm relative group cursor-pointer hover:border-brand-300 transition-colors" onClick={handleCopyYape} title="Haz clic para copiar">
                                    <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Yape / Plin</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <p className="text-2xl font-black text-brand-700 font-mono tracking-widest">987 654 321</p>
                                        <button className="text-brand-500 hover:text-brand-600 transition-colors">
                                            {copied ? (
                                                 <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            ) : (
                                                <svg className="w-5 h-5 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                            )}
                                        </button>
                                    </div>
                                    <p className={`text-xs mt-1 transition-colors ${copied ? 'text-green-600 font-semibold' : 'text-slate-500'}`}>
                                        {copied ? '¡Número copiado!' : 'A nombre de: Kiru Dental EIRL'}
                                    </p>
                                </div>
                                <div className="text-xs text-slate-500 text-center font-medium">
                                    También aceptamos Transferencia Bancaria, Visa o Efectivo en el consultorio.
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={isSending}
                            onClick={handleConfirmAppointment}
                            className={`flex items-center justify-center w-full ${isSending ? 'bg-slate-400' : 'bg-[#25D366] hover:bg-[#128C7E]'} text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-[#25D366]/30 transition-all text-lg transform hover:scale-105 disabled:cursor-not-allowed`}
                        >
                            {isSending ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enviando confirmación...
                                </span>
                            ) : (
                                <>
                                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                    Confirmar por WhatsApp
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (step === 'final') {
        return (
            <div className="fixed inset-0 bg-brand-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm sm:p-6 overflow-y-auto">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-sm flex flex-col relative overflow-hidden"
                >
                    <div className="p-8 text-center bg-gradient-to-br from-brand-50 to-white">
                        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-brand-900 transition-colors p-2 hover:bg-brand-50 rounded-full">
                            <CloseIcon />
                        </button>
                        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h2 className="text-2xl font-extrabold text-brand-900 mb-2">¡Pedido Realizado!</h2>
                        <p className="text-slate-600 mb-8 font-medium">Gracias por confiar en Kiru Dental. Te esperamos.</p>
                        
                        <button 
                            onClick={onClose}
                            className="flex items-center justify-center w-full bg-slate-900 text-white px-6 py-4 rounded-xl hover:bg-slate-800 font-bold shadow-lg shadow-slate-900/20 transition-all text-lg transform hover:scale-105"
                        >
                            Volver a la Página Principal
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-brand-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm sm:p-6 overflow-y-auto">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden"
            >
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-4 md:px-8 md:py-6 border-b border-brand-100 flex justify-between items-center z-20">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 text-brand-600 bg-brand-50 p-2 rounded-full"><AppointmentIcon /></div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-brand-900">Agendar Cita</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-brand-900 transition-colors p-2 hover:bg-brand-50 rounded-full">
                        <CloseIcon />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                     <motion.div
                         initial={{ x: -20, opacity: 0 }}
                         animate={{ x: 0, opacity: 1 }}
                         transition={{ delay: 0.1 }}
                     >
                        <h3 className="text-xl font-bold text-brand-700 mb-6 flex items-center border-b border-brand-100 pb-2">
                            <span className="bg-brand-100 text-brand-700 w-8 h-8 rounded-full flex justify-center items-center mr-3 text-sm">1</span>
                            Tus Datos Personales
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-brand-800 mb-2">Nombre Completo</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-400 w-10">
                                        <UserIcon />
                                    </div>
                                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-base text-brand-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium placeholder:text-slate-400" placeholder="Ej. Ana Torres" />
                                </div>
                            </div>
                            {/* Phone Field */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-brand-800 mb-2">Teléfono</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-400 w-10">
                                        <PhoneIcon />
                                    </div>
                                    <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-base text-brand-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium placeholder:text-slate-400" placeholder="Ej. 987 654 321"/>
                                </div>
                            </div>

                            {/* Service Field */}
                            <div className="md:col-span-2">
                                <label htmlFor="service" className="block text-sm font-semibold text-brand-800 mb-2">Tipo de Servicio</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-400 w-10">
                                        <ServiceIcon />
                                    </div>
                                    <select 
                                        id="service" 
                                        value={service} 
                                        onChange={e => setService(e.target.value)} 
                                        required 
                                        className="appearance-none block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-10 text-base text-brand-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                                    >
                                        <option value="" disabled>Seleccione el motivo de su visita</option>
                                        {DENTAL_SERVICES.map(s => (
                                            <option key={s.id} value={s.id}>{s.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-brand-500">
                                        <ChevronDownIcon />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div
                         initial={{ x: -20, opacity: 0 }}
                         animate={{ x: 0, opacity: 1 }}
                         transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-xl font-bold text-brand-700 mb-6 flex items-center border-b border-brand-100 pb-2">
                            <span className="bg-brand-100 text-brand-700 w-8 h-8 rounded-full flex justify-center items-center mr-3 text-sm">2</span>
                            Elige un Día
                        </h3>
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {timeSlotsByDay.map(({ date }, index) => {
                                const isSelected = selectedDate?.toDateString() === date.toDateString();
                                return (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        key={date.toISOString()}
                                        onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                                        className={`p-4 rounded-2xl text-center border-2 transition-all duration-300 cursor-pointer ${
                                            isSelected
                                            ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-600/30 ring-4 ring-brand-100'
                                            : 'bg-slate-50 border-transparent hover:border-brand-300 hover:bg-brand-50'
                                        }`}
                                    >
                                        <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-brand-100' : 'text-slate-500'}`}>{date.toLocaleDateString('es-ES', { weekday: 'long' })}</p>
                                        <p className={`text-5xl font-black my-2 ${isSelected ? 'text-white' : 'text-brand-900'}`}>{date.getDate()}</p>
                                        <p className={`text-sm font-bold uppercase mt-1 ${isSelected ? 'text-brand-100' : 'text-slate-500'}`}>{date.toLocaleDateString('es-ES', { month: 'long' })}</p>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>

                    <div className={`transition-all duration-500 ease-in-out ${selectedDate ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                        {selectedDate && (
                            <motion.div
                                 initial={{ x: -20, opacity: 0 }}
                                 animate={{ x: 0, opacity: 1 }}
                                 transition={{ delay: 0.3 }}
                            >
                                <h3 className="text-xl font-bold text-brand-700 mb-6 flex items-center border-b border-brand-100 pb-2">
                                    <span className="bg-brand-100 text-brand-700 w-8 h-8 rounded-full flex justify-center items-center mr-3 text-sm">3</span>
                                    Elige un Horario
                                </h3>
                                {selectedDaySlots.length > 0 ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {selectedDaySlots.map(slot => (
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                type="button"
                                                key={slot.toISOString()}
                                                onClick={() => setSelectedSlot(slot.toISOString())}
                                                className={`py-3 px-2 rounded-xl border text-sm md:text-base font-bold transition-colors duration-200 ${
                                                    selectedSlot === slot.toISOString() 
                                                    ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm ring-2 ring-brand-500 ring-offset-2' 
                                                    : 'bg-white border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-slate-50'
                                                }`}
                                            >
                                                {slot.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                            </motion.button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-slate-500 bg-slate-100 p-4 rounded-lg">No quedan horarios disponibles para este día.</p>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
                
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 mt-auto"
                >
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!selectedSlot || !name || !phone || !service}
                        className="w-full bg-brand-600 text-white px-8 py-4 rounded-xl hover:bg-brand-700 font-bold shadow-lg shadow-brand-600/20 disabled:bg-slate-300 disabled:shadow-none disabled:text-slate-500 disabled:cursor-not-allowed transition-all text-lg tracking-wide"
                    >
                        Confirmar Cita
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};