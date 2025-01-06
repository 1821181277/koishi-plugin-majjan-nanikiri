import path from "path";
import fs from "node:fs/promises";

export interface INanikiri {
  picBuffer: Buffer;
  nanikiriNo: number;
  desc: string;
}
let nanikiriCnt = 300;
let cachedQuestionData: Map<number, INanikiri> | null = null;
let cachedAnswerData: Map<number, INanikiri> | null = null;
export async function getNanikiriQData(): Promise<Map<number, INanikiri>> {
  if (cachedQuestionData) return cachedQuestionData;
  const arr = [...Array(nanikiriCnt)].map((_, i) => i + 1);
  const nanikiriData = await Promise.all(
    arr.map(async (key) => ({
      picBuffer: await fs.readFile(
        path.join(__dirname, "/assets/", key + "_Q.png")
      ),
      nanikiriNo: key,
      desc: "",
    }))
  );
  cachedQuestionData = new Map<number, INanikiri>();
  nanikiriData.forEach((item) => {
    cachedQuestionData.set(item.nanikiriNo, item);
  });
  return cachedQuestionData;
}

export async function getNanikiriAData(): Promise<Map<number, INanikiri>> {
  if (cachedAnswerData) return cachedAnswerData;
  const arr = [...Array(nanikiriCnt)].map((_, i) => i + 1);
  const nanikiriData = await Promise.all(
    arr.map(async (key) => ({
      picBuffer: await fs.readFile(
        path.join(__dirname, "/assets/", key + "_A.png")
      ),
      nanikiriNo: key,
      desc: "",
    }))
  );
  cachedAnswerData = new Map<number, INanikiri>();
  nanikiriData.forEach((item) => {
    cachedAnswerData.set(item.nanikiriNo, item);
  });
  return cachedAnswerData;
}

export function getRandomInt(n: number): number {
  return Math.floor(Math.random() * n) + 1;
}
