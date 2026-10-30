export const SCORE_CONCEPTS = [
  { key: 'tps', label: 'TPs', points: 6 },
  { key: 'midterms', label: 'Parciales', points: 5 },
  { key: 'responses', label: 'Respuestas', points: 3 },
  { key: 'comments', label: 'Comentarios', points: 1 },
  { key: 'links', label: 'Links', points: 1 },
  { key: 'reactions', label: 'Reacciones', points: 1 },
  { key: 'likes', label: 'Likes recibidas', points: 3 },
] as const;

export type ScoreConceptKey = (typeof SCORE_CONCEPTS)[number]['key'];

export type ScoreCounts = Record<ScoreConceptKey, number>;

export type ScoreBreakdownRow = {
  key: ScoreConceptKey;
  label: string;
  quantity: number;
  unitPoints: number;
  points: number;
};

export const buildScoreBreakdown = (counts: ScoreCounts): ScoreBreakdownRow[] =>
  SCORE_CONCEPTS.map((concept) => ({
    key: concept.key,
    label: concept.label,
    quantity: counts[concept.key],
    unitPoints: concept.points,
    points: counts[concept.key] * concept.points,
  }));

export const computeScore = (counts: ScoreCounts): number =>
  SCORE_CONCEPTS.reduce((total, concept) => total + counts[concept.key] * concept.points, 0);
