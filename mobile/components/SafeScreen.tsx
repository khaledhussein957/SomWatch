import { View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getThemeColors } from "../constants/Colors";

const SafeScreen = ({ children } : any) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme(); // 'light' or 'dark'
  const COLORS = getThemeColors(colorScheme === "dark" ? "dark" : "light");

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: COLORS.background,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;
