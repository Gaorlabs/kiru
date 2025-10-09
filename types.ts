import type { ReactElement } from 'react';

export type ToothSurfaceName = 'buccal' | 'lingual' | 'occlusal' | 'distal' | 'mesial' | 'root';

export type ToothCondition = 'caries' | 'filling' | 'crown' | 'endodontics' | 'implant';
export type WholeToothCondition = 'missing' | 'unerupted' | 'healthy' | 'extraction'; 

export type TreatmentStatus = 'proposed' | 'completed';
export type SessionStatus = 'pending' | 'completed';

export interface AppliedTreatment {
    id: string; 
    treatmentId: ToothCondition | WholeToothCondition;
    toothId: number;
    surface: ToothSurfaceName | 'whole';
    status: TreatmentStatus;
    sessionId: string | null; // Link to a session
}

export interface ClinicalFinding {
    id: string;
    toothId: number;
    surface: ToothSurfaceName | 'whole';
    condition: ToothCondition | WholeToothCondition;
}

export interface Session {
    id: string;
    name: string;
    status: SessionStatus;
    treatments: AppliedTreatment[];
}

export interface ToothState {
    surfaces: {
        [key in ToothSurfaceName]: AppliedTreatment[];
    };
    whole: AppliedTreatment[];
    findings: ClinicalFinding[]; // To store diagnoses before they become treatments
}

export type OdontogramState = {
    [toothId: number]: ToothState;
};

export interface DentalTreatment {
    id: ToothCondition | WholeToothCondition;
    label: string;
    category: 'Patología' | 'Operatoria' | 'Endodoncia' | 'Rehabilitación' | 'Cirugía' | 'Otros';
    price: number;
    appliesTo: 'surface' | 'whole_tooth' | 'root';
    icon: ReactElement;
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  dateTime: string; // ISO String
  service: string;
}

export interface AppSettings {
  heroImageUrl: string;
  promoImageUrl: string;
  promoTitle: string;
  promoSubtitle: string;
}
