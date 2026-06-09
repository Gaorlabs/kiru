import React, { useState, useCallback } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import { ConsultationRoom } from './components/ConsultationRoom';
import type { Appointment, Doctor, Promotion, AppSettings, PatientRecord } from './types';
import { DENTAL_SERVICES_MAP } from './constants';

const MOCK_DOCTORS: Doctor[] = [
    { id: 'doc1', name: 'Dr. Ana García', specialty: 'Ortodoncia' },
    { id: 'doc2', name: 'Dr. Carlos Martinez', specialty: 'Endodoncia' },
    { id: 'doc3', name: 'Dr. Sofia Rodriguez', specialty: 'Cirugía Bucal' },
];

const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'apt1', name: 'Juan Perez', phone: '987654321', email: 'juan.perez@email.com', dateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), service: 'orthodontics', status: 'confirmed', doctorId: 'doc1' },
    { id: 'apt2', name: 'Maria Lopez', phone: '912345678', email: 'maria.lopez@email.com', dateTime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), service: 'endodontics', status: 'confirmed', doctorId: 'doc2' },
    { id: 'apt3', name: 'Pedro Ramirez', phone: '955555555', email: 'pedro.ramirez@email.com', dateTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), service: 'cosmetic_dentistry', status: 'completed', doctorId: 'doc1' },
    { id: 'apt4', name: 'Laura Sanchez', phone: '933333333', email: 'laura.s@email.com', dateTime: new Date(new Date().setDate(new Date().getDate())).toISOString(), service: 'prevention', status: 'waiting', doctorId: 'doc3' },
    { id: 'apt5', name: 'Carlos Gomez', phone: '922222222', email: 'carlos.g@email.com', dateTime: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), service: 'restorations', status: 'requested', doctorId: undefined },
];

const MOCK_PROMOTIONS: Promotion[] = [
    { id: 'promo1', title: 'Limpieza Dental 2x1', subtitle: 'Paga una y la segunda es GRATIS', imageUrl: 'https://images.unsplash.com/photo-1629905675717-f6d3b3c0ca60?q=80&w=2070&auto=format&fit=crop', ctaText: 'Agendar Ahora', isActive: true, details: 'Válido para limpiezas profundas.\nAplica para dos personas en la misma visita.\nNo acumulable con otras promociones.' },
    { id: 'promo2', title: 'Blanqueamiento Dental', subtitle: 'Luce una sonrisa más blanca y brillante.', imageUrl: 'https://images.unsplash.com/photo-1606923235213-a4e9b9a61a04?q=80&w=2070&auto=format&fit=crop', ctaText: 'Más Información', isActive: false, details: 'Tratamiento de blanqueamiento profesional en consultorio.' },
];

const MOCK_SETTINGS: AppSettings = {
    clinicName: 'Kiru',
    clinicAddress: 'Av. Sonrisas 123, Lima, Perú',
    clinicPhone: '(+51) 123 456 78',
    clinicEmail: 'info@kiru.com',
    heroImageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop',
    loginImageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop',
};

const MOCK_PATIENT_RECORDS: Record<string, PatientRecord> = {
    'apt1': { // Juan Perez
        patientId: 'apt1',
        name: 'Juan Perez',
        phone: '987654321',
        email: 'juan.perez@email.com',
        medicalAlerts: 'Hipertensión controlada.',
        dentalHistory: '',
        sessions: [
            {
                id: 'sess1', date: new Date('2023-10-15').toISOString(), doctorId: 'doc1',
                motivoConsulta: 'Revisión inicial', urgency: 'rutina', painScale: 0,
                odontograma: {}, examenObservaciones: 'Paciente presenta buena higiene bucal.',
                cie10: 'Z01.2', diagnosticoDesc: 'Examen odontológico', adjuntoUrl: '',
                piezasTratadas: '', superficiesTratadas: '', procedimientos: ['Profilaxis'], material: '', anestesia: '', tratamientoObs: '',
                indicaciones: 'Cepillarse los dientes 3 veces al día.', receta: '', proximaCitaFecha: '', proximaCitaMotivo: '', montoCobrado: 50, metodoPago: 'efectivo'
            }
        ],
        treatmentPlan: []
    },
    'apt4': { // Laura Sanchez
        patientId: 'apt4',
        name: 'Laura Sanchez',
        phone: '933333333',
        email: 'laura.s@email.com',
        medicalAlerts: 'Alergia a la penicilina.',
        dentalHistory: '',
        sessions: [],
        treatmentPlan: []
    }
};

