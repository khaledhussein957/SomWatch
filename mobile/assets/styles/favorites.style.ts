import { StyleSheet } from "react-native";

export const favoritesStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    fontSize: 15,
    color: '#888',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    marginTop: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 8,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionBtn: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  actionText: {
    fontSize: 13,
    color: '#8B593E',
    fontWeight: '600',
  },
  reorderIcon: {
    marginLeft: 8,
    color: '#aaa',
  },
});
