import { View, Text, TouchableOpacity, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { profileStyles } from "../assets/styles/profile.style";
import { getThemeColors } from "../constants/Colors";

type GuestProfileProps = {
  theme: string;                // resolved theme for colors
  rawTheme: string;             // raw theme for button highlighting
  handleThemeChange: (theme: string) => void;
};

const GuestProfile = ({ theme, rawTheme, handleThemeChange }: GuestProfileProps) => {
  const COLORS = getThemeColors(theme);
  const router = useRouter();

  return (
    <View
      style={[profileStyles.container, { backgroundColor: COLORS.background }]}
    >
      {/* Profile Header */}
      <View style={profileStyles.header}>
        <Ionicons
          name="person-circle-outline"
          size={100}
          color={COLORS.primary}
        />
        <Text style={[profileStyles.name, { color: COLORS.text }]}>Guest</Text>
        <Text style={[profileStyles.email, { color: COLORS.textLight }]}>
          Welcome to SomWatch
        </Text>
      </View>

      {/* Appearance Section */}
      <View style={profileStyles.section}>
        <Text style={[profileStyles.sectionTitle, { color: COLORS.text }]}>
          Appearance
        </Text>
        <View style={[profileStyles.row, { justifyContent: "space-between" }]}>
          <Text style={[profileStyles.rowLabel, { color: COLORS.text }]}>
            Theme
          </Text>
          <ThemeButtons
            theme={rawTheme}            // use rawTheme for button highlighting
            handleThemeChange={handleThemeChange}
            COLORS={COLORS}
          />
        </View>
      </View>

      {/* Settings Section */}
      <View style={profileStyles.section}>
        <Text style={[profileStyles.sectionTitle, { color: COLORS.text }]}>
          Settings
        </Text>
        <TouchableOpacity style={profileStyles.row}>
          <Text style={[profileStyles.rowLabel, { color: COLORS.text }]}>
            Language
          </Text>
          <Text style={[profileStyles.rowValue, { color: COLORS.textLight }]}>
            English
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={profileStyles.row}>
          <Text style={[profileStyles.rowLabel, { color: COLORS.text }]}>
            Help
          </Text>
        </TouchableOpacity>

        {/* Join Now Button */}
        <View style={{ marginTop: 16 }}>
          <Button
            title="Join Now"
            onPress={() => router.replace("/login")}
            color={COLORS.primary}
          />
        </View>
      </View>
    </View>
  );
};

// Theme selection buttons
type ThemeButtonsProps = {
  theme: string;
  handleThemeChange: (theme: string) => void;
  COLORS: { [key: string]: string };
};

const ThemeButtons = ({
  theme,
  handleThemeChange,
  COLORS,
}: ThemeButtonsProps) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    {["system", "light", "dark"].map((mode) => (
      <TouchableOpacity
        key={mode}
        style={{
          marginHorizontal: 4,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 6,
          backgroundColor: theme === mode ? COLORS.primary : COLORS.surface,
        }}
        onPress={() => handleThemeChange(mode)}
      >
        <Text style={{ color: theme === mode ? COLORS.white : COLORS.text }}>
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default GuestProfile;
