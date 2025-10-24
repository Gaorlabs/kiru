import React, { useState, useEffect } from 'react';
import type { Appointment, Doctor, Promotion, AppSettings, AppointmentStatus } from '../types';
import { DENTAL_SERVICES_MAP } from '../constants';
import {
    DashboardIcon, AppointmentIcon, UsersIcon, MegaphoneIcon, SettingsIcon, PlusIcon, PencilIcon, TrashIcon, BriefcaseIcon, DentalIcon, MoonIcon, SunIcon, OdontogramIcon, ChevronDownIcon
} from './icons';
import { AdminAppointmentModal } from './AdminAppointmentModal';
import { AdminDoctorModal } from './AdminDoctorModal';
import { AdminPromotionModal } from './AdminPromotionModal';

type AdminTab = 'dashboard' | 'agenda' | 'patients' | 'doctors' | 'promotions' | 'settings';
type Theme = 'light' | 'dark';

interface AdminPageProps {
    appointments: Appointment[];
    doctors: Doctor[];
    promotions: Promotion[];
    settings: AppSettings;
    onSaveAppointment: (data: Omit<Appointment, 'id'> & { id?: string }) => void;
    onDeleteAppointment: (id: string) => void;
    onSaveDoctor: (data: Omit<Doctor, 'id'> & { id?: string }) => void;
    onDeleteDoctor: (id: string) => void;
    onSavePromotion: (data: Omit<Promotion, 'id' | 'isActive'> & { id?: string }) => void;
    onDeletePromotion: (id: string) => void;
    onTogglePromotionStatus: (id: string) => void;
    setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
    onLogout: () => void;
    onViewOdontogram: (patient: Appointment) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center space-x-4">
        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full text-blue-600 dark:text-blue-400">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const TabButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50'
        }`}
    >
        <div className="w-5 h-5">{icon}</div>
        <span>{label}</span>
    </button>
);

const statusConfig: Record<AppointmentStatus, { title: string; color: string; }> = {
    requested: { title: 'Por Confirmar', color: 'bg-yellow-500' },
    confirmed: { title: 'Confirmadas', color: 'bg-blue-500' },
    waiting: { title: 'En Sala de Espera', color: 'bg-purple-500' },
    completed: { title: 'Completadas', color: 'bg-green-500' },
    canceled: { title: 'Canceladas', color: 'bg-red-500' },
};
const KANBAN_COLUMNS: AppointmentStatus[] = ['requested', 'confirmed', 'waiting', 'completed', 'canceled'];


export const AdminPage: React.FC<AdminPageProps> = (props) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('agenda');
    const [theme, setTheme] = useState<Theme>('dark');
    
    const [editingAppointment, setEditingAppointment] = useState<Appointment | Partial<Appointment> | null>(null);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | Partial<Doctor> | null>(null);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | Partial<Promotion> | null>(null);
    const [localSettings, setLocalSettings] = useState(props.settings);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
    }, [theme]);
    
     useEffect(() => {
        setLocalSettings(props.settings);
    }, [props.settings]);
    
    const handleSaveAppointment = (data: Omit<Appointment, 'id'> & { id?: string }) => {
        props.onSaveAppointment(data);
        setEditingAppointment(null);
    };

    const handleAppointmentStatusChange = (appointmentId: string, status: AppointmentStatus) => {
        const appointment = props.appointments.find(a => a.id === appointmentId);
        if (appointment) {
            props.onSaveAppointment({ ...appointment, status });
        }
    };
    
    const handleSaveDoctor = (data: Omit<Doctor, 'id'> & { id?: string }) => {
        props.onSaveDoctor(data);
        setEditingDoctor(null);
    };

    const handleSavePromotion = (data: Omit<Promotion, 'id' | 'isActive'> & { id?: string }) => {
        props.onSavePromotion(data);
        setEditingPromotion(null);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                             <StatCard title="Citas para Hoy" value={props.appointments.filter(a => new Date(a.dateTime).toDateString() === new Date().toDateString()).length} icon={<AppointmentIcon />} />
                             <StatCard title="Pacientes Totales" value={props.appointments.length} icon={<UsersIcon />} />
                             <StatCard title="Promociones Activas" value={props.promotions.filter(p => p.isActive).length} icon={<MegaphoneIcon />} />
                        </div>
                    </div>
                );
            case 'agenda':
                 return (
                    <div className="h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Flujo de Citas</h2>
                            <button onClick={() => setEditingAppointment({})} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2"><PlusIcon className="w-5 h-5" /><span>Nueva Cita</span></button>
                        </div>
                        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
                            {KANBAN_COLUMNS.map(status => (
                                <div key={status} className="w-72 flex-shrink-0 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl p-3 flex flex-col">
                                    <div className="flex items-center mb-4">
                                        <span className={`w-3 h-3 rounded-full mr-2 ${statusConfig[status].color}`}></span>
                                        <h3 className="font-semibold text-slate-700 dark:text-slate-200">{statusConfig[status].title}</h3>
                                        <span className="ml-auto text-sm font-bold bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full w-6 h-6 flex items-center justify-center">
                                            {props.appointments.filter(a => a.status === status).length}
                                        </span>
                                    </div>
                                    <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                                        {props.appointments.filter(app => app.status === status).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()).map(app => (
                                            <div key={app.id} className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-600">
                                                <p className="font-bold text-slate-800 dark:text-white">{app.name}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{DENTAL_SERVICES_MAP[app.service]}</p>
                                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">{new Date(app.dateTime).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                                <div className="border-t border-slate-200 dark:border-slate-600 my-3"></div>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-1">
                                                        <button onClick={() => props.onViewOdontogram(app)} className="p-1.5 text-blue-500 hover:bg-blue-100 dark:hover:bg-slate-600 rounded-full transition-colors" title="Ver Odontograma"><OdontogramIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => setEditingAppointment(app)} className="p-1.5 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-slate-600 rounded-full transition-colors" title="Editar Cita"><PencilIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => props.onDeleteAppointment(app.id)} className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-slate-600 rounded-full transition-colors" title="Eliminar Cita"><TrashIcon className="w-5 h-5" /></button>
                                                    </div>
                                                    <select 
                                                        value={app.status} 
                                                        onChange={(e) => handleAppointmentStatusChange(app.id, e.target.value as AppointmentStatus)}
                                                        className="text-xs font-semibold bg-slate-100 dark:bg-slate-600 border-none rounded-md py-1 pl-2 pr-6 appearance-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        {KANBAN_COLUMNS.map(s => <option key={s} value={s}>{statusConfig[s].title}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'patients': {
                 // FIX: Explicitly typed `patients` as `Appointment[]` to correct a TypeScript inference issue where `patient` in the `.map()` was being typed as `unknown`. This resolves errors related to accessing properties on `patient`.
                 const patients: Appointment[] = Array.from(new Map(props.appointments.map(app => [app.email, app])).values());
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Pacientes</h2>
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto border border-slate-200 dark:border-slate-700">
                            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Nombre</th>
                                        <th scope="col" className="px-6 py-3">Teléfono</th>
                                        <th scope="col" className="px-6 py-3">Email</th>
                                        <th scope="col" className="px-6 py-3">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map(patient => (
                                        <tr key={patient.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{patient.name}</td>
                                            <td className="px-6 py-4">{patient.phone}</td>
                                            <td className="px-6 py-4">{patient.email}</td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => props.onViewOdontogram(patient)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold flex items-center space-x-2" title="Ver Odontograma">
                                                    <OdontogramIcon className="w-5 h-5" />
                                                    <span>Ver Odontograma</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            }
            case 'doctors':
                 return (
                     <div>
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Doctores</h2>
                            <button onClick={() => setEditingDoctor({})} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2"><PlusIcon className="w-5 h-5" /><span>Nuevo Doctor</span></button>
                        </div>
                         <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto border border-slate-200 dark:border-slate-700">
                            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Nombre</th>
                                        <th scope="col" className="px-6 py-3">Especialidad</th>
                                        <th scope="col" className="px-6 py-3">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.doctors.map(doc => (
                                        <tr key={doc.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{doc.name}</td>
                                            <td className="px-6 py-4">{doc.specialty}</td>
                                            <td className="px-6 py-4 flex items-center space-x-2">
                                                 <button onClick={() => setEditingDoctor(doc)} className="p-2 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-slate-700 rounded-full transition-colors" title="Editar"><PencilIcon className="w-5 h-5" /></button>
                                                 <button onClick={() => props.onDeleteDoctor(doc.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-slate-700 rounded-full transition-colors" title="Eliminar"><TrashIcon className="w-5 h-5" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'promotions':
                 return (
                     <div>
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Promociones</h2>
                            <button onClick={() => setEditingPromotion({})} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2"><PlusIcon className="w-5 h-5" /><span>Nueva Promoción</span></button>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto border border-slate-200 dark:border-slate-700">
                           <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Título</th>
                                        <th scope="col" className="px-6 py-3">Estado</th>
                                        <th scope="col" className="px-6 py-3">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.promotions.map(promo => (
                                        <tr key={promo.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{promo.title}</td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => props.onTogglePromotionStatus(promo.id)} className={`px-3 py-1 text-xs font-semibold rounded-full ${promo.isActive ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200'}`}>{promo.isActive ? 'Activa' : 'Inactiva'}</button>
                                            </td>
                                            <td className="px-6 py-4 flex items-center space-x-2">
                                                 <button onClick={() => setEditingPromotion(promo)} className="p-2 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-slate-700 rounded-full transition-colors" title="Editar"><PencilIcon className="w-5 h-5" /></button>
                                                 <button onClick={() => props.onDeletePromotion(promo.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-slate-700 rounded-full transition-colors" title="Eliminar"><TrashIcon className="w-5 h-5" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'settings': {
                const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const { name, value } = e.target;
                    if (name === 'heroImageUrl' || name === 'loginImageUrl') {
                        let finalValue = value.trim();
                        const urlMatch = finalValue.match(/url\((['"]?)(.*?)\1\)/);
                        if (urlMatch) {
                            finalValue = urlMatch[2].trim();
                        }
                        setLocalSettings(prev => ({ ...prev, [name]: finalValue }));
                    } else {
                        setLocalSettings(prev => ({ ...prev, [name]: value }));
                    }
                };
                
                const handleSettingsSave = (e: React.FormEvent) => {
                    e.preventDefault();
                    props.setSettings(localSettings);
                    alert('Configuración guardada!');
                };

                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Configuración</h2>
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 max-w-2xl">
                            <form onSubmit={handleSettingsSave} className="space-y-6">
                                <div>
                                    <label htmlFor="clinicName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nombre de la Clínica</label>
                                    <input type="text" name="clinicName" id="clinicName" value={localSettings.clinicName} onChange={handleSettingsChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label htmlFor="clinicAddress" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Dirección</label>
                                    <input type="text" name="clinicAddress" id="clinicAddress" value={localSettings.clinicAddress} onChange={handleSettingsChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label htmlFor="clinicPhone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Teléfono</label>
                                    <input type="text" name="clinicPhone" id="clinicPhone" value={localSettings.clinicPhone} onChange={handleSettingsChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label htmlFor="clinicEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                    <input type="email" name="clinicEmail" id="clinicEmail" value={localSettings.clinicEmail} onChange={handleSettingsChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label htmlFor="heroImageUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300">URL Imagen Principal (Landing)</label>
                                    <input type="text" name="heroImageUrl" id="heroImageUrl" value={localSettings.heroImageUrl} onChange={handleSettingsChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label htmlFor="loginImageUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300">URL Imagen (Login)</label>
                                    <input type="text" name="loginImageUrl" id="loginImageUrl" value={localSettings.loginImageUrl} onChange={handleSettingsChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900 dark:text-white" />
                                </div>
                                <div className="pt-2 text-right">
                                     <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">Guardar Cambios</button>
                                </div>
                            </form>
                        </div>
                    </div>
                );
            }
        }
    };

    return (
        <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 font-sans transition-colors`}>
            <aside className="w-64 bg-white dark:bg-slate-800 p-4 flex flex-col border-r border-slate-200 dark:border-slate-700">
                 <div className="flex items-center space-x-2 mb-8 px-2">
                    <div className="w-9 h-9 text-blue-600 dark:text-blue-400"><DentalIcon /></div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{props.settings.clinicName} Admin</h1>
                </div>
                <nav className="flex-1 space-y-2">
                    <TabButton icon={<DashboardIcon />} label="Dashboard" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <TabButton icon={<AppointmentIcon />} label="Agenda" isActive={activeTab === 'agenda'} onClick={() => setActiveTab('agenda')} />
                    <TabButton icon={<BriefcaseIcon />} label="Pacientes" isActive={activeTab === 'patients'} onClick={() => setActiveTab('patients')} />
                    <TabButton icon={<UsersIcon />} label="Doctores" isActive={activeTab === 'doctors'} onClick={() => setActiveTab('doctors')} />
                    <TabButton icon={<MegaphoneIcon />} label="Promociones" isActive={activeTab === 'promotions'} onClick={() => setActiveTab('promotions')} />
                    <TabButton icon={<SettingsIcon />} label="Configuración" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </nav>
                 <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Admin</span>
                        <button onClick={props.onLogout} className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-semibold transition-colors">Cerrar Sesión</button>
                    </div>
                     <button onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600/50 transition-colors">
                        {theme === 'light' ? <MoonIcon className="w-5 h-5"/> : <SunIcon className="w-5 h-5"/>}
                        <span>Cambiar Tema</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto flex flex-col">
                {renderContent()}
            </main>
            
            {editingAppointment && <AdminAppointmentModal appointment={editingAppointment} doctors={props.doctors} onClose={() => setEditingAppointment(null)} onSave={handleSaveAppointment} />}
            {editingDoctor && <AdminDoctorModal doctor={editingDoctor} onClose={() => setEditingDoctor(null)} onSave={handleSaveDoctor} />}
            {editingPromotion && <AdminPromotionModal promotion={editingPromotion} onClose={() => setEditingPromotion(null)} onSave={handleSavePromotion} />}
        </div>
    );
};