export const Colors = {
  light: {
    primary: "#8B593E",
    text: '#4A3428',
    textLight: '#9A8478',
    surface: '#F3E8D7',
    textMuted: "#64748b",
    background: '#FFF8F3',
    border: '#E5D3B7',
    white: '#FFFFFF',
    error: '#E74C3C',
    success: '#2ECC71',
  },
  dark: {
    primary: "#8B593E",
    text: '#4A3428',
    textLight: '#9A8478',
    surface: '#1C1C1E',
    textMuted: "#64748b",
    background: '#1C1C1E',
    border: '#3A3A3C',
    white: '#FFFFFF',
    error: '#E74C3C',
    success: '#2ECC71',
  },
};
// Theme color helper
export const getThemeColors = (mode = "light") => {
  return mode === "dark" ? Colors.dark : Colors.light;
};