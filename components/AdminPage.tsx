import React, { useState, useEffect, PropsWithChildren } from 'react';
// FIX: Changed import to be a relative path.
import type { Appointment, Doctor, AppSettings, Promotion, AdminAppointmentModalProps, AdminDoctorModalProps, AdminPromotionModalProps } from '../types';
import { DENTAL_SERVICES_MAP } from '../constants';
import {
    DashboardIcon, AppointmentIcon, UsersIcon, MegaphoneIcon, SettingsIcon, OdontogramIcon, PlusIcon, PencilIcon, TrashIcon, DentalIcon, MoonIcon, SunIcon,
} from './icons';
import { AdminAppointmentModal } from './AdminAppointmentModal';
import { AdminDoctorModal } from './AdminDoctorModal';
import { AdminPromotionModal } from './AdminPromotionModal';

// Props for the main AdminPage component
interface AdminPageProps {
    appointments: Appointment[];
    doctors: Doctor[];
    promotions: Promotion[];
    settings: AppSettings;
    onSaveAppointment: AdminAppointmentModalProps['onSave'];
    onDeleteAppointment: (id: string) => void;
    onSaveDoctor: AdminDoctorModalProps['onSave'];
    onDeleteDoctor: (id: string) => void;
    onUpdateSettings: (settings: AppSettings) => void;
    onNavigateToOdontogram: (appointment: Appointment) => void;
    onSavePromotion: AdminPromotionModalProps['onSave'];
    onDeletePromotion: (id: string) => void;
    onTogglePromotionActive: (id: string) => void;
}

type AdminView = 'dashboard' | 'appointments' | 'doctors' | 'promotions' | 'settings';
type Theme = 'light' | 'dark';

