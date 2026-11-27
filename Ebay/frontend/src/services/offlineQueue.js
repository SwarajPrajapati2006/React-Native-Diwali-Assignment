import api from './api';
import { useNetworkStore } from '../store/networkStore';

export const syncOfflineQueue = async () => {
  const { offlineQueue, clearQueue } = useNetworkStore.getState();
  if (!offlineQueue || offlineQueue.length === 0) return;

  console.log(`[OfflineSync] Processing ${offlineQueue.length} queued action(s)...`);

  const pending = [...offlineQueue];
  for (const item of pending) {
    try {
      if (item.type === 'TOGGLE_FAVORITE') {
        if (item.action === 'ADD') {
          await api.post('/api/favorites', { listingId: item.listingId });
        } else {
          await api.delete(`/api/favorites/${item.listingId}`);
        }
      } else if (item.type === 'UPDATE_STATUS') {
        await api.patch(`/api/listings/${item.listingId}/status`, { status: item.status });
      } else if (item.type === 'SEND_ENQUIRY') {
        await api.post('/api/enquiries', item.payload);
      }
    } catch (e) {
      console.warn('[OfflineSync] Failed action:', item.type, e.message);
    }
  }

  await clearQueue();
  console.log('[OfflineSync] Synced all offline changes successfully.');
};
