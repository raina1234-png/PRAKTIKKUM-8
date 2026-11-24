import { useRouter } from "expo-router";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import DiaryCard from "../../src/components/DiaryCard";
import {
    clearAllFavorites,
    toggleFavorite,
} from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";
import { COLORS, RADIUS, SPACE, TYPO } from "../../src/styles/tokens";

export default function FavoritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const entries = useAppSelector((state) => state.diary.entries);
  const favorites = entries.filter((item) => item.liked);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.header}>Favorite</Text>
          <Text style={styles.counter}>{favorites.length} diary favorit</Text>
        </View>
        {favorites.length > 0 && (
          <Pressable
            style={styles.clearButton}
            onPress={() => dispatch(clearAllFavorites())}
          >
            <Text style={styles.clearButtonText}>Hapus Semua Favorit</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Belum ada diary favorit</Text>
            <Text style={styles.emptyDesc}>
              Tekan ikon hati pada kartu diary di halaman Home untuk menandai favorit.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <DiaryCard
            title={item.title}
            date={item.date}
            preview={item.preview}
            mood={item.mood}
            liked={item.liked}
            onToggleFavorite={() => dispatch(toggleFavorite(item.id))}
            onPress={() =>
              router.push({
                pathname: "/detail/[id]" as never,
                params: { id: String(item.id) },
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: SPACE.l,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACE.m,
    gap: SPACE.s,
  },
  header: {
    fontSize: TYPO.h1,
    fontWeight: "700",
    color: COLORS.text,
  },
  counter: {
    color: COLORS.muted,
    fontSize: TYPO.caption,
  },
  clearButton: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: COLORS.danger,
    paddingVertical: SPACE.s,
    paddingHorizontal: SPACE.m,
    borderRadius: RADIUS.card,
  },
  clearButtonText: {
    color: COLORS.danger,
    fontSize: TYPO.caption,
    fontWeight: "700",
  },
  list: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    gap: SPACE.m,
    paddingBottom: SPACE.l,
  },
  emptyBox: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.xl,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: TYPO.title,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACE.s,
  },
  emptyDesc: {
    fontSize: TYPO.body,
    color: COLORS.muted,
    textAlign: "center",
  },
});