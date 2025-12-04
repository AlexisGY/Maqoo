const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const backendDir = path.resolve(__dirname, '..');
const serverEntry = path.resolve(backendDir, '../server/index.js');
const envFile = path.resolve(backendDir, '.env');

const parseEnvFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .reduce((acc, line) => {
        const idx = line.indexOf('=');
        if (idx === -1) return acc;
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        acc[key] = value;
        return acc;
      }, {});
  } catch (err) {
    return {};
  }
};

const envFromFile = parseEnvFile(envFile);
const env = { ...process.env, ...envFromFile };

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

const mapsPort = env.PLACES_PORT || '3001';

const procBackend = spawn(npmCmd, ['run', 'start:dev'], {
  cwd: backendDir,
  env,
  stdio: 'inherit',
  shell: true,
});

const procMaps = spawn(process.execPath, [serverEntry], {
  cwd: path.resolve(backendDir, '..'),
  env: { ...env, PORT: mapsPort },
  stdio: 'inherit',
  shell: false,
});

const cleanup = (code) => {
  if (!procBackend.killed) {
    procBackend.kill();
  }
  if (!procMaps.killed) {
    procMaps.kill();
  }
  process.exit(code);
};

procBackend.on('exit', (code) => {
  console.log(`[backend] exited with code ${code}`);
  cleanup(code ?? 0);
});

procMaps.on('exit', (code) => {
  console.log(`[maps] exited with code ${code}`);
  cleanup(code ?? 0);
});

process.on('SIGINT', () => cleanup(0));
process.on('SIGTERM', () => cleanup(0));
