import { PrismaClient } from "@prisma/client";
import seedData from "../data/seed_questions.json";

const prisma = new PrismaClient();

type SeedQuestion = {
  type: string;
  stem: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  tags: string[];
  difficulty: number;
  trapCode?: string;
};

async function main() {
  const questions = seedData as SeedQuestion[];
  for (const question of questions) {
    await prisma.question.create({
      data: {
        type: question.type,
        stem: question.stem,
        choices: question.choices,
        answerIndex: question.answerIndex,
        explanation: question.explanation,
        tags: question.tags,
        difficulty: question.difficulty,
        trapCode: question.trapCode ?? null
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
