import fs from "node:fs";
import path from "node:path";

const nextDir = path.join(process.cwd(), ".next");
try {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log("[clean] Removed .next");
} catch (e) {
  if (e && typeof e === "object" && "code" in e && e.code !== "ENOENT") throw e;
}
