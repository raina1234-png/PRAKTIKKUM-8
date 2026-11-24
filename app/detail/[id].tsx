import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { editDiary } from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";
import { COLORS, RADIUS, SPACE, TYPO } from "../../src/styles/tokens";

const MOODS = ["😊", "📚", "☕", "🌙", "✨"];

export default function EditDiaryScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);

  const entry = useAppSelector((state) =>
    state.diary.entries.find((item) => item.id === numericId)
  );

  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("😊");
  const [body, setBody] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setMood(entry.mood);
      setBody(entry.body);
    }
  }, [entry]);

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Diary tidak ditemukan</Text>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  const handleUpdate = () => {
    const cleanTitle = title.trim();
    const cleanBody = body.trim();

    if (cleanTitle.length < 3) {
      setErrorMsg("Judul minimal 3 karakter.");
      return;
    }
    if (!cleanBody) {
      setErrorMsg("Isi cerita tidak boleh kosong.");
      return;
    }

    setErrorMsg("");
    dispatch(
      editDiary({
        id: entry.id,
        title: cleanTitle,
        body: cleanBody,
        mood,
      })
    );

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Diary</Text>

      <Text style={styles.label}>Judul</Text>
      <TextInput
        style={styles.input}
        placeholder="Minimal 3 karakter..."
        placeholderTextColor={COLORS.muted}
        value={title}
        onChangeText={(val) => {
          setTitle(val);
          if (errorMsg) setErrorMsg("");
        }}
      />

      <Text style={styles.label}>Mood</Text>
      <View style={styles.moodRow}>
        {MOODS.map((item) => (
          <Pressable
            key={item}
            onPress={() => setMood(item)}
            style={[styles.moodChip, mood === item && styles.moodChipActive]}
          >
            <Text style={styles.moodText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Isi Cerita</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ceritakan harimu..."
        placeholderTextColor={COLORS.muted}
        value={body}
        onChangeText={(val) => {
          setBody(val);
          if (errorMsg) setErrorMsg("");
        }}
        multiline
      />

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <Pressable style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Simpan Perubahan</Text>
      </Pressable>
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
    marginBottom: SPACE.l,
  },
  label: {
    fontSize: TYPO.body,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACE.s,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.m,
    fontSize: TYPO.body,
    color: COLORS.text,
    marginBottom: SPACE.m,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  moodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACE.s,
    marginBottom: SPACE.m,
  },
  moodChip: {
    paddingVertical: SPACE.s,
    paddingHorizontal: SPACE.m,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  moodChipActive: {
    borderColor: COLORS.accent,
    backgroundColor: "#EFF6FF",
  },
  moodText: {
    fontSize: 20,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: TYPO.caption,
    marginBottom: SPACE.m,
  },
  button: {
    backgroundColor: COLORS.accent,
    padding: SPACE.m,
    borderRadius: RADIUS.card,
    alignItems: "center",
    marginTop: SPACE.s,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: TYPO.title,
    fontWeight: "700",
  },
});