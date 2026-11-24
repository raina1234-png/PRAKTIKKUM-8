import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DiaryCard from "../../src/components/DiaryCard";
import {
  selectTotalDiary,
  selectTotalFavorite,
  toggleFavorite,
} from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";
import { COLORS, RADIUS, SPACE, TYPO } from "../../src/styles/tokens";

const MOOD_FILTERS = ["ALL", "😊", "📚", "☕", "🌙", "✨"] as const;

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const entries = useAppSelector((state) => state.diary.entries);
  const totalDiary = useAppSelector(selectTotalDiary);
  const totalFavorite = useAppSelector(selectTotalFavorite);

  const [selectedMood, setSelectedMood] = useState<string>("ALL");

  const filteredEntries =
    selectedMood === "ALL"
      ? entries
      : entries.filter((item) => item.mood === selectedMood);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Buku Harian</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{totalDiary}</Text>
          <Text style={styles.statLabel}>Total Diary</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{totalFavorite}</Text>
          <Text style={styles.statLabel}>Total Favorite</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {MOOD_FILTERS.map((moodItem) => {
          const active = selectedMood === moodItem;
          return (
            <Pressable
              key={moodItem}
              onPress={() => setSelectedMood(moodItem)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {moodItem === "ALL" ? "Semua Mood" : moodItem}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => String(item.id)}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Belum ada diary yang tampil</Text>
            <Text style={styles.emptyDesc}>
              {selectedMood === "ALL"
                ? "Mulai tulis catatan pertamamu di tab Tambah."
                : `Tidak ada diary dengan mood ${selectedMood}. Coba pilih mood lain.`}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
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
            <Pressable
              style={styles.editLink}
              onPress={() =>
                router.push({
                  pathname: "/edit/[id]" as never,
                  params: { id: String(item.id) },
                })
              }
            >
              <Text style={styles.editLinkText}>Edit Diary</Text>
            </Pressable>
          </View>
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
  header: {
    fontSize: TYPO.h1,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACE.m,
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACE.m,
    marginBottom: SPACE.m,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.m,
  },
  statValue: {
    fontSize: TYPO.h1,
    fontWeight: "700",
    color: COLORS.accent,
  },
  statLabel: {
    fontSize: TYPO.caption,
    color: COLORS.muted,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACE.s,
    marginBottom: SPACE.m,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: SPACE.m,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  filterChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  filterText: {
    fontSize: TYPO.caption,
    fontWeight: "600",
    color: COLORS.text,
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  list: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    gap: SPACE.m,
    paddingBottom: SPACE.l,
  },
  cardWrapper: {
    width: "100%",
  },
  editLink: {
    alignSelf: "flex-end",
    marginTop: -SPACE.s,
    marginBottom: SPACE.s,
    paddingHorizontal: SPACE.s,
  },
  editLinkText: {
    fontSize: TYPO.caption,
    fontWeight: "600",
    color: COLORS.accent,
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