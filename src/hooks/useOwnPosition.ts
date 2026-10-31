import { useEffect, useState } from 'react';

export interface OwnPosition {
  lat: number;
  lng: number;
}

export function useOwnPosition(enabled: boolean) {
  const [position, setPosition] = useState<OwnPosition | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!enabled) {
      setPosition(null);
      setError('');
      return;
    }
    if (!navigator.geolocation) {
      setError('Geolocalización no disponible en este dispositivo.');
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setError('');
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setPosition(null);
        setError('Activa el GPS para ver la distancia.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled]);

  return { position, error };
}
