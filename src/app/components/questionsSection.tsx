import { fetchDegrees } from '@/app/lib/data';
import QuestionsStructure from './questionStructure';

export default async function QuestionsSection() {
  const degrees = await fetchDegrees();

  return <QuestionsStructure degrees={degrees} />;
}
