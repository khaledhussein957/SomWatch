import { View, Text, TouchableOpacity, Image } from "react-native";
import { profileStyles } from "../assets/styles/profile.style";
import { getThemeColors } from "../constants/Colors";

type User = {
  avatar?: string;
  name?: string;
  email?: string;
};

type UserProfileProps = {
  user: User;
  theme: string;
  rawTheme: string;
  handleThemeChange: (theme: string) => void;
  handleLogout: () => void;
  subscription: string;
};

const UserProfile = ({
  user,
  theme,
  rawTheme,
  handleThemeChange,
  handleLogout,
  subscription,
}: UserProfileProps) => {
  const COLORS = getThemeColors(theme);

  return (
    <View
      style={[profileStyles.container, { backgroundColor: COLORS.background }]}
    >
      <View style={profileStyles.header}>
        <Image
          source={
            user?.avatar
              ? { uri: user.avatar }
              : require("../assets/images/icon.png")
          }
          style={profileStyles.avatar}
        />
        <Text style={[profileStyles.name, { color: COLORS.text }]}>
          {user?.name || "User"}
        </Text>
        <Text style={[profileStyles.email, { color: COLORS.textLight }]}>
          {user?.email}
        </Text>
      </View>

      <View style={profileStyles.section}>
        <Text style={[profileStyles.sectionTitle, { color: COLORS.text }]}>
          Appearance
        </Text>
        <View style={[profileStyles.row, { justifyContent: "space-between" }]}>
          <Text style={[profileStyles.rowLabel, { color: COLORS.text }]}>
            Theme
          </Text>
          <ThemeButtons
            theme={rawTheme}         // use rawTheme for button highlighting
            handleThemeChange={handleThemeChange}
            COLORS={COLORS}
          />
        </View>
      </View>

      <View style={profileStyles.section}>
        <Text style={[profileStyles.sectionTitle, { color: COLORS.text }]}>
          Subscription
        </Text>
        <View style={profileStyles.row}>
          <Text style={[profileStyles.rowLabel, { color: COLORS.text }]}>
            Status
          </Text>
          <Text style={[profileStyles.rowValue, { color: COLORS.textLight }]}>
            {subscription}
          </Text>
        </View>
      </View>

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
        <TouchableOpacity style={profileStyles.row} onPress={handleLogout}>
          <Text style={[profileStyles.rowLabel, { color: COLORS.error }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

type ThemeButtonsProps = {
  theme: string;
  handleThemeChange: (theme: string) => void;
  COLORS: { [key: string]: string };
};

const ThemeButtons: React.FC<ThemeButtonsProps> = ({ theme, handleThemeChange, COLORS }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    {["system", "light", "dark"].map((mode) => (
      <TouchableOpacity
        key={mode}
        style={{
          marginHorizontal: 4,
          padding: 6,
          borderRadius: 6,
          backgroundColor: theme === mode ? COLORS.primary : COLORS.surface,
        }}
        onPress={() => handleThemeChange(mode)}
      >
        <Text style={{ color: theme === mode ? COLORS.white : COLORS.text }}>
          {mode[0].toUpperCase() + mode.slice(1)}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default UserProfile;
