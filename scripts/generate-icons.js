#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

/**
 * Icon Generator Script
 *
 * This script fetches an icon from a URL (defined in settings.md)
 * and generates all required PWA icons using the sharp library.
 */

async function fetchImageFromUrl(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(outputPath);

    protocol
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          // Handle redirects
          return fetchImageFromUrl(response.headers.location, outputPath)
            .then(resolve)
            .catch(reject);
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to fetch image: ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(outputPath, () => {});
        reject(err);
      });
  });
}

function getIconUrlFromSettings() {
  const settingsPath = path.join(__dirname, "..", "content", "settings.md");

  if (!fs.existsSync(settingsPath)) {
    console.log("⚠️  settings.md not found, skipping icon generation");
    return null;
  }

  const content = fs.readFileSync(settingsPath, "utf-8");

  // Extract iconUrl from frontmatter
  const match = content.match(/iconUrl:\s*["']?([^"'\n]+)["']?/);

  if (!match || !match[1] || match[1].trim() === "") {
    console.log("⚠️  No iconUrl set in settings.md, skipping icon generation");
    return null;
  }

  return match[1].trim();
}

async function prepareSourceImage(iconPathOrUrl, outputPath) {
  // The generator now requires a local filesystem path only.
  // Reject HTTP/HTTPS URLs explicitly to avoid network dependency during builds.
  if (/^https?:\/\//i.test(iconPathOrUrl)) {
    console.log("❌ Remote URLs are not supported by the generator anymore. Use a local path (e.g. ./public/icon.png)");
    return Promise.reject(new Error("Remote icon URLs are not supported. Use a local filesystem path."));
  }

  // Treat as a local filesystem path (relative or absolute).
  // Resolve relative paths against repo root (one level up from scripts/).
  const candidate = path.isAbsolute(iconPathOrUrl)
    ? iconPathOrUrl
    : path.join(__dirname, "..", iconPathOrUrl);

  if (!fs.existsSync(candidate)) {
    console.log(`⚠️  Local icon not found at: ${candidate}`);
    return Promise.reject(new Error(`Local icon not found: ${candidate}`));
  }

  return new Promise((resolve, reject) => {
    fs.copyFile(candidate, outputPath, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function generateIcons() {
  try {
    // Check if sharp is available
    let sharp;
    try {
      sharp = require("sharp");
    } catch (error) {
      console.log("📦 Installing sharp...");
      const { execSync } = require("child_process");
      execSync("npm install sharp", { stdio: "inherit" });
      sharp = require("sharp");
    }

    // Get icon URL from settings
    const iconUrl = getIconUrlFromSettings();
    if (!iconUrl) {
      return; // Exit gracefully if no iconUrl is set
    }

    console.log("🎨 Generating icons from URL:", iconUrl);

    const tempDir = path.join(__dirname, "..", ".temp");
    const publicDir = path.join(__dirname, "..", "public");
    const appDir = path.join(__dirname, "..", "src", "app");

    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const sourceImagePath = path.join(tempDir, "source-icon.png");

  // Fetch or copy the image from URL or local path
  console.log("⬇️  Preparing source icon...");
  await prepareSourceImage(iconUrl, sourceImagePath);
  console.log("✅ Source icon ready");

    // Define all required icon sizes
    const iconSizes = [
      { size: 16, filename: "icon-16x16.png" },
      { size: 32, filename: "icon-32x32.png" },
      { size: 72, filename: "icon-72x72.png" },
      { size: 96, filename: "icon-96x96.png" },
      { size: 128, filename: "icon-128x128.png" },
      { size: 144, filename: "icon-144x144.png" },
      { size: 152, filename: "icon-152x152.png" },
      { size: 192, filename: "icon-192x192.png" },
      { size: 384, filename: "icon-384x384.png" },
      { size: 512, filename: "icon-512x512.png" },
    ];

    // Maskable icon sizes (with padding for safe zone)
    const maskableIcons = [
      { size: 192, filename: "icon-maskable-192x192.png", padding: 0.1 },
      { size: 512, filename: "icon-maskable-512x512.png", padding: 0.1 },
    ];

    // Generate standard icons
    console.log("\n📐 Generating standard icons...");
    for (const icon of iconSizes) {
      const outputPath = path.join(publicDir, icon.filename);
      await sharp(sourceImagePath)
        .resize(icon.size, icon.size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${icon.filename} (${icon.size}x${icon.size})`);
    }

    // Generate maskable icons (with safe zone padding)
    console.log("\n🎭 Generating maskable icons...");
    for (const icon of maskableIcons) {
      const outputPath = path.join(publicDir, icon.filename);
      const paddedSize = Math.round(icon.size * (1 - icon.padding * 2));

      await sharp({
        create: {
          width: icon.size,
          height: icon.size,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([
          {
            input: await sharp(sourceImagePath)
              .resize(paddedSize, paddedSize, {
                fit: "contain",
                background: { r: 0, g: 0, b: 0, alpha: 0 },
              })
              .png()
              .toBuffer(),
            top: Math.round((icon.size - paddedSize) / 2),
            left: Math.round((icon.size - paddedSize) / 2),
          },
        ])
        .png()
        .toFile(outputPath);

      console.log(
        `✅ Generated ${icon.filename} (${icon.size}x${icon.size}, maskable)`
      );
    }

    // Generate favicon.ico
    console.log("\n🔖 Generating favicon...");
    const faviconPath = path.join(appDir, "favicon.ico");
    await sharp(sourceImagePath)
      .resize(32, 32, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toFile(faviconPath);

    console.log("✅ Generated favicon.ico");

    // Generate Apple Touch Icon
    console.log("\n🍎 Generating Apple Touch Icon...");
    const appleTouchIconPath = path.join(publicDir, "apple-touch-icon.png");
    await sharp(sourceImagePath)
      .resize(180, 180, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(appleTouchIconPath);

    console.log("✅ Generated apple-touch-icon.png (180x180)");

    // Clean up temp file
    fs.unlinkSync(sourceImagePath);
    if (fs.readdirSync(tempDir).length === 0) {
      fs.rmdirSync(tempDir);
    }

    console.log("\n🎉 Icon generation complete!");
    console.log(
      `Generated ${iconSizes.length + maskableIcons.length + 2} icons total.`
    );

    console.log("\n📋 Summary:");
    console.log("  • Standard icons: 16px to 512px");
    console.log("  • Maskable icons: 192px, 512px (with safe zone)");
    console.log("  • Favicon: favicon.ico");
    console.log("  • Apple Touch Icon: 180px");
  } catch (error) {
    console.error("❌ Error generating icons:", error.message);
    // Don't exit with error code - allow build to continue
    console.log("⚠️  Continuing without icon generation");
  }
}

// Run the script
if (require.main === module) {
  generateIcons();
}

module.exports = generateIcons;
