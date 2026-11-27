import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { requestCameraPermissionsAsync } from 'expo-camera';
import { Linking, Alert, Platform } from 'react-native';
import api from '../../services/api';

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'web') {
      setHasPermission(true);
      return true;
    }
    const { status } = await requestCameraPermissionsAsync();
    const granted = status === 'granted';
    setHasPermission(granted);

    if (!granted) {
      Alert.alert(
        'Camera Permission Needed',
        'Buy & Sell needs camera access to let you photograph items you want to list for sale.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
    return granted;
  };

  const pickImagesFromGallery = async (maxPhotos = 5) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery access is required to upload photos.');
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: maxPhotos,
      quality: 0.7,
    });

    if (result.canceled) return [];
    return result.assets.map((asset) => asset.uri);
  };

  const uploadImage = async (uri) => {
    setIsUploading(true);
    setUploadProgress(10);
    try {
      const formData = new FormData();
      const filename = uri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      if (Platform.OS === 'web') {
        // web mock or blob
        formData.append('imageUrl', uri);
      } else {
        formData.append('file', {
          uri,
          name: filename,
          type,
        });
      }

      setUploadProgress(40);
      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      setIsUploading(false);
      return res.data.url || uri;
    } catch (e) {
      console.warn('Upload failed, falling back to local uri:', e.message);
      setIsUploading(false);
      return uri;
    }
  };

  return {
    hasPermission,
    requestCameraPermission,
    pickImagesFromGallery,
    uploadImage,
    isUploading,
    uploadProgress,
  };
};
