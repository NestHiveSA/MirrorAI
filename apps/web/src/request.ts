export function buildRequestBody(content: string, url: string) {
  const trimmedUrl = url.trim();

  return trimmedUrl
    ? { input_type: "INPUT-MIXED" as const, content: content.trim(), url: trimmedUrl }
    : { input_type: "INPUT-TEXT" as const, content: content.trim() };
}
