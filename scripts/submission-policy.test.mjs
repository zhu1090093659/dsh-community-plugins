/**
 * Submission policy: blocked contributors are refused unread by the workflow.
 *
 * The tests pin the repository's own policy data and the checker exit codes
 * (3 = blocked, 2 = usage or broken policy) so a crashed checker (exit 1) can
 * never be mistaken for a blocked contributor.
 */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  BLOCKED_EXIT_CODE,
  POLICY_VERSION,
  findBlockedContributor,
  loadPolicy,
} from './submission-policy.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SCRIPT = join(ROOT, 'scripts', 'submission-policy.mjs')

function run(args, extraEnv = {}) {
  return spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...extraEnv },
  })
}

test('the repository policy is well-formed and does not block PerryLink', () => {
  const policy = loadPolicy()
  assert.equal(policy.version, POLICY_VERSION)
  assert.equal(findBlockedContributor(policy, 'PerryLink'), null)
  const result = run(['--login', 'PerryLink'])
  assert.equal(result.status, 0)
  assert.match(result.stdout, /PerryLink is not a blocked contributor/)
})

test('blocked-contributor matching ignores case and whitespace without prefix collisions', () => {
  const sandbox = mkdtempSync(join(tmpdir(), 'submission-policy-'))
  try {
    const file = join(sandbox, 'policy.json')
    writeFileSync(file, JSON.stringify({
      version: POLICY_VERSION,
      blockedContributors: [
        { login: 'Blocked-Example', blockedAt: '2026-11-24', reason: 'example' },
      ],
    }))
    const policy = loadPolicy(file)
    for (const login of ['blocked-example', 'BLOCKED-EXAMPLE', ' Blocked-Example ']) {
      assert.ok(findBlockedContributor(policy, login), login + ' must match')
    }
    assert.equal(findBlockedContributor(policy, 'Blocked-Example2'), null)
    assert.equal(findBlockedContributor(policy, 'Blocked'), null)
  } finally {
    rmSync(sandbox, { recursive: true, force: true })
  }
})

test('an unlisted contributor is allowed with exit code 0', () => {
  assert.equal(findBlockedContributor(loadPolicy(), 'zhu1090093659'), null)
  const result = run(['--login', 'zhu1090093659'])
  assert.equal(result.status, 0)
})

test('the CLI reports a blocked contributor with exit code 3 via SUBMISSION_POLICY_FILE', () => {
  const sandbox = mkdtempSync(join(tmpdir(), 'submission-policy-'))
  try {
    const file = join(sandbox, 'policy.json')
    writeFileSync(file, JSON.stringify({
      version: POLICY_VERSION,
      blockedContributors: [
        { login: 'blocked-example', blockedAt: '2026-11-24', reason: 'example' },
      ],
    }))
    const result = run(['--login', 'blocked-example'], { SUBMISSION_POLICY_FILE: file })
    assert.equal(result.status, BLOCKED_EXIT_CODE)
    assert.match(result.stdout, /blocked contributor blocked-example \(since 2026-11-24\)/)
  } finally {
    rmSync(sandbox, { recursive: true, force: true })
  }
})

test('a crashed checker can never read as a blocked contributor', () => {
  const crash = spawnSync(process.execPath, [join(ROOT, 'scripts', 'missing-policy-checker.mjs')], { encoding: 'utf8' })
  assert.equal(crash.status, 1, 'the Node runtime reports a missing module as exit 1')
  assert.notEqual(crash.status, BLOCKED_EXIT_CODE)
})

test('the workflow acts on the same exit code the checker uses', () => {
  const workflow = readFileSync(join(ROOT, '.github', 'workflows', 'submission-policy.yml'), 'utf8')
  assert.match(workflow, new RegExp('^\\s*' + BLOCKED_EXIT_CODE + '\\) .*close-reason', 'm'))
})

test('a usage error exits 2, never 1', () => {
  assert.equal(run([]).status, 2)
  assert.equal(run(['--login']).status, 2)
})

test('a malformed policy is an error, not a blocked contributor', () => {
  const sandbox = mkdtempSync(join(tmpdir(), 'submission-policy-'))
  try {
    const file = join(sandbox, 'policy.json')
    writeFileSync(file, JSON.stringify({
      version: POLICY_VERSION,
      blockedContributors: [{ login: 'someone' }],
    }))
    assert.throws(() => loadPolicy(file), /blockedAt/)
    writeFileSync(file, JSON.stringify({ version: 99, blockedContributors: [] }))
    assert.throws(() => loadPolicy(file), /unsupported version/)
    writeFileSync(file, JSON.stringify({
      version: POLICY_VERSION,
      blockedContributors: [{ login: 'A', blockedAt: '2026-11-24', reason: 'x' }, { login: 'a', blockedAt: '2026-11-24', reason: 'x' }],
    }))
    assert.throws(() => loadPolicy(file), /duplicate blocked login/)
  } finally {
    rmSync(sandbox, { recursive: true, force: true })
  }
})
