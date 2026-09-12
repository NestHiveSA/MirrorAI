import { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import type { AnalysisInputType, AnalysisRequest, AnalysisResult } from "@mirrorai/shared";
import { runAnalysis } from "./src/api";

const inputTypeLabels: Record<AnalysisInputType, string> = {
  "INPUT-TEXT": "نص",
  "INPUT-URL": "رابط",
  "INPUT-MIXED": "نص ورابط"
};

const supportedInputs = Object.keys(inputTypeLabels) as AnalysisInputType[];

function buildRequest(inputType: AnalysisInputType, content: string, url: string): AnalysisRequest {
  if (inputType === "INPUT-URL") {
    return { input_type: inputType, url };
  }

  if (inputType === "INPUT-MIXED") {
    return { input_type: inputType, content, url };
  }

  return { input_type: inputType, content };
}

export default function App() {
  const [inputType, setInputType] = useState<AnalysisInputType>("INPUT-TEXT");
  const [content, setContent] = useState(
    "عاجل: نحن من البنك. أرسل رمز التحقق الآن لتجنب إيقاف الحساب"
  );
  const [url, setUrl] = useState("https://example.com");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const request = useMemo(() => buildRequest(inputType, content, url), [inputType, content, url]);

  async function handleAnalyze() {
    setIsLoading(true);
    setErrorMessage(null);
    setResult(null);

    const outcome = await runAnalysis(request);

    if (outcome.ok) {
      setResult(outcome.result);
    } else {
      setErrorMessage(outcome.message);
    }

    setIsLoading(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.eyebrow}>MirrorAI</Text>
      <Text style={styles.title}>رفيقك للوعي الرقمي</Text>
      <Text style={styles.subtitle}>انظر بوضوح. قرّر بوعي.</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>نوع الإدخال</Text>
        <View style={styles.segmentRow}>
          {supportedInputs.map((option) => {
            const isActive = option === inputType;

            return (
              <Pressable
                key={option}
                onPress={() => setInputType(option)}
                style={[styles.segmentButton, isActive && styles.segmentButtonActive]}
              >
                <Text style={[styles.segmentLabel, isActive && styles.segmentLabelActive]}>
                  {inputTypeLabels[option]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {(inputType === "INPUT-TEXT" || inputType === "INPUT-MIXED") && (
          <View style={styles.field}>
            <Text style={styles.label}>المحتوى</Text>
            <TextInput
              style={styles.textArea}
              value={content}
              onChangeText={setContent}
              placeholder="اكتب أو الصق الرسالة هنا"
              multiline
              numberOfLines={5}
              textAlign="right"
            />
          </View>
        )}

        {(inputType === "INPUT-URL" || inputType === "INPUT-MIXED") && (
          <View style={styles.field}>
            <Text style={styles.label}>الرابط</Text>
            <TextInput
              style={styles.input}
              value={url}
              onChangeText={setUrl}
              placeholder="https://example.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              textAlign="right"
            />
          </View>
        )}

        <Pressable
          style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
          onPress={handleAnalyze}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.primaryButtonLabel}>تحليل الآن</Text>
          )}
        </Pressable>
      </View>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {result ? (
        <View style={styles.card}>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>المستوى: {result.risk_level ?? "-"}</Text>
            <Text style={styles.metaItem}>الثقة: {result.confidence}</Text>
            <Text style={styles.metaItem}>الدرجة: {result.risk_score ?? "-"}</Text>
          </View>

          <Text style={styles.sectionTitle}>الملخص</Text>
          <Text style={styles.bodyText}>{result.summary}</Text>

          <Text style={styles.sectionTitle}>التفسير</Text>
          <Text style={styles.bodyText}>{result.explanation}</Text>

          <Text style={styles.sectionTitle}>الأدلة</Text>
          {result.evidence.map((item) => (
            <Text key={item} style={styles.listItem}>
              • {item}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>الإجراءات الموصى بها</Text>
          {result.recommended_actions.map((action) => (
            <Text key={`${action.level}-${action.title}`} style={styles.listItem}>
              • [{action.level}] {action.title}: {action.description}
            </Text>
          ))}

          {result.limitations.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>محدودية النتيجة</Text>
              {result.limitations.map((limitation) => (
                <Text key={limitation} style={styles.listItem}>
                  • {limitation}
                </Text>
              ))}
            </>
          )}
        </View>
      ) : (
        !errorMessage && (
          <Text style={styles.emptyState}>اكتب إدخالًا ثم اضغط على تحليل الآن.</Text>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f6f7fb",
    padding: 20,
    paddingTop: 60,
    gap: 16
  },
  eyebrow: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 13,
    letterSpacing: 1
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "#111827"
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 8
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  sectionTitle: {
    textAlign: "right",
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 6
  },
  segmentRow: {
    flexDirection: "row-reverse",
    gap: 8
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f0f1f5",
    alignItems: "center"
  },
  segmentButtonActive: {
    backgroundColor: "#111827"
  },
  segmentLabel: {
    color: "#374151",
    fontSize: 13
  },
  segmentLabelActive: {
    color: "#ffffff",
    fontWeight: "600"
  },
  field: {
    gap: 6
  },
  label: {
    textAlign: "right",
    fontSize: 13,
    color: "#374151"
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    writingDirection: "rtl"
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 110,
    textAlignVertical: "top",
    writingDirection: "rtl"
  },
  primaryButton: {
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4
  },
  primaryButtonDisabled: {
    opacity: 0.6
  },
  primaryButtonLabel: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700"
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12
  },
  errorText: {
    color: "#b91c1c",
    textAlign: "right"
  },
  metaRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 4
  },
  metaItem: {
    fontSize: 12,
    color: "#374151",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  bodyText: {
    textAlign: "right",
    fontSize: 14,
    color: "#1f2937",
    lineHeight: 20
  },
  listItem: {
    textAlign: "right",
    fontSize: 13,
    color: "#1f2937",
    lineHeight: 19
  },
  emptyState: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 13,
    marginTop: 8
  }
});
