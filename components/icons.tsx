import React from 'react';

const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        {props.children}
    </svg>
);

export const CariesIcon: React.FC = () => <Icon><path d="M9.03 2.03a3.5 3.5 0 1 1 5.94 0L12 6l-2.97-3.97zM12 6V3M9 9a3 3 0 0 0-3 3v1c0 1.66 1.34 3 3 3h6c1.66 0 3-1.34 3-3v-1a3 3 0 0 0-3-3h-2M9 9a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v0M6.5 16a5.5 5.5 0 1 1 11 0"/><circle cx="13" cy="11" r="1" fill="currentColor"/></Icon>;
export const CrownIcon: React.FC = () => <Icon><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></Icon>;
export const EndodonticsIcon: React.FC = () => <Icon><path d="M12 20.9l-4.95-4.95a7 7 0 1 1 9.9 0L12 20.9z" /><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></Icon>;
export const FillingIcon: React.FC = () => <Icon><path d="M21.174 6.812a1 1 0 0 0-1.141-1.356L12 12.5l-8.033-7.044a1 1 0 0 0-1.141 1.356l9 7.923a1 1 0 0 0 1.141 0l9-7.923z" /><path d="M12 22v-9" /></Icon>;
export const HealthyIcon: React.FC = () => <Icon><path d="M20 6L9 17l-5-5" /></Icon>;
export const ImplantIcon: React.FC = () => <Icon><path d="M16.14 3.86a2 2 0 0 1 2.83 0L22 6.83a2 2 0 0 1 0 2.83l-3.03 3.03a2 2 0 0 1-2.83 0l-1.14-1.14" /><path d="m12 12-8.5 8.5" /><path d="M12 12a2 2 0 0 0 0-2.83l.83-.83c.39-.39 1.02-.39 1.41 0l1.41 1.41c.39.39.39 1.02 0 1.41l-.83.83a2 2 0 0 0 0 2.83l.83.83c.39.39 1.02.39 1.41 0l1.41-1.41c.39-.39.39-1.02 0-1.41l-.83-.83a2 2 0 0 0-2.83 0" /></Icon>;
export const MissingIcon: React.FC = () => <Icon><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></Icon>;
export const UneruptedIcon: React.FC = () => <Icon><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></Icon>;
export const ExtractionIcon: React.FC = () => <Icon><path d="M18 6L6 18M6 6l12 12" /></Icon>;
export const ToothPlaceholderIcon: React.FC = () => <Icon><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L3.41 13.41a2 2 0 0 1 0-2.83l7.17-7.17a2 2 0 0 1 2.83 0l7.17 7.17a2 2 0 0 1 0 2.83z" /><line x1="12" y1="22" x2="12" y2="2" /></Icon>;
export const ChevronDownIcon: React.FC = () => <Icon><polyline points="6 9 12 15 18 9"></polyline></Icon>;
export const SearchIcon: React.FC = () => <Icon><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></Icon>;
export const CheckIcon: React.FC = () => <Icon><polyline points="20 6 9 17 4 12"></polyline></Icon>;
export const UndoIcon: React.FC = () => <Icon><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L12 10" /><path d="M12 10h9v-9" /></Icon>;
export const DentalIcon: React.FC = () => <Icon><path d="M9.03 2.03a3.5 3.5 0 1 1 5.94 0L12 6l-2.97-3.97zM12 6V3M9 9a3 3 0 0 0-3 3v1c0 1.66 1.34 3 3 3h6c1.66 0 3-1.34 3-3v-1a3 3 0 0 0-3-3h-2M9 9a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v0M6.5 16a5.5 5.5 0 1 1 11 0" /></Icon>;
export const PrintIcon: React.FC = () => <Icon><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></Icon>;
export const SaveIcon: React.FC = () => <Icon><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></Icon>;
export const MoonIcon: React.FC = () => <Icon><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></Icon>;
export const SunIcon: React.FC = () => <Icon><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></Icon>;
export const CalendarIcon: React.FC = () => <Icon><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></Icon>;
export const ArrowLeftIcon: React.FC = () => <Icon><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></Icon>;
export const PreventionIcon: React.FC = () => <Icon><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>;
export const OrthodonticsIcon: React.FC = () => <Icon><path d="M5 8h14M9 8a3 3 0 0 1-3-3h0a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3h0a3 3 0 0 1-3 3M9 12a3 3 0 0 1-3-3h0a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3h0a3 3 0 0 1-3 3M5 16h14" /></Icon>;
export const OralSurgeryIcon: React.FC = () => <Icon><path d="M14.5 2.5a2.5 2.5 0 0 0-5 0v1h5v-1z" /><path d="M12 12h.01" /><path d="M16 16h.01" /><path d="M8 16h.01" /><path d="M12 21a9 9 0 0 0 9-9h-3a6 6 0 0 1-12 0H3a9 9 0 0 0 9 9z" /></Icon>;
export const CosmeticDentistryIcon: React.FC = () => <Icon><path d="M2 15s4-7 10-7 10 7 10 7" /><path d="M2 15a41.1 41.1 0 0 1 20 0" /></Icon>;
export const TeamIcon: React.FC = () => <Icon><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>;
export const AppointmentIcon: React.FC = () => <Icon><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M10 16h4" /></Icon>;
export const EmergencyIcon: React.FC = () => <Icon><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></Icon>;
export const ClockIcon: React.FC = () => <Icon><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>;
export const GiftIcon: React.FC = () => <Icon><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></Icon>;
export const CloseIcon: React.FC = () => <Icon><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>;
export const UserIcon: React.FC = () => <Icon><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>;
export const PhoneIcon: React.FC = () => <Icon><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></Icon>;
export const EmailIcon: React.FC = () => <Icon><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></Icon>;
export const ServiceIcon: React.FC = () => <Icon><path d="m3.85 8.62 4-4a2 2 0 0 1 2.83 0l4 4a2 2 0 0 1 0 2.83l-4 4a2 2 0 0 1-2.83 0l-4-4a2 2 0 0 1 0-2.83z" /><path d="m12 12 10 10" /></Icon>;
export const PasswordIcon: React.FC = () => <Icon><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon>;
export const SettingsIcon: React.FC = () => <Icon><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></Icon>;
export const OdontogramIcon: React.FC = () => <Icon><path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 2a10 10 0 0 0-10 10" /><path d="M2 12h20" /><path d="M12 2v20" /></Icon>;
