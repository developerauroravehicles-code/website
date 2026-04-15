import fs from "node:fs";
import path from "node:path";

/** PNG as data URL — avoids fetch/path issues with `cursor: url()` in dev/prod. */
export function getSiteCursorCssValue(): string {
  try {
    const file = path.join(process.cwd(), "public", "cursors", "cursor.png");
    const buf = fs.readFileSync(file);
    return `url("data:image/png;base64,${buf.toString("base64")}") 2 2, auto`;
  } catch {
    return "auto";
  }
}
