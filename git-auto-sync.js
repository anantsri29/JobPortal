const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname);
const ignorePatterns = [
  ".git",
  "node_modules",
  "client/node_modules",
  "server/node_modules",
  ".vscode",
  ".idea",
  "uploads",
  "server/uploads",
];

let debounceTimer = null;
let syncing = false;
let pending = false;

function shouldIgnore(relativePath) {
  if (!relativePath) return true;
  const normalized = relativePath.replace(/\\/g, "/");
  return ignorePatterns.some((pattern) => {
    if (normalized === pattern) return true;
    return normalized.startsWith(`${pattern}/`);
  });
}

function log(message) {
  const time = new Date().toISOString();
  console.log(`[git-auto-sync] ${time} ${message}`);
}

function runGitCommand(args, options = {}) {
  return new Promise((resolve, reject) => {
    const git = spawn("git", args, {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
      ...options,
    });
    let stdout = "";
    let stderr = "";

    git.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    git.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    git.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `git ${args.join(" ")} failed with code ${code}: ${stderr.trim()}`,
          ),
        );
      } else {
        resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
      }
    });
  });
}

async function syncRepo() {
  if (syncing) {
    pending = true;
    return;
  }

  syncing = true;
  pending = false;

  try {
    log("Staging changes...");
    await runGitCommand(["add", "-A"]);

    const { stdout: diffOutput } = await runGitCommand([
      "diff",
      "--cached",
      "--name-only",
    ]);
    if (!diffOutput) {
      log("No staged changes to commit.");
    } else {
      log("Committing changes...");
      const commitMessage = `Auto sync: ${new Date().toISOString()}`;
      await runGitCommand(["commit", "-m", commitMessage]);
      log("Pushing to origin/main...");
      await runGitCommand(["push", "-u", "origin", "main"]);
      log("Sync complete.");
    }
  } catch (error) {
    log(`Sync failed: ${error.message}`);
  } finally {
    syncing = false;
    if (pending) {
      pending = false;
      scheduleSync();
    }
  }
}

function scheduleSync() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(syncRepo, 8000);
}

function startWatcher() {
  log("Starting file watcher...");

  const watcher = fs.watch(root, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    const relativePath = path.relative(root, path.join(root, filename));
    if (shouldIgnore(relativePath)) return;

    log(`Detected change: ${relativePath}`);
    scheduleSync();
  });

  watcher.on("error", (error) => {
    log(`Watcher error: ${error.message}`);
  });

  process.on("SIGINT", () => {
    log("Stopping watcher.");
    watcher.close();
    process.exit(0);
  });
}

startWatcher();
