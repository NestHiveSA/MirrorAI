export function shouldShowPositiveSignalsSection(signalCount: number): boolean {
  return signalCount > 0;
}

export function shouldShowExtractedAdviceSection(adviceCount: number): boolean {
  return adviceCount > 0;
}
