import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");

export async function readJsonArray<T>(fileName: string): Promise<T[]> {
  await mkdir(dataDir, { recursive: true });
  const filePath = path.join(dataDir, fileName);
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as T[];
  } catch {
    await writeFile(filePath, "[]", "utf8");
    return [];
  }
}

export async function writeJsonArray<T>(fileName: string, rows: T[]) {
  await mkdir(dataDir, { recursive: true });
  const filePath = path.join(dataDir, fileName);
  const tmpPath = `${filePath}.tmp`;
  await writeFile(tmpPath, JSON.stringify(rows, null, 2), "utf8");
  await rename(tmpPath, filePath);
}
