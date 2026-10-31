import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export function useLiveLocationSharing(doctorCedula: string) {
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState('');
  const watchIdRef = useRef<number | null>(null);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const publish = useCallback(
    async (lat: number | null, lng: number | null, isSharing: boolean) => {
      const { error: upsertError } = await supabase
        .from('doctor_live_location')
        .upsert(
          {
            doctor_cedula: doctorCedula,
            lat,
            lng,
            is_sharing: isSharing,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'doctor_cedula' },
        );
      if (upsertError) {
        setError('No se pudo actualizar tu ubicación. Intenta de nuevo.');
        return false;
      }
      return true;
    },
    [doctorCedula],
  );

  const setShareEnabled = useCallback(
    async (enabled: boolean) => {
      setError('');
      if (!enabled) {
        stopWatching();
        setSharing(false);
        await publish(null, null, false);
        return;
      }
      if (!navigator.geolocation) {
        setError('Geolocalización no disponible en este dispositivo.');
        return;
      }
      stopWatching();
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setSharing(true);
          publish(position.coords.latitude, position.coords.longitude, true);
        },
        () => {
          stopWatching();
          setSharing(false);
          setError('No se pudo acceder a tu ubicación. Verifica los permisos de GPS.');
          publish(null, null, false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
      );
    },
    [publish, stopWatching],
  );

  useEffect(() => {
    publish(null, null, false);
    return () => {
      stopWatching();
      publish(null, null, false);
    };
  }, [publish, stopWatching]);

  return { sharing, error, setShareEnabled };
}
