import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFileSystem } from './useFileSystem';
import { Header } from '../../components/Header';
import { EmptyState } from '../../components/EmptyState';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export const DownloadsStorageScreen = ({ navigation }) => {
  const {
    cacheSizeMb,
    drafts,
    isExporting,
    clearAppCache,
    loadLocalDrafts,
    deleteDraftFile,
    exportSalesReport,
  } = useFileSystem();

  useEffect(() => {
    loadLocalDrafts();
  }, []);

  const [clearVisible, setClearVisible] = useState(false);

  const handleClear = () => setClearVisible(true);

  const confirmClear = async () => {
    setClearVisible(false);
    await clearAppCache();
  };

  const renderDraft = ({ item }) => {
    return (
      <View style={styles.draftCard}>
        <View style={styles.draftInfo}>
          <Text style={styles.draftTitle} numberOfLines={1}>
            {item.title || 'Untitled Draft'}
          </Text>
          <Text style={styles.draftCategory}>
            {item.category || 'General'} • ₹{item.price || '0'}
          </Text>
          <Text style={styles.draftDate}>
            Saved: {new Date(item.updatedAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.draftActions}>
          <TouchableOpacity
            style={styles.btnResume}
            onPress={() => navigation.navigate('CreateListing', { draft: item })}
          >
            <Text style={styles.btnResumeText}>Resume</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnDeleteDraft}
            onPress={() => deleteDraftFile(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color={colors.coral} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Downloads & Storage" showSearch={false} />

      <View style={styles.content}>
        {/* Storage Overview */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.iconBox}>
              <Ionicons name="server-outline" size={28} color={colors.sage} />
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Cached Marketplace Assets</Text>
              <Text style={styles.summaryValue}>{cacheSizeMb} MB</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.btnClear} onPress={handleClear}>
            <Ionicons name="trash-outline" size={16} color={colors.coral} />
            <Text style={styles.btnClearText}>Clear Cached Files</Text>
          </TouchableOpacity>
        </View>

        {/* CSV Sales Export */}
        <View style={styles.exportSection}>
          <View style={styles.exportHeader}>
            <Ionicons name="document-text-outline" size={22} color={colors.ebayBlue} />
            <View style={styles.exportTextCol}>
              <Text style={styles.exportTitle}>My Sales Report (CSV)</Text>
              <Text style={styles.exportSubtitle}>
                Generate and share complete history of sold items with prices and dates.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.btnExport}
            onPress={exportSalesReport}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Ionicons name="share-outline" size={18} color={colors.white} />
                <Text style={styles.btnExportText}>Export & Share CSV</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Saved Drafts */}
        <Text style={styles.sectionTitle}>Saved Listing Drafts ({drafts.length})</Text>

        <FlatList
          data={drafts}
          keyExtractor={(item) => item.id}
          renderItem={renderDraft}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="document-outline"
              title="No Saved Drafts"
              subtitle="Listing forms auto-save to your device so you never lose your progress."
            />
          }
        />
      </View>

      <ConfirmDialog
        visible={clearVisible}
        title="Clear Cache"
        message="Do you want to clear temporary offline image caches?"
        confirmLabel="Clear"
        isDestructive
        onCancel={() => setClearVisible(false)}
        onConfirm={confirmClear}
      />
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
    flex: 1,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  summaryCol: {
    flex: 1,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: fonts.heading,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: 24,
    fontFamily: fonts.headingBold,
    marginTop: 2,
  },
  btnClear: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(217, 58, 63, 0.1)',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(217, 58, 63, 0.25)',
    gap: 6,
  },
  btnClearText: {
    color: colors.coral,
    fontSize: 13,
    fontFamily: fonts.headingBold,
  },
  exportSection: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 20,
  },
  exportHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  exportTextCol: {
    marginLeft: 10,
    flex: 1,
  },
  exportTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontFamily: fonts.headingBold,
  },
  exportSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: fonts.body,
    lineHeight: 16,
    marginTop: 2,
  },
  btnExport: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sage,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  btnExportText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: fonts.headingBold,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: fonts.headingBold,
    marginBottom: 12,
  },
  draftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  draftInfo: {
    flex: 1,
    marginRight: 12,
  },
  draftTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.headingBold,
    marginBottom: 2,
  },
  draftCategory: {
    color: colors.sage,
    fontSize: 12,
    fontFamily: fonts.heading,
  },
  draftDate: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: fonts.body,
    marginTop: 4,
  },
  draftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnResume: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.sage,
  },
  btnResumeText: {
    color: colors.sage,
    fontSize: 12,
    fontFamily: fonts.headingBold,
  },
  btnDeleteDraft: {
    padding: 6,
  },
});