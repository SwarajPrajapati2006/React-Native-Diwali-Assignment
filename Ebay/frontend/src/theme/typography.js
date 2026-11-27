// Buy & Sell — Typography system
// Exactly two fonts:
//   Montserrat — headings, buttons, prices   (SemiBold 600 / Bold 700 / Medium 500)
//   Inter      — body copy, descriptions, chat, forms (Regular 400 / Medium 500)
//
// React Native does NOT inherit fonts like CSS, so every text style must set
// `fontFamily` explicitly. Use the matching family name and do NOT also set
// `fontWeight` (the weight is baked into the font file).
export const fonts = {
  heading: 'Montserrat_600SemiBold', // section headings / buttons
  headingBold: 'Montserrat_700Bold', // prices / strong CTAs
  headingMedium: 'Montserrat_500Medium', // listing titles
  body: 'Inter_400Regular', // body text, captions, chat, forms
  bodyMedium: 'Inter_500Medium', // emphasised body text
};

// Suggested mobile sizes
export const fontSizes = {
  appBar: 20, // app bar / screen title (SemiBold)
  section: 18, // section heading (SemiBold)
  price: 17, // price on cards (Bold)
  listingTitle: 15, // listing title (Medium)
  body: 15, // body text (Regular, >=14 for outdoor readability)
  caption: 12, // captions / location / time (Regular)
};
