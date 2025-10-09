
import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);

export const HealthyIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l2 2l4 -4" /></IconWrapper>;
export const CariesIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="3" fill="currentColor" className="text-red-500" /></IconWrapper>;
export const FillingIcon: React.FC = () => <IconWrapper><circle cx="12" cy="12" r="4" fill="currentColor" className="text-blue-500" /></IconWrapper>;
export const EndodonticsIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3l-1.465 1.638a2 2 0 1 1 -3.015 .099l-4.52 6.27a1.44 1.44 0 0 1 -2.31 .022a1.394 1.394 0 0 1 .166 -2.41l5.24 -2.535" /><path d="M12 3l1.465 1.638a2 2 0 1 0 3.015 .099l4.52 6.27a1.44 1.44 0 0 0 2.31 .022a1.394 1.394 0 0 0 -.166 -2.41l-5.24 -2.535" /><line x1="12" y1="3" x2="12" y2="21" /></IconWrapper>;
export const CrownIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19 18h-14l-1 -10h16z" fill="currentColor" className="text-yellow-400" /><rect x="4" y="8" width="16" height="1" fill="currentColor" className="text-yellow-500" /><path d="M12 8v-2" /><path d="M8 8v-2" /><path d="M16 8v-2" /></IconWrapper>;
export const ImplantIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M12 12a3 3 0 1 0 -6 0a3 3 0 1 0 6 0" /><path d="M15 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M9 12a3 3 0 1 0 -6 0a3 3 0 1 0 6 0" /><path d="M6 15a3 3 0 1 0 0 -6a3 3 0 1 0 0 6z" /><path d="M12 9a3 3 0 1 0 0 -6a3 3 0 1 0 0 6z" /><path d="M12 15a3 3 0 1 0 0 6a3 3 0 1 0 0 -6z" /><path d="M18 15a3 3 0 1 0 0 -6a3 3 0 1 0 0 6z" /><path d="M12 12l0 9" /></IconWrapper>;
export const ExtractionIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></IconWrapper>;
export const MissingIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M5.636 5.636l12.728 12.728" /></IconWrapper>;
export const UneruptedIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M5.636 5.636a9 9 0 1 0 12.728 12.728a9 9 0 0 0 -12.728 -12.728" /></IconWrapper>;
export const ChevronDownIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 9l6 6l6 -6" /></IconWrapper>
export const SaveIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" /><circle cx="12" cy="14" r="2" /><path d="M14 4.5v5.5h-4v-5.5" /></IconWrapper>;
export const PrintIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" /><path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" /><rect x="7" y="13" width="10" height="8" rx="2" /></IconWrapper>;
export const SearchIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="10" cy="10" r="7" /><line x1="21" y1="21" x2="15" y2="15" /></IconWrapper>;
export const CheckIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></IconWrapper>;
export const UndoIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" /></IconWrapper>;
export const SunIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="4" /><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" /></IconWrapper>;
export const MoonIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" /></IconWrapper>;

export const AppointmentIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12.5 21h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v5" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" /><path d="M19 16l-2 3h4l-2 3" /></IconWrapper>;
export const EmergencyIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 18h-12a1 1 0 0 1 -1 -1v-12a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1z" /><path d="M9 12h6" /><path d="M12 9v6" /></IconWrapper>;
export const ClockIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 7v5l3 3" /></IconWrapper>;

