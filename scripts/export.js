import fs from "node:fs";
import path from "node:path";
import archiver from "archiver";

const rootDir = process.cwd();
const exportDir = path.join(rootDir, "export-temp");
const zipName = "DigitallyDefined-OS-v1.5.zip";
const zipPath = path.join(rootDir, zipName);

const itemsToCopy = [
  "src",
  "public",
  "index.html",
  "package.json",
  "package-lock.json",
  "vite.config.js",
  ".env.example",
  "README.md",
];

const ensureCleanDir = (targetPath) => {
  fs.rmSync(targetPath, { recursive: true, force: true });
  fs.mkdirSync(targetPath, { recursive: true });
};

const copyItem = (relativePath) => {
  const sourcePath = path.join(rootDir, relativePath);
  if (!fs.existsSync(sourcePath)) {
    return;
  }

  const destinationPath = path.join(exportDir, relativePath);
  const stats = fs.statSync(sourcePath);

  if (stats.isDirectory()) {
    fs.cpSync(sourcePath, destinationPath, { recursive: true });
    return;
  }

  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
};

const createZip = () =>
  new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", resolve);
    output.on("error", reject);
    archive.on("error", reject);

    archive.pipe(output);
    archive.directory(exportDir, false);
    archive.finalize();
  });

const main = async () => {
  ensureCleanDir(exportDir);
  fs.rmSync(zipPath, { force: true });

  itemsToCopy.forEach(copyItem);

  await createZip();
  fs.rmSync(exportDir, { recursive: true, force: true });

  console.log(`✅ Export complete: ${zipName}`);
};

main().catch((error) => {
  fs.rmSync(exportDir, { recursive: true, force: true });
  console.error("Export failed.", error);
  process.exitCode = 1;
});
