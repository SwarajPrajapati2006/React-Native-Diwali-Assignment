import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export const CameraScreen = ({ navigation, route }) => {
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [permission, requestPermission] = useCameraPermissions ? useCameraPermissions() : [{ granted: true }, () => {}];
  const cameraRef = useRef(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!permission?.granted && requestPermission) {
      requestPermission();
    }
  }, [permission]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
        });
        if (photo?.uri) {
          setCapturedPhoto(photo.uri);
        }
      } catch (e) {
        console.error('Capture error:', e);
      }
    }
  };

  const handleConfirm = () => {
    if (route.params?.onPhotoTaken) {
      route.params.onPhotoTaken(capturedPhoto);
    }
    navigation.goBack();
  };

  if (!permission) {
    return <View style={[styles.centerContainer, { paddingTop: insets.top }]}><ActivityIndicator color={colors.sage} /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <Ionicons name="camera-outline" size={48} color={colors.coral} />
        <Text style={styles.permText}>Camera access is needed to snap item pictures.</Text>
        <TouchableOpacity style={styles.btnAction} onPress={requestPermission}>
          <Text style={styles.btnActionText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {capturedPhoto ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
          <View style={[styles.previewActions, { bottom: insets.bottom + 24 }]}>
            <TouchableOpacity
              style={styles.actionPill}
              onPress={() => setCapturedPhoto(null)}
            >
              <Ionicons name="refresh" size={20} color={colors.white} />
              <Text style={styles.actionPillText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionPill, styles.confirmPill]}
              onPress={handleConfirm}
            >
              <Ionicons name="checkmark" size={20} color={colors.white} />
              <Text style={[styles.actionPillText, { color: colors.white }]}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          facing={facing}
          enableTorch={flash === 'on'}
          ref={cameraRef}
        >
          {/* Top Controls */}
          <View style={[styles.topBar, { paddingTop: insets.top + 12, paddingBottom: 12 }]}>
            <TouchableOpacity style={styles.topBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={26} color={colors.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.topBtn}
              onPress={() => setFlash((cur) => (cur === 'off' ? 'on' : 'off'))}
            >
              <Ionicons
                name={flash === 'on' ? 'flash' : 'flash-off'}
                size={22}
                color={flash === 'on' ? colors.ebayYellow : colors.white}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.topBtn}
              onPress={() => setFacing((cur) => (cur === 'back' ? 'front' : 'back'))}
            >
              <Ionicons name="camera-reverse-outline" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Bottom Shutter */}
          <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 24 }]}>
            <TouchableOpacity style={styles.shutterBtn} onPress={takePicture}>
              <View style={styles.shutterInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontFamily: fonts.body,
    textAlign: 'center',
    marginVertical: 16,
  },
  btnAction: {
    backgroundColor: colors.sage,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnActionText: {
    color: colors.white,
    fontFamily: fonts.headingBold,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  topBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    alignItems: 'center',
  },
  shutterBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
  },
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
  },
  previewActions: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    gap: 8,
  },
  confirmPill: {
    backgroundColor: colors.sage,
  },
  actionPillText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.headingBold,
  },
});
