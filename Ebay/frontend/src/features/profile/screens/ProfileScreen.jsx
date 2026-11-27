import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../hooks/useProfile';
import { useCamera } from '../../1.Camera/useCamera';
import { Header } from '../../../components/Header';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';

const PLACEHOLDER_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';

export const ProfileScreen = () => {
  const { profile, updateProfile } = useProfile();
  const { pickImagesFromGallery, uploadImage, isUploading } = useCamera();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [college, setCollege] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  // Contact preferences
  const [prefWhatsapp, setPrefWhatsapp] = useState(true);
  const [prefEmail, setPrefEmail] = useState(true);
  const [prefPhone, setPrefPhone] = useState(false);
  const [prefPublic, setPrefPublic] = useState(true);

  // Keep the form in sync once the profile finishes loading.
  useEffect(() => {
    if (!profile) return;
    setName(profile.name || '');
    setAvatar(profile.avatar || '');
    setCollege(profile.college || '');
    setPhone(profile.phone || '');
    setBio(profile.bio || '');
    setPrefWhatsapp(profile.contactPreferences?.whatsapp ?? true);
    setPrefEmail(profile.contactPreferences?.email ?? true);
    setPrefPhone(profile.contactPreferences?.phone ?? false);
    setPrefPublic(profile.contactPreferences?.showPublic ?? true);
  }, [profile]);

  const handlePickAvatar = async () => {
    const uris = await pickImagesFromGallery(1);
    if (!uris || uris.length === 0) return;
    const url = await uploadImage(uris[0]);
    setAvatar(url);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your full name.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        avatar,
        college,
        phone,
        bio,
        contactPreferences: {
          whatsapp: prefWhatsapp,
          email: prefEmail,
          phone: prefPhone,
          showPublic: prefPublic,
        },
      });
      setSaving(false);
      Alert.alert('Saved!', 'Your profile and contact preferences were updated.');
    } catch (e) {
      setSaving(false);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Edit Profile" showSearch={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={handlePickAvatar}
            activeOpacity={0.85}
            disabled={isUploading}
            accessibilityLabel="Change profile photo"
          >
            <Image source={{ uri: avatar || PLACEHOLDER_AVATAR }} style={styles.avatar} />
            <View style={styles.avatarBadge}>
              {isUploading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Ionicons name="camera" size={16} color={colors.white} />
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.avatarActions}>
            <TouchableOpacity onPress={handlePickAvatar} disabled={isUploading}>
              <Text style={styles.avatarActionText}>
                {isUploading ? 'Uploading…' : avatar ? 'Change photo' : 'Add photo'}
              </Text>
            </TouchableOpacity>
            {!!avatar && !isUploading && (
              <>
                <Text style={styles.avatarDot}>·</Text>
                <TouchableOpacity onPress={() => setAvatar('')}>
                  <Text style={[styles.avatarActionText, styles.avatarRemove]}>Remove</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Basic details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal details</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.label}>Email</Text>
          <View style={[styles.input, styles.inputReadOnly]}>
            <Text style={styles.inputReadOnlyText}>{profile?.email || '—'}</Text>
            <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} />
          </View>

          <Text style={styles.label}>College / Institution</Text>
          <TextInput
            style={styles.input}
            value={college}
            onChangeText={setCollege}
            placeholder="e.g. XYZ College"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.label}>Phone / WhatsApp</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g. +91 98765 43210"
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Bio / Department</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={bio}
            onChangeText={setBio}
            placeholder="e.g. 3rd year Mechanical student. Selling textbooks before sem break."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Contact Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buyer Contact Preferences</Text>
          <Text style={styles.sectionSubtitle}>
            Choose how campus buyers can connect with you on accepted offers.
          </Text>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Allow WhatsApp Messaging</Text>
              <Text style={styles.switchDesc}>Buyers can click to chat on WhatsApp</Text>
            </View>
            <Switch
              value={prefWhatsapp}
              onValueChange={setPrefWhatsapp}
              thumbColor={prefWhatsapp ? colors.primary : colors.textMuted}
              trackColor={{ false: colors.surfaceBorder, true: 'rgba(31, 78, 137, 0.4)' }}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Allow Email Inquiries</Text>
              <Text style={styles.switchDesc}>Share college email on seller card</Text>
            </View>
            <Switch
              value={prefEmail}
              onValueChange={setPrefEmail}
              thumbColor={prefEmail ? colors.primary : colors.textMuted}
              trackColor={{ false: colors.surfaceBorder, true: 'rgba(31, 78, 137, 0.4)' }}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Allow Direct Phone Calls</Text>
              <Text style={styles.switchDesc}>Enable phone dialer button</Text>
            </View>
            <Switch
              value={prefPhone}
              onValueChange={setPrefPhone}
              thumbColor={prefPhone ? colors.primary : colors.textMuted}
              trackColor={{ false: colors.surfaceBorder, true: 'rgba(31, 78, 137, 0.4)' }}
            />
          </View>

          <View style={[styles.switchRow, styles.switchRowLast]}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Public Contact Profile</Text>
              <Text style={styles.switchDesc}>Show enabled details to verified classmates</Text>
            </View>
            <Switch
              value={prefPublic}
              onValueChange={setPrefPublic}
              thumbColor={prefPublic ? colors.primary : colors.textMuted}
              trackColor={{ false: colors.surfaceBorder, true: 'rgba(31, 78, 137, 0.4)' }}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btnSave, saving && styles.btnSaveDisabled]}
          onPress={handleSave}
          disabled={saving || isUploading}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.btnSaveText}>Save Profile Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  avatarWrap: {
    width: 96,
    height: 96,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surfaceRaised,
  },
  avatarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  avatarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  avatarActionText: {
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
    color: colors.primary,
  },
  avatarRemove: {
    color: colors.accent,
  },
  avatarDot: {
    color: colors.textMuted,
    fontSize: 14,
  },
  section: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: fonts.headingBold,
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: fonts.body,
    lineHeight: 16,
    marginBottom: 14,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: fonts.headingBold,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.body,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 14,
  },
  inputReadOnly: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  inputReadOnlyText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: fonts.body,
  },
  textarea: {
    height: 70,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  switchRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  switchTextCol: {
    flex: 1,
    marginRight: 10,
  },
  switchTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontFamily: fonts.headingBold,
  },
  switchDesc: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  btnSave: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  btnSaveDisabled: {
    opacity: 0.6,
  },
  btnSaveText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.headingBold,
  },
});
