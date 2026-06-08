#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "assets", "original-images");
const PUBLIC_IMAGES_DIR = path.join(ROOT, "public", "images");
const SOURCE_IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);
const GENERATED_EXT = ".webp";
const PRUNE_PUBLIC_ORIGINALS = process.argv.includes("--prune-public-originals");

const profiles = [
  {
    test: (rel) => rel.startsWith(`cards${path.sep}`),
    width: 768,
    quality: 72,
    effort: 5,
  },
  {
    test: (rel) => rel === "witch.png" || rel === "witch.jpg" || rel === "witch.jpeg",
    width: 640,
    quality: 76,
    effort: 5,
  },
  {
    test: () => true,
    width: 1024,
    quality: 74,
    effort: 5,
  },
];

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(target) {
  await fs.mkdir(target, { recursive: true });
}

async function copyDir(src, dest) {
  await ensureDir(dest);
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await ensureDir(path.dirname(destPath));
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function collectFiles(dir, base = dir) {
  const files = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(fullPath, base));
    } else if (entry.isFile()) {
      files.push({
        abs: fullPath,
        rel: path.relative(base, fullPath),
      });
    }
  }
  return files;
}

function profileFor(rel) {
  return profiles.find((profile) => profile.test(rel)) ?? profiles.at(-1);
}

function outputPathFor(rel) {
  const parsed = path.parse(rel);
  return path.join(PUBLIC_IMAGES_DIR, parsed.dir, `${parsed.name}${GENERATED_EXT}`);
}

function originalPublicPathFor(rel) {
  return path.join(PUBLIC_IMAGES_DIR, rel);
}

function humanBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function seedOriginalsIfNeeded() {
  if (await exists(SOURCE_DIR)) return false;
  if (!(await exists(PUBLIC_IMAGES_DIR))) {
    throw new Error(`Missing public images directory: ${PUBLIC_IMAGES_DIR}`);
  }
  await copyDir(PUBLIC_IMAGES_DIR, SOURCE_DIR);
  return true;
}

async function optimizeFile(file) {
  const ext = path.extname(file.rel).toLowerCase();
  if (!SOURCE_IMAGE_EXTENSIONS.has(ext)) return null;

  const profile = profileFor(file.rel);
  const outPath = outputPathFor(file.rel);
  const originalPublicPath = originalPublicPathFor(file.rel);
  await ensureDir(path.dirname(outPath));

  const inputStat = await fs.stat(file.abs);
  const transformer = sharp(file.abs).rotate();
  const meta = await transformer.metadata();
  const shouldResize = meta.width && meta.width > profile.width;
  const pipeline = shouldResize
    ? transformer.resize({ width: profile.width, withoutEnlargement: true })
    : transformer;

  await pipeline.webp({ quality: profile.quality, effort: profile.effort }).toFile(outPath);

  const outputStat = await fs.stat(outPath);

  if (PRUNE_PUBLIC_ORIGINALS && path.resolve(originalPublicPath) !== path.resolve(file.abs)) {
    await fs.rm(originalPublicPath, { force: true });
  }

  return {
    rel: file.rel,
    outRel: path.relative(ROOT, outPath),
    before: inputStat.size,
    after: outputStat.size,
  };
}

async function main() {
  const seeded = await seedOriginalsIfNeeded();
  const files = await collectFiles(SOURCE_DIR);
  const results = [];

  for (const file of files) {
    const result = await optimizeFile(file);
    if (result) results.push(result);
  }

  const before = results.reduce((sum, item) => sum + item.before, 0);
  const after = results.reduce((sum, item) => sum + item.after, 0);
  const saved = before - after;
  const report = {
    generatedAt: new Date().toISOString(),
    sourceDir: path.relative(ROOT, SOURCE_DIR),
    outputDir: path.relative(ROOT, PUBLIC_IMAGES_DIR),
    seededOriginals: seeded,
    prunedPublicOriginals: PRUNE_PUBLIC_ORIGINALS,
    fileCount: results.length,
    beforeBytes: before,
    afterBytes: after,
    savedBytes: saved,
    files: results,
  };

  const reportPath = path.join(ROOT, "assets", "optimized-assets-report.json");
  await ensureDir(path.dirname(reportPath));
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log(`Optimized ${results.length} images`);
  console.log(`Before: ${humanBytes(before)}`);
  console.log(`After:  ${humanBytes(after)}`);
  console.log(`Saved:  ${humanBytes(saved)} (${((saved / before) * 100).toFixed(1)}%)`);
  console.log(`Report: ${path.relative(ROOT, reportPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