const NavItem: React.FC<PropsWithChildren<{ icon: React.ReactNode; isActive: boolean; onClick: () => void; }>> = ({ icon, isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
            isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
    >
        <div className="w-6 h-6">{icon}</div>
        <span className="font-semibold">{children}</span>
    </button>
);

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border-l-4 ${color}`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">{title}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
            </div>
            <div className="w-12 h-12 text-slate-400">{icon}</div>
        </div>
    </div>
);

// Individual view components
const DashboardView: React.FC<{ appointments: Appointment[], doctors: Doctor[] }> = ({ appointments, doctors }) => (
    <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Citas Hoy" value={appointments.filter(a => new Date(a.dateTime).toDateString() === new Date().toDateString()).length} icon={<AppointmentIcon />} color="border-blue-500" />
            <StatCard title="Total de Citas" value={appointments.length} icon={<AppointmentIcon />} color="border-green-500" />
            <StatCard title="Doctores Activos" value={doctors.length} icon={<UsersIcon />} color="border-purple-500" />
        </div>
    </div>
);

const AppointmentsView: React.FC<Pick<AdminPageProps, 'appointments' | 'doctors' | 'onDeleteAppointment' | 'onNavigateToOdontogram'> & { onEdit: (app: Appointment) => void; onAdd: () => void; }> = ({ appointments, doctors, onDeleteAppointment, onNavigateToOdontogram, onEdit, onAdd }) => {
    const doctorsMap = doctors.reduce((acc, doc) => ({...acc, [doc.id]: doc.name}), {} as Record<string, string>);
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Citas</h2>
                <button onClick={onAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700"><PlusIcon /> Nueva Cita</button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Paciente</th>
                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Fecha y Hora</th>
                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Servicio</th>
                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Doctor</th>
                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(app => (
                            <tr key={app.id} className="border-b border-slate-200 dark:border-slate-700">
                                <td className="p-4">{app.name}</td>
                                <td className="p-4">{new Date(app.dateTime).toLocaleString()}</td>
                                <td className="p-4">{DENTAL_SERVICES_MAP[app.service] || app.service}</td>
                                <td className="p-4">{app.doctorId ? doctorsMap[app.doctorId] : 'N/A'}</td>
                                <td className="p-4 flex items-center gap-2">
                                    <button onClick={() => onNavigateToOdontogram(app)} className="p-2 text-slate-500 hover:text-blue-600"><OdontogramIcon /></button>
                                    <button onClick={() => onEdit(app)} className="p-2 text-slate-500 hover:text-green-600"><PencilIcon /></button>
                                    <button onClick={() => onDeleteAppointment(app.id)} className="p-2 text-slate-500 hover:text-red-600"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DoctorsView: React.FC<Pick<AdminPageProps, 'doctors' | 'onDeleteDoctor'> & { onEdit: (doc: Doctor) => void; onAdd: () => void; }> = ({ doctors, onDeleteDoctor, onEdit, onAdd }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Doctores</h2>
            <button onClick={onAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700"><PlusIcon /> Nuevo Doctor</button>
        </div>
         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
             <table className="w-full text-left">
                 <thead className="bg-slate-50 dark:bg-slate-700/50">
                     <tr>
                         <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Nombre</th>
                         <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Especialidad</th>
                         <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Acciones</th>
                     </tr>
                 </thead>
                 <tbody>
                     {doctors.map(doc => (
                         <tr key={doc.id} className="border-b border-slate-200 dark:border-slate-700">
                             <td className="p-4">{doc.name}</td>
                             <td className="p-4">{doc.specialty}</td>
                             <td className="p-4 flex items-center gap-2">
                                 <button onClick={() => onEdit(doc)} className="p-2 text-slate-500 hover:text-green-600"><PencilIcon /></button>
                                 <button onClick={() => onDeleteDoctor(doc.id)} className="p-2 text-slate-500 hover:text-red-600"><TrashIcon /></button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
    </div>
);

const PromotionsView: React.FC<Pick<AdminPageProps, 'promotions' | 'onDeletePromotion' | 'onTogglePromotionActive'> & { onEdit: (promo: Promotion) => void; onAdd: () => void; }> = ({ promotions, onDeletePromotion, onTogglePromotionActive, onEdit, onAdd }) => (
     <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Promociones</h2>
            <button onClick={onAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700"><PlusIcon /> Nueva Promoción</button>
        </div>
         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                        <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Título</th>
                        <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Estado</th>
                        <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {promotions.map(promo => (
                        <tr key={promo.id} className="border-b border-slate-200 dark:border-slate-700">
                            <td className="p-4">{promo.title}</td>
                            <td className="p-4">
                                <button onClick={() => onTogglePromotionActive(promo.id)} className={`px-3 py-1 text-sm font-semibold rounded-full ${promo.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                                    {promo.isActive ? 'Activa' : 'Inactiva'}
                                </button>
                            </td>
                            <td className="p-4 flex items-center gap-2">
                                <button onClick={() => onEdit(promo)} className="p-2 text-slate-500 hover:text-green-600"><PencilIcon /></button>
                                <button onClick={() => onDeletePromotion(promo.id)} className="p-2 text-slate-500 hover:text-red-600"><TrashIcon /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
    </div>
);

const SettingsView: React.FC<{ settings: AppSettings, onUpdateSettings: (s: AppSettings) => void }> = ({ settings, onUpdateSettings }) => {
    const [localSettings, setLocalSettings] = useState(settings);

    useEffect(() => setLocalSettings(settings), [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSettings(prev => ({...prev, [e.target.name]: e.target.value}));
    };
    const handleSave = () => onUpdateSettings(localSettings);

    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Configuración</h2>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Nombre de la Clínica</label>
                    <input type="text" name="clinicName" value={localSettings.clinicName} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Dirección</label>
                    <input type="text" name="clinicAddress" value={localSettings.clinicAddress} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Teléfono</label>
                    <input type="text" name="clinicPhone" value={localSettings.clinicPhone} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label>
                    <input type="email" name="clinicEmail" value={localSettings.clinicEmail} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">URL Imagen Principal</label>
                    <input type="url" name="heroImageUrl" value={localSettings.heroImageUrl} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">URL Imagen Login</label>
                    <input type="url" name="loginImageUrl" value={localSettings.loginImageUrl} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                </div>
                <div className="text-right">
                    <button onClick={handleSave} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700">Guardar Cambios</button>
                </div>
            </div>
        </div>
    );
};

export const AdminPage: React.FC<AdminPageProps> = (props) => {
    const [view, setView] = useState<AdminView>('dashboard');
    const [theme, setTheme] = useState<Theme>('dark');
    
    // Modal state
    const [editingAppointment, setEditingAppointment] = useState<Appointment | Partial<Appointment> | null>(null);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | Partial<Doctor> | null>(null);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | Partial<Promotion> | null>(null);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);
    
    const renderView = () => {
        switch (view) {
            case 'dashboard': return <DashboardView appointments={props.appointments} doctors={props.doctors} />;
            case 'appointments': return <AppointmentsView appointments={props.appointments} doctors={props.doctors} onDeleteAppointment={props.onDeleteAppointment} onNavigateToOdontogram={props.onNavigateToOdontogram} onEdit={setEditingAppointment} onAdd={() => setEditingAppointment({})} />;
            case 'doctors': return <DoctorsView doctors={props.doctors} onDeleteDoctor={props.onDeleteDoctor} onEdit={setEditingDoctor} onAdd={() => setEditingDoctor({})} />;
            case 'promotions': return <PromotionsView promotions={props.promotions} onDeletePromotion={props.onDeletePromotion} onTogglePromotionActive={props.onTogglePromotionActive} onEdit={setEditingPromotion} onAdd={() => setEditingPromotion({})} />;
            case 'settings': return <SettingsView settings={props.settings} onUpdateSettings={props.onUpdateSettings} />;
            default: return <DashboardView appointments={props.appointments} doctors={props.doctors} />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-800 flex flex-col p-4 border-r border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2 mb-8 px-2">
                    <div className="w-9 h-9 text-blue-600 dark:text-blue-400"><DentalIcon /></div>
                    <h1 className="text-2xl font-bold">Kiru Admin</h1>
                </div>
                <nav className="flex-1 space-y-2">
                    <NavItem icon={<DashboardIcon />} isActive={view === 'dashboard'} onClick={() => setView('dashboard')}>Dashboard</NavItem>
                    <NavItem icon={<AppointmentIcon />} isActive={view === 'appointments'} onClick={() => setView('appointments')}>Citas</NavItem>
                    <NavItem icon={<UsersIcon />} isActive={view === 'doctors'} onClick={() => setView('doctors')}>Doctores</NavItem>
                    <NavItem icon={<MegaphoneIcon />} isActive={view === 'promotions'} onClick={() => setView('promotions')}>Promociones</NavItem>
                    <NavItem icon={<SettingsIcon />} isActive={view === 'settings'} onClick={() => setView('settings')}>Configuración</NavItem>
                </nav>
                <div>
                     <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title="Toggle Theme" className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        <span className="font-semibold">Cambiar Tema</span>
                    </button>
                </div>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {renderView()}
            </main>

            {/* Modals */}
            {editingAppointment && <AdminAppointmentModal appointment={editingAppointment} doctors={props.doctors} onClose={() => setEditingAppointment(null)} onSave={props.onSaveAppointment} />}
            {editingDoctor && <AdminDoctorModal doctor={editingDoctor} onClose={() => setEditingDoctor(null)} onSave={props.onSaveDoctor} />}
            {editingPromotion && <AdminPromotionModal promotion={editingPromotion} onClose={() => setEditingPromotion(null)} onSave={props.onSavePromotion} />}
        </div>
    );
};
