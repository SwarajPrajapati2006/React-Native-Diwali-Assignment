import { useState, useEffect } from 'react';
import * as Clipboard from 'expo-clipboard';
import { AppState, ToastAndroid, Platform, Alert } from 'react-native';

export const useClipboard = () => {
  const [copiedLink, setCopiedLink] = useState(null);

  // Monitor clipboard on app resume for campusmarket links
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const text = await Clipboard.getStringAsync();
        if (text && text.includes('campusmarket://listing/')) {
          const match = text.match(/campusmarket:\/\/listing\/([a-zA-Z0-9_-]+)/);
          if (match && match[1]) {
            setCopiedLink({ id: match[1], fullUrl: text });
          }
        }
      } catch (e) {}
    };

    checkClipboard();
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        checkClipboard();
      }
    });

    return () => sub.remove();
  }, []);

  const copyText = async (text, label = 'Copied to clipboard!') => {
    try {
      await Clipboard.setStringAsync(text);
      if (Platform.OS === 'android') {
        ToastAndroid.show(label, ToastAndroid.SHORT);
      } else {
        Alert.alert('Copied!', label);
      }
      return true;
    } catch (e) {
      console.warn('Copy error:', e);
      return false;
    }
  };

  const pasteText = async () => {
    try {
      return await Clipboard.getStringAsync();
    } catch (e) {
      return '';
    }
  };

  const clearCopiedLink = () => setCopiedLink(null);

  return {
    copiedLink,
    copyText,
    pasteText,
    clearCopiedLink,
  };
};
