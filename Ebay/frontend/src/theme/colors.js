// Buy & Sell — Light theme · Navy primary + Red accent
// Palette spec:
//   Primary (navy)  #1F4E89 — app bar, active tabs, links, Buy button · pressed #173A66
//   Accent (red)    #D93A3F — Sell / Post Ad, FAB, badges (reserved for this job only)
//   Text            #2F3745 titles · #6B7280 secondary
//   Background      #F3F5F7 · cards #FFFFFF · borders #E3E7EC
//   Success/Warning #16A34A / #F59E0B
export const colors = {
  // Surfaces
  background: '#F3F5F7',
  surface: '#FFFFFF',
  surfaceRaised: '#F3F5F7',
  surfaceBorder: '#E3E7EC',
  surfaceGlass: 'rgba(255, 255, 255, 0.9)',

  // Primary (navy)
  primary: '#1F4E89',
  primaryPressed: '#173A66',
  primaryLight: '#2F5EA0',
  primarySoft: 'rgba(31, 78, 137, 0.1)',
  // Legacy "sage" tokens now map to the navy primary
  sage: '#1F4E89',
  sageDark: '#173A66',
  sageLight: '#2F5EA0',
  mint: '#EEF3FA',
  mintSoft: '#E7EEF8',

  // Accent (red) — Sell / Post Ad / FAB / badges
  accent: '#D93A3F',
  accentPressed: '#B92E33',
  accentSoft: 'rgba(217, 58, 63, 0.12)',
  // Legacy "coral" tokens now map to the red accent
  coral: '#D93A3F',
  coralMuted: 'rgba(217, 58, 63, 0.12)',

  // Legacy brand accents
  ebayRed: '#D93A3F',
  ebayBlue: '#1F4E89',
  ebayYellow: '#F59E0B',
  ebayGreen: '#16A34A',

  // Typography
  textPrimary: '#2F3745',
  textSecondary: '#6B7280',
  textMuted: '#9AA2AE',
  textDisabled: '#C4CAD3',

  // Semantic status
  available: '#16A34A',
  reserved: '#F59E0B',
  sold: '#D93A3F',
  pending: '#1F4E89',

  // Pure
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};
