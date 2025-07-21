import { StyleSheet } from "react-native";

const exploreStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 12,
    padding: 10,
    elevation: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  meta: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  recommend: {
    marginTop: 24,
    fontSize: 16,
    color: "#007AFF",
    textAlign: "center",
  },
});

export default exploreStyles;
