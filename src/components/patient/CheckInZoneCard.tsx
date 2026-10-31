import { MapPin, Radio } from 'lucide-react';
import type { SedeConfig } from '@/types';
import { CHECKIN_RADIUS_METERS } from '@/hooks/useGeolocation';
import { useDoctorLiveLocation } from '@/hooks/useDoctorLiveLocation';

interface CheckInZoneCardProps {
  sede: SedeConfig;
  doctorCedula?: string;
}

export function CheckInZoneCard({ sede, doctorCedula }: CheckInZoneCardProps) {
  const liveLocation = useDoctorLiveLocation(doctorCedula);

  return (
    <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2.5">
      <MapPin className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm">{sede.name}</p>
        <p className="text-sm text-slate-500">{sede.address}</p>
        <p className="text-xs text-blue-700 mt-1">
          Zona de check-in: {CHECKIN_RADIUS_METERS}m a la redonda
        </p>
        {liveLocation && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-700 mt-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            El médico comparte su ubicación en vivo: {liveLocation.lat.toFixed(5)}, {liveLocation.lng.toFixed(5)}
          </p>
        )}
      </div>
    </div>
  );
}
