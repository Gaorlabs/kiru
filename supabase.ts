import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validar que las credenciales no sean los marcadores de posición predeterminados
const isRealConfig = 
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'https://your-project-id.supabase.co' && 
    supabaseAnonKey !== 'your-supabase-anon-key';

export const supabase = isRealConfig 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null;

export const isSupabaseConfigured = (): boolean => {
    return supabase !== null;
};

/**
 * Script de migración SQL recomendado para crear la base de datos en Supabase.
 * Puedes copiar y pegar esto en el SQL Editor de tu Dashboard de Supabase.
 * 
 * -- 1. Tabla de Citas
 * CREATE TABLE appointments (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   name TEXT NOT NULL,
 *   phone TEXT NOT NULL,
 *   email TEXT,
 *   date_time TIMESTAMPTZ NOT NULL,
 *   service TEXT NOT NULL,
 *   status TEXT DEFAULT 'requested',
 *   payment_status TEXT DEFAULT 'pendiente',
 *   payment_method TEXT DEFAULT 'pendiente',
 *   doctor_id TEXT,
 *   created_at TIMESTAMPTZ DEFAULT now()
 * );
 * 
 * -- 2. Tabla de Doctores
 * CREATE TABLE doctors (
 *   id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   specialty TEXT NOT NULL
 * );
 * 
 * -- 3. Tabla de Promociones
 * CREATE TABLE promotions (
 *   id TEXT PRIMARY KEY,
 *   title TEXT NOT NULL,
 *   subtitle TEXT NOT NULL,
 *   image_url TEXT,
 *   cta_text TEXT,
 *   is_active BOOLEAN DEFAULT false,
 *   details TEXT
 * );
 * 
 * -- 4. Tabla de Fichas Clínicas (Historias)
 * CREATE TABLE patient_records (
 *   patient_id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   phone TEXT NOT NULL,
 *   email TEXT,
 *   medical_alerts TEXT DEFAULT '',
 *   dental_history TEXT DEFAULT '',
 *   sessions JSONB DEFAULT '[]'::jsonb,
 *   treatment_plan JSONB DEFAULT '[]'::jsonb,
 *   updated_at TIMESTAMPTZ DEFAULT now()
 * );
 * 
 * -- 5. Tabla de Configuración de la Clínica
 * CREATE TABLE app_settings (
 *   key TEXT PRIMARY KEY,
 *   value JSONB NOT NULL
 * );
 */
