import { spawn } from "node:child_process";

const processes = [
  {
    name: "api",
    child: spawn("npm run dev:api", {
      cwd: process.cwd(),
      shell: true,
      stdio: "inherit"
    })
  },
  {
    name: "web",
    child: spawn("npm run dev:web", {
      cwd: process.cwd(),
      shell: true,
      stdio: "inherit"
    })
  }
];

let shuttingDown = false;

function stopAll(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const processEntry of processes) {
    if (!processEntry.child.killed) {
      processEntry.child.kill("SIGINT");
    }
  }

  process.exitCode = exitCode;
}

for (const processEntry of processes) {
  processEntry.child.on("exit", (code) => {
    if (shuttingDown) {
      return;
    }

    const normalizedCode = code ?? 0;

    if (normalizedCode !== 0) {
      console.error(`[${processEntry.name}] exited with code ${normalizedCode}`);
    }

    stopAll(normalizedCode);
  });
}

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));