import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestLocation = async () => {
    setIsLoading(true);
    try {
      if (Platform.OS === 'web') {
        const mockLoc = {
          coords: { latitude: 28.6139, longitude: 77.2090 },
        };
        setLocation(mockLoc);
        setAddress('DTU Main Campus, Rohini, Delhi');
        setHasPermission(true);
        setIsLoading(false);
        return { coords: mockLoc.coords, address: 'DTU Main Campus, Rohini, Delhi' };
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);

      if (!granted) {
        setIsLoading(false);
        Alert.alert(
          'Location Permission',
          'Grant location permission to find items right around your campus hostel and library!'
        );
        return null;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(current);

      // Reverse geocode
      const [place] = await Location.reverseGeocodeAsync({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });

      let readable = 'Campus Pickup Spot';
      if (place) {
        readable = [place.name, place.street, place.district, place.city]
          .filter(Boolean)
          .join(', ');
      }
      setAddress(readable);
      setIsLoading(false);

      return { coords: current.coords, address: readable };
    } catch (e) {
      console.warn('Location lookup error:', e);
      setIsLoading(false);
      return null;
    }
  };

  // Distance in KM using Haversine formula
  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Earth radius in KM
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  return {
    location,
    address,
    hasPermission,
    isLoading,
    requestLocation,
    getDistanceKm,
  };
};