export const PreventionIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12h14" /><path d="M5 12l4 4" /><path d="M5 12l4 -4" /><path d="M19 12l-4 4" /><path d="M19 12l-4 -4" /><path d="M12 5l4 4" /><path d="M12 5l-4 4" /><path d="M12 19l4 -4" /><path d="M12 19l-4 -4" /></IconWrapper>;
export const OrthodonticsIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14.5 21.034a3.5 3.5 0 0 0 -5 0" /><path d="M5 11v-4a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v4" /><path d="M5 7h14" /><path d="M10.5 11a1.5 1.5 0 0 0 -1.5 -1.5h-1a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 0 1.5 -1.5" /><path d="M16.5 11a1.5 1.5 0 0 0 -1.5 -1.5h-1a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 0 1.5 -1.5" /><path d="M8 8v2" /><path d="M16 8v2" /></IconWrapper>;
export const OralSurgeryIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 16l2 -2l-1.002 -1.002a2.002 2.002 0 0 0 -2.826 0l-1.172 1.172l-3.172 -3.172l.142 -.142a1.5 1.5 0 0 0 0 -2.121l-2.12 -2.121a1.5 1.5 0 0 0 -2.122 0l-5.586 5.586a1.5 1.5 0 0 0 0 2.121l2.121 2.121a1.5 1.5 0 0 0 2.121 0l.144 -.144l3.172 3.172l-1.172 1.172a2.002 2.002 0 0 0 0 2.826l1.002 1.002l2 -2" /></IconWrapper>;
export const CosmeticDentistryIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 21h4" /><path d="M12 18v3" /><path d="M7.498 15.25c1.474 2.476 4.144 4.22 7.002 4.25" /><path d="M12 3c-5.463 2.14 -8.84 8.163 -9 13" /><path d="M21 16c-.16 -4.837 -3.537 -10.86 -9 -13" /><path d="M10 12l2 -2l2 2" /><path d="M10 16l2 -2l2 2" /></IconWrapper>;
export const CalendarIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="4" y="5" width="16" height="16" rx="2" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="4" y1="11" x2="20" y2="11" /><rect x="8" y="15" width="2" height="2" /></IconWrapper>;
export const CloseIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></IconWrapper>;

export const UserIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></IconWrapper>;
export const PhoneIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /></IconWrapper>;
export const EmailIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" /><path d="M3 7l9 6l9 -6" /></IconWrapper>;
export const ServiceIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path d="M9 12l2 2l4 -4" /></IconWrapper>;

export const DentalIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c1.353 0 2.665-.213 3.896-.622M12 21c-1.353 0-2.665-.213-3.896-.622m16.432-1.38A9 9 0 0 0 12 3c-4.962 0-9 4.038-9 9 0 .42.022.836.065 1.246m17.87 0A9.002 9.002 0 0 1 12 21" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 8.25a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z" />
    </svg>
);

export const ToothPlaceholderIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 80 95" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M25,20 C40,15 60,15 75,20 L70,50 L30,50 Z" strokeDasharray="4" />
        <path d="M30,50 L70,50 L75,80 C60,85 40,85 25,80 Z" strokeDasharray="4" />
        <path d="M25,20 C15,35 15,65 25,80 L30,50 Z" strokeDasharray="4" />
        <path d="M75,20 C85,35 85,65 75,80 L70,50 Z" strokeDasharray="4" />
        <path d="M30,50 C40,45 60,45 70,50 C60,55 40,55 30,50 Z" strokeDasharray="4" />
        <path d="M40,80 Q45,95 50,80" strokeDasharray="4" />
    </svg>
);

export const TeamIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
        <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
        <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
        <path d="M17 10h2a2 2 0 0 1 2 2v1" />
        <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
        <path d="M3 10h2a2 2 0 0 1 2 2v1" />
    </svg>
);

export const GiftIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0 -5a2.5 2.5 0 0 1 4.5 1.5" /><path d="M16.5 8a2.5 2.5 0 0 0 0 -5a2.5 2.5 0 0 0 -4.5 1.5" /></IconWrapper>;
export const SettingsIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37a1.724 1.724 0 0 0 2.572 -1.065z" /><circle cx="12" cy="12" r="3" /></IconWrapper>;
export const PasswordIcon: React.FC = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="5" y="11" width="14" height="10" rx="2" /><circle cx="12" cy="16" r="1" /><path d="M8 11v-4a4 4 0 0 1 8 0v4" /></IconWrapper>;
