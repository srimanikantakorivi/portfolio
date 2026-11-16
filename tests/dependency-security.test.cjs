const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');

test('TypeScript ESLint resolves a patched glob matcher with compatible filename matching', () => {
  const parserRequire = createRequire(require.resolve('@typescript-eslint/typescript-estree'));
  const version = parserRequire('minimatch/package.json').version;
  const [major, minor, patch] = version.split('.').map(Number);
  assert.ok(major > 11 || (major === 11 && (minor > 0 || patch >= 1)), `Unpatched minimatch ${version}`);
  const { minimatch } = parserRequire('minimatch');
  for (const [file, pattern, expected] of [
    ['App.tsx', '*.tsx', true],
    ['App.tsx', '*.ts', false],
    ['.eslintrc.js', '*.js', true],
    ['src/App.tsx', '**/*.tsx', true],
    ['src/App.tsx', '*.tsx', false],
  ]) {
    assert.equal(minimatch(file, pattern, { dot: true }), expected, `${file} against ${pattern}`);
  }
});
