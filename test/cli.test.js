import test from 'node:test';
import assert from 'node:assert/strict';
import { filterTasks, summarizeTasks, validateTasks } from '../src/index.js';
import tasks from '../data/tasks.json' with { type: 'json' };

test('summarizes each status and the total', () => {
  assert.deepEqual(summarizeTasks(tasks), { todo: 2, doing: 1, done: 1, total: 4 });
});

test('filters tasks by status', () => {
  assert.deepEqual(filterTasks(tasks, 'doing'), [
    { title: 'Build task summary CLI', status: 'doing' },
  ]);
});

test('rejects unsupported statuses while filtering', () => {
  assert.throws(() => filterTasks(tasks, 'blocked'), /--status must be one of/);
});

test('validates task titles and statuses', () => {
  assert.throws(() => validateTasks([{ title: 'Invalid', status: 'blocked' }]), /valid status/);
  assert.throws(() => validateTasks([{ status: 'todo' }]), /title and a valid status/);
  assert.deepEqual(validateTasks(tasks), tasks);
});
