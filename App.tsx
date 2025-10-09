import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { OdontogramApp } from './components/OdontogramApp';
import type { Appointment } from './types';

export interface AppSettings {
  heroImageUrl: string;
  promoImageUrl: string;
}

function App() {
    const [view, setView] = useState<'landing' | 'odontogram'>('landing');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [settings, setSettings] = useState<AppSettings>({
      heroImageUrl: 'https://images.pexels.com/photos/5355831/pexels-photo-5355831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      promoImageUrl: 'https://images.pexels.com/photos/6528860/pexels-photo-6528860.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    });

    const handleBookAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
      const newAppointment: Appointment = {
        id: crypto.randomUUID(),
        ...appointmentData,
      };
      setAppointments(prev => [...prev, newAppointment].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()));
      setView('odontogram'); 
    };

    const handleSettingsChange = (newSettings: AppSettings) => {
        setSettings(newSettings);
    };

    if (view === 'landing') {
        return <LandingPage 
                  onBookAppointment={handleBookAppointment}
                  heroImageUrl={settings.heroImageUrl}
                  promoImageUrl={settings.promoImageUrl}
                  onSettingsChange={handleSettingsChange} 
                />;
    }

    return <OdontogramApp appointments={appointments} />;
}

export default App;