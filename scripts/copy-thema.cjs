const fs = require("fs");
const path = require("path");
const os = require("os");

const root = path.join(__dirname, "..");
const destDir = path.join(root, "public", "audio");
const dest = path.join(destDir, "thema.mp3");
const src = path.join(os.homedir(), "Downloads", "thema.mp3");

if (!fs.existsSync(src)) {
  console.error("Kaynak bulunamadı:", src);
  process.exit(1);
}
fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log("Kopyalandı:", dest);
