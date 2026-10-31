import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface DoctorLiveLocation {
  lat: number;
  lng: number;
  updatedAt: number;
}

const POLL_MS = 10000;

export function useDoctorLiveLocation(doctorCedula: string | undefined): DoctorLiveLocation | null {
  const [location, setLocation] = useState<DoctorLiveLocation | null>(null);

  useEffect(() => {
    if (!doctorCedula) {
      setLocation(null);
      return;
    }
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from('doctor_live_location')
        .select('lat, lng, is_sharing, updated_at')
        .eq('doctor_cedula', doctorCedula)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data || !data.is_sharing || data.lat == null || data.lng == null) {
        setLocation(null);
        return;
      }
      setLocation({
        lat: data.lat,
        lng: data.lng,
        updatedAt: new Date(data.updated_at).getTime(),
      });
    };

    load();
    const id = window.setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [doctorCedula]);

  return location;
}
