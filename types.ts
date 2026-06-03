import React from 'react';

export type AppointmentStatus = 'requested' | 'confirmed' | 'waiting' | 'in_consultation' | 'completed' | 'canceled';

export type PaymentMethod = 'yape' | 'plin' | 'efectivo' | 'visa' | 'transferencia' | 'pendiente';
export type PaymentStatus = 'pendiente' | 'confirmado';

export interface Appointment {
    id: string;
    name: string;
    phone: string;
    email: string;
    dateTime: string;
    service: string;
    status: AppointmentStatus;
    doctorId?: string;
    paymentMethod?: PaymentMethod;
    paymentStatus?: PaymentStatus;
}

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
}

export interface AppSettings {
    clinicName: string;
    clinicAddress: string;
    clinicPhone: string;
    clinicEmail: string;
    heroImageUrl: string;
    loginImageUrl: string;
}

export type ClinicalSessionUrgency = 'rutina' | 'urgencia' | 'emergencia';

export interface OdontogramData {
  [toothNum: number]: {
    O: string;
    V: string;
    M: string;
    D: string;
    P: string;
  };
}

export interface ClinicalSession {
    id: string;
    date: string;
    doctorId?: string;
    
    // Paso 1
    motivoConsulta: string;
    urgency: ClinicalSessionUrgency;
    painScale: number;
  
    // Paso 2
    odontograma: OdontogramData;
    examenObservaciones: string;
  
    // Paso 3
    cie10: string;
    diagnosticoDesc: string;
    adjuntoUrl: string;
  
    // Paso 4
    piezasTratadas: string;
    superficiesTratadas: string;
    procedimientos: string[];
    material: string;
    anestesia: string;
    tratamientoObs: string;
  
    // Paso 5
    indicaciones: string;
    receta: string;
    proximaCitaFecha: string;
    proximaCitaMotivo: string;
    montoCobrado: number;
    metodoPago: PaymentMethod;
}

export interface TreatmentPlanItem {
    id: string;
    pieza: string;
    procedimiento: string;
    estado: 'pendiente' | 'en_curso' | 'completado';
    costoEstimado: number;
}

export interface PatientRecord {
    patientId: string;
    name: string;
    phone: string;
    email: string;
    medicalAlerts: string;
    dentalHistory: string;
    treatmentPlan: TreatmentPlanItem[];
    sessions: ClinicalSession[];
}

export interface AdminAppointmentModalProps {
    appointment: Appointment | Partial<Appointment> | null;
    doctors: Doctor[];
    onClose: () => void;
    onSave: (appointment: Omit<Appointment, 'id'> & { id?: string }) => void;
}

export interface Promotion {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    ctaText: string;
    isActive: boolean;
    details: string; // Newlines will be used for list items
}

export interface AdminPromotionModalProps {
    promotion: Promotion | Partial<Promotion> | null;
    onClose: () => void;
    onSave: (promotion: Omit<Promotion, 'id' | 'isActive'> & { id?: string }) => void;
}

export interface AdminDoctorModalProps {
    doctor: Doctor | Partial<Doctor> | null;
    onClose: () => void;
    onSave: (doctor: Omit<Doctor, 'id'> & { id?: string }) => void;
}