import { useState } from 'react';
import { FlaskConical } from 'lucide-react';

interface TestModeTabProps {
  enabled: boolean;
  onToggle: (next: boolean) => Promise<void>;
}

export function TestModeTab({ enabled, onToggle }: TestModeTabProps) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    setBusy(true);
    try {
      await onToggle(!enabled);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-slide-up space-y-4">
      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
        <FlaskConical className="w-5 h-5 text-blue-700" />
        Prueba Test
      </h3>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 text-sm">Agendar citas para hoy</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Desactiva temporalmente la regla de un día de anticipación para demostraciones en vivo.
          </p>
        </div>
        <button
          role="switch"
          aria-checked={enabled}
          onClick={handleClick}
          disabled={busy}
          className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${
            enabled ? 'bg-emerald-500' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      <p className="text-xs text-slate-400">
        {enabled
          ? 'Activo: la secretaria puede agendar citas para el día de hoy.'
          : 'Inactivo: se requiere al menos un día de anticipación.'}
      </p>
    </div>
  );
}
