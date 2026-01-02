import { Question, Attempt } from "@prisma/client";

type SelectorOptions = {
  mode: "all" | "tags";
  tags?: string[];
  count: number;
  recentQuestionIds?: string[];
  attemptsByTag?: Record<string, { correct: number; total: number }>;
};

const scoreQuestion = (question: Question, attemptsByTag: SelectorOptions["attemptsByTag"]) => {
  if (!attemptsByTag) {
    return 0;
  }
  const tags = (question.tags as string[]) || [];
  return tags.reduce((score, tag) => {
    const stats = attemptsByTag[tag];
    if (!stats || stats.total === 0) {
      return score + 0.5;
    }
    const accuracy = stats.correct / stats.total;
    return score + (1 - accuracy);
  }, 0);
};

export const selectQuestions = (
  questions: Question[],
  attempts: Attempt[],
  options: SelectorOptions
) => {
  const { mode, tags = [], count, recentQuestionIds = [] } = options;

  const filtered = questions.filter((question) => {
    if (mode === "tags") {
      const questionTags = (question.tags as string[]) || [];
      return tags.length === 0 || questionTags.some((tag) => tags.includes(tag));
    }
    return true;
  });

  const attemptsByTag: SelectorOptions["attemptsByTag"] = {};
  attempts.forEach((attempt) => {
    const question = questions.find((q) => q.id === attempt.questionId);
    if (!question) return;
    const questionTags = (question.tags as string[]) || [];
    questionTags.forEach((tag) => {
      const stats = attemptsByTag[tag] ?? { correct: 0, total: 0 };
      stats.total += 1;
      if (attempt.isCorrect) {
        stats.correct += 1;
      }
      attemptsByTag[tag] = stats;
    });
  });

  const prioritized = filtered
    .filter((question) => !recentQuestionIds.includes(question.id))
    .map((question) => ({
      question,
      score: scoreQuestion(question, attemptsByTag)
    }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.question);

  return prioritized.slice(0, count);
};
