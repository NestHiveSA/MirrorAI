export type ScoreBand = 'low' | 'caution' | 'medium' | 'high';

export function scoreBandFor(score: number): ScoreBand {
  if (score >= 75) return 'high';
  if (score >= 50) return 'medium';
  if (score >= 25) return 'caution';
  return 'low';
}

export function scoreBandLabel(band: ScoreBand): string {
  if (band === 'high') return 'مرتفع';
  if (band === 'medium') return 'متوسط';
  if (band === 'caution') return 'يستدعي الانتباه';
  return 'منخفض';
}

export function scoreBandClassName(band: ScoreBand): string {
  if (band === 'high') return 'risk-band-high';
  if (band === 'medium') return 'risk-band-medium';
  if (band === 'caution') return 'risk-band-caution';
  return 'risk-band-low';
}
