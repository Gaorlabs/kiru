import React, { useState } from 'react';
import type { ClinicalSession, OdontogramData, PaymentMethod, ClinicalSessionUrgency } from '../types';
import { InteractiveOdontogram } from './InteractiveOdontogram';

interface ClinicalSessionFlowProps {
  onSaveSession: (session: ClinicalSession) => void;
  onCancel: () => void;
  doctorId: string; // The active doctor filling it
}

const PROCEDURES_LIST = [
  'Obturación', 'Endodoncia', 'Extracción', 'Profilaxis', 
  'Corona', 'Sellante', 'Blanqueamiento', 'Implante', 'Otro'
];

export const ClinicalSessionFlow: React.FC<ClinicalSessionFlowProps> = ({ onSaveSession, onCancel, doctorId }) => {
  const [step, setStep] = useState<number>(1);
  const [session, setSession] = useState<Partial<ClinicalSession>>({
    motivoConsulta: '', urgency: 'rutina', painScale: 0,
    odontograma: {}, examenObservaciones: '',
    cie10: '', diagnosticoDesc: '', adjuntoUrl: '',
    piezasTratadas: '', superficiesTratadas: '', procedimientos: [], material: '', anestesia: '', tratamientoObs: '',
    indicaciones: '', receta: '', proximaCitaFecha: '', proximaCitaMotivo: '', montoCobrado: 0, metodoPago: 'pendiente'
  });

  const updateSession = (fields: Partial<ClinicalSession>) => {
    setSession(prev => ({ ...prev, ...fields }));
  };

  const handleFinish = () => {
    const finalSession: ClinicalSession = {
      ...(session as ClinicalSession),
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      doctorId
    };
    onSaveSession(finalSession);
  };

  const StepIndicator = ({ currentNum, title }: { currentNum: number, title: string }) => {
    const isActive = step === currentNum;
    const isDone = step > currentNum;
    return (
      <div 
        onClick={() => setStep(currentNum)}
        className={`flex items-start gap-3 p-3 cursor-pointer border-l-2 transition-colors ${
          isActive ? 'bg-teal-900/20 border-teal-500' : 
          isDone ? 'border-transparent opacity-70' : 'border-transparent opacity-40 hover:opacity-70'
        }`}
      >
        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
          isActive ? 'bg-teal-500 text-white' : 
          isDone ? 'bg-teal-900 text-teal-300' : 'bg-slate-800 text-slate-500'
        }`}>
          {isDone ? '✓' : currentNum}
        </div>
        <div className={`text-xs font-medium leading-snug ${isActive ? 'text-slate-200' : 'text-slate-400'}`}>
          {title}
        </div>
      </div>
    );
  };

  return (
    <div className="flex bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800 h-[700px]">
      <div className="w-48 bg-slate-950/50 border-r border-slate-800 py-4 shrink-0 flex flex-col">
        <StepIndicator currentNum={1} title="Motivo de consulta" />
        <StepIndicator currentNum={2} title="Examen y odontograma" />
        <StepIndicator currentNum={3} title="Diagnóstico" />
        <StepIndicator currentNum={4} title="Tratamiento realizado" />
        <StepIndicator currentNum={5} title="Cierre de sesión" />
      </div>

      <div className="flex-1 flex flex-col pt-6 px-8 pb-4 overflow-y-auto">
        <div className="flex-1">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-semibold text-slate-100">Motivo de consulta</h2>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Descripción del motivo</label>
                <textarea 
                  value={session.motivoConsulta} onChange={e => updateSession({ motivoConsulta: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:border-teal-500 focus:outline-none min-h-[100px]"
                  placeholder="Ej: Dolor al masticar en el lado derecho..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Tipo de Consulta</label>
                <div className="flex gap-2">
                  {(['rutina', 'urgencia', 'emergencia'] as const).map(u => (
                    <button key={u} onClick={() => updateSession({ urgency: u })}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm transition-all border ${
                        session.urgency === u ? 'bg-teal-900/30 border-teal-500 text-teal-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {u.charAt(0).toUpperCase() + u.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold flex justify-between">
                  Escala de Dolor <span>{session.painScale} / 10</span>
                </label>
                <input type="range" min="0" max="10" 
                  value={session.painScale} onChange={e => updateSession({ painScale: parseInt(e.target.value) })}
                  className="w-full accent-teal-500"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-semibold text-slate-100">Examen clínico e Odontograma</h2>
              <InteractiveOdontogram 
                odontogramData={session.odontograma || {}}
                onChange={(data) => updateSession({ odontograma: data })}
                examenObservaciones={session.examenObservaciones || ''}
                onChangeObservaciones={(obs) => updateSession({ examenObservaciones: obs })}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-semibold text-slate-100">Diagnóstico</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Código CIE-10</label>
                  <input type="text" 
                    value={session.cie10} onChange={e => updateSession({ cie10: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:border-teal-500 focus:outline-none"
                    placeholder="Ej: K02.1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Adjunto Clínico</label>
                  <div className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-500 text-center cursor-pointer hover:bg-slate-700 transition-colors">
                    + Adjuntar radiografía o foto
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Descripción del diagnóstico</label>
                <textarea 
                  value={session.diagnosticoDesc} onChange={e => updateSession({ diagnosticoDesc: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:border-teal-500 focus:outline-none min-h-[100px]"
                  placeholder="Describe los hallazgos para el diagnóstico..."
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-semibold text-slate-100">Tratamiento realizado hoy</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Pieza(s) Tratada(s)</label>
                  <input type="text" value={session.piezasTratadas} onChange={e => updateSession({ piezasTratadas: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:border-teal-500" placeholder="Ej: 36, 37" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Superficie(s)</label>
                  <input type="text" value={session.superficiesTratadas} onChange={e => updateSession({ superficiesTratadas: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:border-teal-500" placeholder="Ej: O, M" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Procedimiento</label>
                <div className="flex flex-wrap gap-2">
                  {PROCEDURES_LIST.map(p => {
                    const isSelected = session.procedimientos?.includes(p);
                    return (
                      <button key={p} 
                        onClick={() => {
                          const newProcs = isSelected 
                            ? session.procedimientos?.filter(x => x !== p) 
                            : [...(session.procedimientos||[]), p];
                          updateSession({ procedimientos: newProcs });
                        }}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                          isSelected ? 'bg-teal-900/30 border-teal-500 text-teal-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >{p}</button>
                    )
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Material</label>
                  <input type="text" value={session.material} onChange={e => updateSession({ material: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:border-teal-500" placeholder="Ej: Resina 3M" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Anestesia</label>
                  <input type="text" value={session.anestesia} onChange={e => updateSession({ anestesia: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:border-teal-500" placeholder="Ej: Lidocaína" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Observaciones</label>
                <textarea 
                  value={session.tratamientoObs} onChange={e => updateSession({ tratamientoObs: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:border-teal-500 focus:outline-none min-h-[80px]"
                  placeholder="Detalles técnicos, complicaciones..."
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 mb-8">
              <h2 className="text-xl font-semibold text-slate-100">Cierre de sesión y cobro</h2>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Indicaciones al paciente</label>
                <textarea value={session.indicaciones} onChange={e => updateSession({ indicaciones: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:border-teal-500 focus:outline-none min-h-[60px]" placeholder="Ej: Dieta blanda..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Receta Médica</label>
                <textarea value={session.receta} onChange={e => updateSession({ receta: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:border-teal-500 focus:outline-none min-h-[60px]" placeholder="Medicamentos..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Cita Sugerida</label>
                  <input type="date" value={session.proximaCitaFecha} onChange={e => updateSession({ proximaCitaFecha: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:border-teal-500" style={{ colorScheme: 'dark' }} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Motivo Próxima Cita</label>
                  <input type="text" value={session.proximaCitaMotivo} onChange={e => updateSession({ proximaCitaMotivo: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:border-teal-500" placeholder="Ej: Terminar endodoncia" />
                </div>
              </div>
              <div className="border-t border-slate-700/50 pt-4 mt-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-amber-500 font-semibold">Monto cobrado esta sesión (S/)</label>
                        <input type="number" value={session.montoCobrado || ''} onChange={e => updateSession({ montoCobrado: parseFloat(e.target.value) || 0 })}
                            className="w-48 bg-slate-900 border border-amber-700/50 rounded-lg p-3 text-2xl font-bold text-amber-400 focus:border-amber-500 focus:outline-none" placeholder="0.00" />
                    </div>
                    <div className="space-y-2 pb-6">
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Método de pago</label>
                        <div className="flex flex-wrap gap-2">
                            {(['efectivo','yape','plin','tarjeta','transferencia','pendiente']).map(m => (
                                <button key={m} onClick={() => updateSession({ metodoPago: m as PaymentMethod })}
                                className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                    session.metodoPago === m ? 'bg-amber-900/20 border-amber-500 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                                } capitalize`}>{m}</button>
                            ))}
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-800 mt-auto">
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-200 text-sm font-medium">
            Cancelar
          </button>
          <div className="flex gap-2">
             {step > 1 && (
                <button onClick={() => setStep(s => s - 1)} className="px-5 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800 transition-colors">
                  Anterior
                </button>
             )}
             {step < 5 ? (
                <button onClick={() => setStep(s => s + 1)} className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm transition-colors shadow-lg shadow-teal-500/20">
                  Siguiente paso
                </button>
             ) : (
                <button onClick={handleFinish} className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-colors shadow-lg shadow-amber-500/20">
                  Guardar Sesión
                </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
