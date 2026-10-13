# Task Lens

Task Lens is a zero-dependency Node.js command-line tool for viewing task status counts or listing tasks in one status.

## Requirements

- Node.js 18 or later
- No third-party dependencies

## Install

Clone or download this project, then open a terminal in its directory. There is nothing to install with npm.

## Run

```sh
npm start
```

The default output shows counts for `todo`, `doing`, and `done`, followed by the total number of tasks.

To list tasks in one status:

```sh
npm start -- --status todo
```

The accepted statuses are `todo`, `doing`, and `done`. Edit `data/tasks.json` to manage tasks. Each task must have a string `title` and one of those statuses.

## Test

Run the test suite with Node.js's built-in test runner:

```sh
npm test
```
