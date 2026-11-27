import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useNetworkStore } from '../../store/networkStore';
import { syncOfflineQueue } from '../../services/offlineQueue';
import api from '../../services/api';

export const useNetwork = () => {
  const {
    isConnected,
    isInternetReachable,
    connectionType,
    latencyMs,
    offlineQueue,
    setNetworkState,
    setLatency,
    enqueueAction,
  } = useNetworkStore();

  const [testingLatency, setTestingLatency] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkState(state);
      if (state.isConnected && state.isInternetReachable) {
        syncOfflineQueue();
      }
    });

    return () => unsubscribe();
  }, []);

  const pingServerLatency = async () => {
    setTestingLatency(true);
    const start = Date.now();
    try {
      await api.get('/api/categories', { timeout: 5000 });
      const duration = Date.now() - start;
      setLatency(duration);
      setTestingLatency(false);
      return duration;
    } catch (e) {
      setLatency(null);
      setTestingLatency(false);
      return null;
    }
  };

  return {
    isConnected,
    isInternetReachable,
    connectionType,
    latencyMs,
    offlineQueue,
    testingLatency,
    pingServerLatency,
    enqueueAction,
  };
};
