import { StyleSheet } from "react-native";
import { colors, theme } from "../../global/styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.grey100,
  },
  flatListContainer: {
    flex: 1,
    padding: 20,
  },
  elementsContainer: {
    flex: 1,
    padding: 20,
  },
  pickerContainer: {
    width: "50%",

    textAlign: "center",
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "space-between",

    backgroundColor: theme.colors.red,
  },
  pickerText: {
    marginTop: 20,
  },
  checkboxContainer: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  checkboxText: {
    color: theme.colors.black,
  },
});
