/**
 * Video compression script using ffmpeg-static.
 * - Re-encodes all MP4s with CRF 26 (visually lossless, ~60% smaller)
 * - Converts GIFs → MP4 (10-20× smaller)
 * - Strips audio tracks (all videos are muted in the app)
 * - Adds faststart flag for faster browser streaming
 */

import { execFileSync } from "child_process";
import { createRequire } from "module";
import { readdirSync, statSync, renameSync, unlinkSync } from "fs";
import { join, extname, basename } from "path";

const require = createRequire(import.meta.url);
const ffmpegPath = require("ffmpeg-static");

const publicDir = join(process.cwd(), "public");

const sizeStr = (bytes) =>
    bytes >= 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${(bytes / 1e3).toFixed(0)} KB`;

const run = (args) => {
    try {
        execFileSync(ffmpegPath, args, { stdio: "pipe" });
        return true;
    } catch (e) {
        console.error("  ✗ FFmpeg error:", e.stderr?.toString().slice(-300));
        return false;
    }
};

const files = readdirSync(publicDir);

for (const file of files) {
    const ext = extname(file).toLowerCase();
    const src = join(publicDir, file);
    const name = basename(file, ext);

    if (ext === ".mp4") {
        const tmp = join(publicDir, `${name}_compressed.mp4`);
        const before = statSync(src).size;

        console.log(`\n🎬 Compressing MP4: ${file} (${sizeStr(before)})`);

        const ok = run([
            "-i", src,
            "-c:v", "libx264",
            "-crf", "26",
            "-preset", "slow",
            "-an",                   // strip audio (already muted in app)
            "-movflags", "faststart",
            "-pix_fmt", "yuv420p",
            "-y", tmp,
        ]);

        if (ok) {
            const after = statSync(tmp).size;
            if (after < before) {
                unlinkSync(src);
                renameSync(tmp, src);
                const saved = (((before - after) / before) * 100).toFixed(0);
                console.log(`  ✓ ${sizeStr(before)} → ${sizeStr(after)} (${saved}% smaller)`);
            } else {
                unlinkSync(tmp);
                console.log(`  ↩ Already optimal, keeping original`);
            }
        }
    }

    if (ext === ".gif") {
        const mp4Out = join(publicDir, `${name}.mp4`);
        const before = statSync(src).size;

        console.log(`\n🎞  Converting GIF → MP4: ${file} (${sizeStr(before)})`);

        const ok = run([
            "-i", src,
            "-movflags", "faststart",
            "-pix_fmt", "yuv420p",
            "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
            "-c:v", "libx264",
            "-crf", "26",
            "-preset", "slow",
            "-an",
            "-y", mp4Out,
        ]);

        if (ok) {
            const after = statSync(mp4Out).size;
            const saved = (((before - after) / before) * 100).toFixed(0);
            console.log(`  ✓ GIF (${sizeStr(before)}) → MP4 (${sizeStr(after)}) — ${saved}% smaller`);
            console.log(`  ℹ  Original GIF kept: update code references when ready.`);
        }
    }
}

console.log("\n✅ Compression complete.\n");
