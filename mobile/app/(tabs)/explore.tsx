import {
  View,
  Text,
  useColorScheme,
} from "react-native";
import React from "react";
import exploreStyles from "../../assets/styles/explore.style";
import { getThemeColors } from "@/constants/Colors";
import SafeScreen from "@/components/SafeScreen";

// Dummy data for demonstration

const ExploreScreen = () => {
  const colorScheme = useColorScheme();
  const COLORS = getThemeColors(colorScheme === "dark" ? "dark" : "light");

  // In a real app, fetch personalized recommendations and trending data here
  return (
    <SafeScreen>
      <View style={[exploreStyles.container, { backgroundColor: COLORS.background }]}> 
        <Text style={[exploreStyles.header, { color: COLORS.text }]}>Discover Trending</Text>
        <Text style={[exploreStyles.subHeader, { color: COLORS.textLight }]}>Popular by region or topic</Text>
        {/* <FlatList
          data={trendingVideos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={[exploreStyles.card, { backgroundColor: COLORS.surface }]}> 
              <Image source={item.thumbnail} style={exploreStyles.thumbnail} />
              <View style={exploreStyles.info}>
                <Text style={[exploreStyles.title, { color: COLORS.text }]}>{item.title}</Text>
                <Text style={[exploreStyles.meta, { color: COLORS.textLight }]}>{item.region} • {item.topic}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        /> */}
        <Text style={[exploreStyles.recommend, { color: COLORS.primary }]}>Personalized recommendations coming soon!</Text>
      </View>
    </SafeScreen>
  );
};

export default ExploreScreen;