type Page = 'landing' | 'login' | 'admin' | 'consultation';

function App() {
    const [page, setPage] = useState<Page>('landing');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Load state from localStorage with fallbacks
    const [appointments, setAppointments] = useState<Appointment[]>(() => {
        try {
            const saved = localStorage.getItem('kiru_appointments');
            return saved ? JSON.parse(saved) : MOCK_APPOINTMENTS;
        } catch (e) {
            console.error('Error reading appointments from localStorage', e);
            return MOCK_APPOINTMENTS;
        }
    });
    
    const [doctors, setDoctors] = useState<Doctor[]>(() => {
        try {
            const saved = localStorage.getItem('kiru_doctors');
            return saved ? JSON.parse(saved) : MOCK_DOCTORS;
        } catch (e) {
            console.error('Error reading doctors from localStorage', e);
            return MOCK_DOCTORS;
        }
    });
    
    const [promotions, setPromotions] = useState<Promotion[]>(() => {
        try {
            const saved = localStorage.getItem('kiru_promotions');
            return saved ? JSON.parse(saved) : MOCK_PROMOTIONS;
        } catch (e) {
            console.error('Error reading promotions from localStorage', e);
            return MOCK_PROMOTIONS;
        }
    });
    
    const [settings, setSettings] = useState<AppSettings>(() => {
        try {
            const saved = localStorage.getItem('kiru_settings');
            return saved ? JSON.parse(saved) : MOCK_SETTINGS;
        } catch (e) {
            console.error('Error reading settings from localStorage', e);
            return MOCK_SETTINGS;
        }
    });
    
    const [patientRecords, setPatientRecords] = useState<Record<string, PatientRecord>>(() => {
        try {
            const saved = localStorage.getItem('kiru_patient_records');
            return saved ? JSON.parse(saved) : MOCK_PATIENT_RECORDS;
        } catch (e) {
            console.error('Error reading patient records from localStorage', e);
            return MOCK_PATIENT_RECORDS;
        }
    });

    const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
    const [selectedPatientRecord, setSelectedPatientRecord] = useState<PatientRecord | null>(null);

    // Save states to localStorage when they change
    React.useEffect(() => {
        localStorage.setItem('kiru_appointments', JSON.stringify(appointments));
    }, [appointments]);

    React.useEffect(() => {
        localStorage.setItem('kiru_doctors', JSON.stringify(doctors));
    }, [doctors]);

    React.useEffect(() => {
        localStorage.setItem('kiru_promotions', JSON.stringify(promotions));
    }, [promotions]);

    React.useEffect(() => {
        localStorage.setItem('kiru_settings', JSON.stringify(settings));
    }, [settings]);

    React.useEffect(() => {
        localStorage.setItem('kiru_patient_records', JSON.stringify(patientRecords));
    }, [patientRecords]);

    const handleLogin = (success: boolean) => {
        if (success) {
            setIsAuthenticated(true);
            setPage('admin');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPage('landing');
    };

    const handleBookAppointment = (appointmentData: Omit<Appointment, 'id' | 'status'>) => {
        const newAppointment: Appointment = {
            ...appointmentData,
            id: crypto.randomUUID(),
            status: 'requested',
            paymentStatus: 'pendiente',
            paymentMethod: 'pendiente',
        };
        setAppointments(prev => [...prev, newAppointment]);
    };
    
    const handleOpenClinicalRecord = (patient: Appointment) => {
        const record = patientRecords[patient.id];
        if (record) {
            setSelectedPatientRecord(record);
        } else {
            // Create a new record for a new patient
            const newRecord: PatientRecord = {
                patientId: patient.id,
                name: patient.name,
                phone: patient.phone,
                email: patient.email,
                sessions: [],
                treatmentPlan: [],
                medicalAlerts: '',
                dentalHistory: ''
            };
            setPatientRecords(prev => ({...prev, [patient.id]: newRecord}));
            setSelectedPatientRecord(newRecord);
        }
        setSelectedPatient(patient);
        setPage('consultation');
    };

    const handleNavigateToAdmin = () => {
        setPage('admin');
        setSelectedPatient(null);
        setSelectedPatientRecord(null);
    };
    
    const handleSavePatientRecord = (record: PatientRecord) => {
        setPatientRecords(prev => ({
            ...prev,
            [record.patientId]: record
        }));
        alert('Ficha clínica guardada con éxito.');
    };

    // --- CRUD Handlers ---

    const handleSaveAppointment = (data: Omit<Appointment, 'id'> & { id?: string }) => {
        setAppointments(prev => {
            if (data.id) {
                return prev.map(a => a.id === data.id ? { ...a, ...data } as Appointment : a);
            }
            return [...prev, { ...data, id: crypto.randomUUID(), status: data.status || 'requested' } as Appointment];
        });
    };
    
    const handleDeleteAppointment = (id: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta cita?')) {
            setAppointments(prev => prev.filter(a => a.id !== id));
        }
    };
    
    const handleSaveDoctor = (data: Omit<Doctor, 'id'> & { id?: string }) => {
        setDoctors(prev => {
            if (data.id) {
                return prev.map(d => d.id === data.id ? { ...d, ...data } as Doctor : d);
            }
            return [...prev, { ...data, id: crypto.randomUUID() } as Doctor];
        });
    };

    const handleDeleteDoctor = (id: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar este doctor?')) {
            setDoctors(prev => prev.filter(d => d.id !== id));
        }
    };

    const handleSavePromotion = (data: Omit<Promotion, 'id' | 'isActive'> & { id?: string }) => {
        setPromotions(prev => {
            if (data.id) {
                // Find existing promotion to preserve its isActive status if not changed
                const existingPromo = prev.find(p => p.id === data.id);
                const isActive = existingPromo ? existingPromo.isActive : false;
                return prev.map(p => p.id === data.id ? { ...p, ...data, isActive } as Promotion : p);
            }
            return [...prev, { ...data, id: crypto.randomUUID(), isActive: false } as Promotion];
        });
    };

     const togglePromotionStatus = (id: string) => {
        setPromotions(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : { ...p, isActive: false }));
    };

    const handleDeletePromotion = (id: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta promoción?')) {
            setPromotions(prev => prev.filter(p => p.id !== id));
        }
    };
    
    const activePromotion = promotions.find(p => p.isActive) || null;

    if (page === 'landing') {
        return <LandingPage onBookAppointment={handleBookAppointment} settings={settings} onNavigateToLogin={() => setPage('login')} activePromotion={activePromotion} />;
    }

    if (page === 'login') {
        return <LoginPage onLogin={handleLogin} onNavigateToLanding={() => setPage('landing')} settings={settings} />;
    }

    if (page === 'admin' && isAuthenticated) {
        return <AdminPage 
            appointments={appointments}
            doctors={doctors}
            promotions={promotions}
            settings={settings}
            onSaveAppointment={handleSaveAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onSaveDoctor={handleSaveDoctor}
            onDeleteDoctor={handleDeleteDoctor}
            onSavePromotion={handleSavePromotion}
            onDeletePromotion={handleDeletePromotion}
            onTogglePromotionStatus={togglePromotionStatus}
            setSettings={setSettings}
            onLogout={handleLogout}
            onOpenClinicalRecord={handleOpenClinicalRecord}
        />;
    }
    
    if (page === 'consultation' && isAuthenticated && selectedPatient && selectedPatientRecord) {
        return <ConsultationRoom
            patient={selectedPatient}
            patientRecord={selectedPatientRecord}
            allAppointments={appointments}
            onSave={handleSavePatientRecord}
            isAuthenticated={isAuthenticated} 
            onNavigateToAdmin={handleNavigateToAdmin}
        />;
    }
    
    return null;
}

export default App;