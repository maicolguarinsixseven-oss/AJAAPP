import { MapPin, Radio } from 'lucide-react';
import type { SedeConfig } from '@/types';
import { CHECKIN_RADIUS_METERS } from '@/hooks/useGeolocation';
import { useDoctorLiveLocation } from '@/hooks/useDoctorLiveLocation';
import { useOwnPosition } from '@/hooks/useOwnPosition';
import { usePatientLocationPublishing } from '@/hooks/usePatientLiveLocation';
import { calculateDistance, formatDistance } from '@/lib/distance';

interface CheckInZoneCardProps {
  sede: SedeConfig;
  patientCedula: string;
  doctorCedula?: string;
}

export function CheckInZoneCard({ sede, patientCedula, doctorCedula }: CheckInZoneCardProps) {
  const doctorLive = useDoctorLiveLocation(doctorCedula);
  const sharing = doctorLive !== null;
  const own = useOwnPosition(true);
  usePatientLocationPublishing(patientCedula, doctorCedula, sharing, own.position);

  const target = sharing && doctorLive ? doctorLive : sede;
  const distance = own.position
    ? calculateDistance(own.position.lat, own.position.lng, target.lat, target.lng)
    : null;

  return (
    <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2.5">
      <MapPin className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm">{sede.name}</p>
        <p className="text-sm text-slate-500">{sede.address}</p>
        <p className="text-xs text-blue-700 mt-1">
          Zona de check-in: {CHECKIN_RADIUS_METERS}m a la redonda
        </p>
        <div className="mt-2 pt-2 border-t border-blue-100">
          {distance !== null ? (
            <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
              {sharing && <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />}
              {formatDistance(distance)}
              <span className="text-xs font-normal text-slate-500">
                {sharing ? 'de tu médico (en vivo)' : 'del centro de atención'}
              </span>
            </p>
          ) : (
            <p className="text-xs text-slate-500">{own.error || 'Obteniendo tu ubicación...'}</p>
          )}
        </div>
      </div>
    </div>
  );
}
