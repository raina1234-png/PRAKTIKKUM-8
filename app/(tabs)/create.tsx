import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { addDiary } from "../../src/features/diary/diarySlice";
import { useAppDispatch } from "../../src/store/hooks";
import { COLORS, RADIUS, SPACE, TYPO } from "../../src/styles/tokens";

const MOODS = ["😊", "📚", "☕", "🌙", "✨"];

export default function CreateScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("😊");
  const [body, setBody] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = () => {
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

    const today = new Date().toISOString().slice(0, 10);
    const preview =
      cleanBody.length > 60 ? `${cleanBody.slice(0, 60)}...` : cleanBody;

    dispatch(
      addDiary({
        title: cleanTitle,
        date: today,
        preview,
        body: cleanBody,
        mood,
      })
    );

    setTitle("");
    setMood("😊");
    setBody("");
    router.push("/(tabs)" as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tambah Diary</Text>

      <Text style={styles.label}>Judul</Text>
      <TextInput
        style={styles.input}
        placeholder="Tulis judul diary (minimal 3 karakter)..."
        placeholderTextColor={COLORS.muted}
        value={title}
        onChangeText={(value) => {
          setTitle(value);
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
        onChangeText={(value) => {
          setBody(value);
          if (errorMsg) setErrorMsg("");
        }}
        multiline
      />

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Simpan Diary</Text>
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
    fontWeight: "600",
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