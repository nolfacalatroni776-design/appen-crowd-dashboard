import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const STORAGE_KEY = 'appen-crowd-dashboard-edit-state-v2';
const ORIGIN = 'https://nolfacalatroni776-design.github.io';
const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const levelReaderDir = '/tmp/appen-dashboard-level-reader';
const chromeLevelDb = join(homedir(), 'Library/Application Support/Google/Chrome/Default/Local Storage/leveldb');
const tempDb = '/tmp/appen-dashboard-localstorage-leveldb';

const ensureLevelReader = () => {
  if (existsSync(join(levelReaderDir, 'node_modules/level'))) return;

  mkdirSync(levelReaderDir, { recursive: true });
  if (!existsSync(join(levelReaderDir, 'package.json'))) {
    execFileSync('npm', ['init', '-y'], { cwd: levelReaderDir, stdio: 'ignore' });
  }
  execFileSync('npm', ['install', 'level', '--no-audit', '--no-fund'], { cwd: levelReaderDir, stdio: 'inherit' });
};

const copyChromeLocalStorage = () => {
  if (!existsSync(chromeLevelDb)) {
    throw new Error(`Chrome Local Storage not found: ${chromeLevelDb}`);
  }

  rmSync(tempDb, { recursive: true, force: true });
  execFileSync('cp', ['-R', chromeLevelDb, tempDb], { stdio: 'ignore' });
};

const readDashboardState = () => {
  ensureLevelReader();
  copyChromeLocalStorage();

  const readScript = `
    import { Level } from '${levelReaderDir}/node_modules/level/index.js';
    const db = new Level('${tempDb}', { keyEncoding: 'buffer', valueEncoding: 'buffer' });
    const target = ${JSON.stringify(`_${ORIGIN}\u0000\u0001${STORAGE_KEY}`)};
    const decode = (value) => {
      if (value[0] === 0x00) return value.subarray(1).toString('utf16le');
      if (value[0] === 0x01) return value.subarray(1).toString('utf8');
      return value.toString('utf8');
    };
    let found = '';
    for await (const [key, value] of db.iterator()) {
      if (key.toString('utf8') === target) {
        found = decode(value);
        break;
      }
    }
    await db.close();
    if (!found) process.exit(2);
    process.stdout.write(found);
  `;

  const raw = execFileSync('node', ['--input-type=module', '-e', readScript], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 10,
  });

  return JSON.parse(raw);
};

const pruneEmpty = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(pruneEmpty);

  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => [key, pruneEmpty(value)])
      .filter(([, value]) => {
        if (value === undefined) return false;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          return Object.keys(value).length > 0;
        }
        return true;
      })
  );
};

const writeSourceState = (state) => {
  const normalized = pruneEmpty({
    widgetConfigs: state.widgetConfigs ?? {},
    customMetrics: state.customMetrics ?? {},
    chartLists: state.chartLists ?? {},
    systemTexts: state.systemTexts ?? {},
  });
  const target = join(repoRoot, 'src/data/defaultDashboardState.ts');
  const content = `export const sourceDashboardState = ${JSON.stringify(normalized, null, 2)};\\n`;
  const previous = existsSync(target) ? readFileSync(target, 'utf8') : '';
  if (previous !== content) writeFileSync(target, content, 'utf8');
  return target;
};

const state = readDashboardState();
const target = writeSourceState(state);
console.log(`Persisted dashboard edit state to ${target}`);
