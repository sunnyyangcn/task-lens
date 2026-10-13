import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

export const STATUSES = ['todo', 'doing', 'done'];
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function validateTasks(tasks) {
  if (!Array.isArray(tasks) || tasks.some((task) =>
    !task || typeof task.title !== 'string' || !STATUSES.includes(task.status)
  )) {
    throw new Error('data/tasks.json must contain tasks with a title and a valid status.');
  }
  return tasks;
}

export function summarizeTasks(tasks) {
  return Object.fromEntries([
    ...STATUSES.map((status) => [status, tasks.filter((task) => task.status === status).length]),
    ['total', tasks.length],
  ]);
}

export function filterTasks(tasks, status) {
  if (!STATUSES.includes(status)) {
    throw new Error(`--status must be one of: ${STATUSES.join(', ')}.`);
  }
  return tasks.filter((task) => task.status === status);
}

function parseStatus(args) {
  if (args.length === 0) return null;
  if (args.length !== 2 || args[0] !== '--status' || !STATUSES.includes(args[1])) {
    throw new Error(`Usage: npm start [-- --status <${STATUSES.join('|')}>].`);
  }
  return args[1];
}

async function readTasks() {
  const filePath = path.join(projectRoot, 'data', 'tasks.json');
  const contents = await readFile(filePath, 'utf8');
  return validateTasks(JSON.parse(contents));
}

async function main() {
  const status = parseStatus(process.argv.slice(2));
  const tasks = await readTasks();

  if (status) {
    const filteredTasks = filterTasks(tasks, status);
    console.log(`Tasks (${status}):`);
    if (filteredTasks.length === 0) console.log('No tasks.');
    else for (const task of filteredTasks) console.log(`- ${task.title}`);
    return;
  }

  const counts = summarizeTasks(tasks);
  for (const item of STATUSES) console.log(`${item}: ${counts[item]}`);
  console.log(`total: ${counts.total}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
