import { useState } from 'react';
import { Loader2, Navigation, Radio, MapPin } from 'lucide-react';
import type { SedeConfig } from '@/types';
import { fetchDoctorLiveLocation } from '@/hooks/useDoctorLiveLocation';
import { readPosition } from '@/lib/geolocation';
import { calculateDistance, formatDistance } from '@/lib/distance';

interface DoctorDistanceModuleProps {
  sede: SedeConfig;
  doctorCedula?: string;
}

interface DistanceResult {
  meters: number;
  toDoctor: boolean;
}

export function DoctorDistanceModule({ sede, doctorCedula }: DoctorDistanceModuleProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DistanceResult | null>(null);
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      const [position, doctorLive] = await Promise.all([
        readPosition(sede.allowSameDayBooking),
        doctorCedula ? fetchDoctorLiveLocation(doctorCedula) : Promise.resolve(null),
      ]);
      const target = doctorLive ?? sede;
      setResult({
        meters: calculateDistance(position.lat, position.lng, target.lat, target.lng),
        toDoctor: doctorLive !== null,
      });
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la ubicación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-blue-100">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">Ver distancia al médico</p>
        <button
          type="button"
          onClick={handleUpdate}
          disabled={loading}
          className="flex items-center gap-1.5 bg-white text-blue-700 border border-blue-200 text-xs font-semibold
                     px-3 py-2 rounded-lg hover:bg-blue-100 active:scale-[0.98] transition-all
                     disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
          {loading ? 'Actualizando...' : 'Actualizar ubicación'}
        </button>
      </div>

      {result && (
        <div className="mt-2.5 flex items-start gap-2">
          {result.toDoctor ? (
            <Radio className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <MapPin className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="text-lg font-bold text-slate-800">{formatDistance(result.meters)}</p>
            <p className="text-xs text-slate-500">
              {result.toDoctor
                ? 'De tu médico, según su ubicación en vivo.'
                : 'Del centro de atención. El médico no comparte su ubicación en este momento.'}
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
