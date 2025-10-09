import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { OdontogramApp } from './components/OdontogramApp';
import type { Appointment } from './types';

function App() {
    const [view, setView] = useState<'landing' | 'odontogram'>('landing');
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const handleBookAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
      const newAppointment: Appointment = {
        id: crypto.randomUUID(),
        ...appointmentData,
      };
      // Add and sort appointments
      setAppointments(prev => [...prev, newAppointment].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()));
      
      // For this demo, navigate to the internal view after booking to see the result.
      // In a real app, you might show a confirmation message instead.
      setView('odontogram'); 
    };

    if (view === 'landing') {
        return <LandingPage onBookAppointment={handleBookAppointment} />;
    }

    return <OdontogramApp appointments={appointments} />;
}

export default App;
