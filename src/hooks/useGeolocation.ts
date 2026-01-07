import { useState, useEffect, useCallback } from "react";

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  isLoading: boolean;
  error: string | null;
  locationName: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    isLoading: true,
    error: null,
    locationName: null,
  });

  const getLocationName = useCallback(async (lat: number, lon: number) => {
    try {
      // Use OpenStreetMap Nominatim for reverse geocoding (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const city = data.address?.city || 
                    data.address?.town || 
                    data.address?.village || 
                    data.address?.county ||
                    data.address?.state;
        return city || "Unknown Location";
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
    return null;
  }, []);

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Geolocation is not supported by your browser",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const locationName = await getLocationName(latitude, longitude);
        
        setState({
          latitude,
          longitude,
          accuracy,
          isLoading: false,
          error: null,
          locationName,
        });
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, [getLocationName]);

  // Request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Watch position for updates
  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Only update if position changed significantly (> 100m)
        setState((prev) => {
          if (prev.latitude && prev.longitude) {
            const distance = Math.sqrt(
              Math.pow(latitude - prev.latitude, 2) + 
              Math.pow(longitude - prev.longitude, 2)
            ) * 111000; // Approximate meters per degree
            
            if (distance < 100) return prev;
          }
          
          getLocationName(latitude, longitude).then((locationName) => {
            setState((s) => ({ ...s, locationName }));
          });
          
          return {
            ...prev,
            latitude,
            longitude,
            accuracy,
            isLoading: false,
          };
        });
      },
      undefined,
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 600000, // 10 minutes
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [getLocationName]);

  return {
    ...state,
    refetch: requestLocation,
    hasLocation: state.latitude !== null && state.longitude !== null,
  };
}
