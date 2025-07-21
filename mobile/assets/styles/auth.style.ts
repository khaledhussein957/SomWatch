import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
  },
  keyboardView: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  formGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  errorText: {
    fontSize: 13,
    marginBottom: 4,
    marginLeft: 4,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  orText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: "#DB4437",
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  googleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 14,
  },
  // rounded
  closeButton: {
    borderRadius: 999,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
