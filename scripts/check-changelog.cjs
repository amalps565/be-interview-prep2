#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const changelogPath = path.join(root, 'CHANGELOG.md');
const pomPath = path.join(root, 'pom.xml');

const HEADING = /^## (.*)$/;
const RELEASE = /^## \[(\d+)\.(\d+)\.(\d+)\] - (\d{4})-(\d{2})-(\d{2})$/;
const SECTION = /^### (Added|Changed|Deprecated|Removed|Fixed|Security)$/;

const errors = [];

function fail(line, message) {
  errors.push(line ? `CHANGELOG.md:${line}: ${message}` : `CHANGELOG.md: ${message}`);
}

function compareVersions(a, b) {
  for (let i = 0; i < 3; i += 1) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

function isRealDate(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function todayUtc() {
  const now = new Date();
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}

function projectVersion() {
  if (!fs.existsSync(pomPath)) return null;
  const pom = fs.readFileSync(pomPath, 'utf8').replace(/<parent>[\s\S]*?<\/parent>/, '');
  const match = pom.match(/<version>\s*([^<\s]+)\s*<\/version>/);
  return match ? match[1] : null;
}

if (!fs.existsSync(changelogPath)) {
  console.error('CHANGELOG.md is missing.');
  process.exit(1);
}

const lines = fs.readFileSync(changelogPath, 'utf8').split(/\r?\n/);

if (lines[0] !== '# Changelog') fail(1, 'the first line must be "# Changelog".');

const releases = [];
let current = null;

lines.forEach((text, index) => {
  const line = index + 1;
  const heading = text.match(HEADING);
  if (heading) {
    const release = text.match(RELEASE);
    if (!release) {
      fail(line, `"${text}" must be "## [X.Y.Z] - YYYY-MM-DD"; there is no [Unreleased] section.`);
      current = null;
      return;
    }
    const [, major, minor, patch, year, month, day] = release.map(Number);
    current = {
      line,
      label: `${major}.${minor}.${patch}`,
      version: [major, minor, patch],
      date: Date.UTC(year, month - 1, day),
      validDate: isRealDate(year, month, day),
      sections: 0,
      bullets: 0,
    };
    releases.push(current);
    return;
  }
  if (!current) return;
  if (text.startsWith('### ')) {
    if (SECTION.test(text)) current.sections += 1;
    else fail(line, `"${text}" must be one of Added, Changed, Deprecated, Removed, Fixed, Security.`);
  } else if (text.startsWith('- ')) {
    current.bullets += 1;
  }
});

if (releases.length === 0) fail(null, 'there is no release entry.');

const seen = new Set();
releases.forEach((release, index) => {
  if (seen.has(release.label)) fail(release.line, `version ${release.label} appears more than once.`);
  seen.add(release.label);

  if (!release.validDate) fail(release.line, `the date of ${release.label} is not a real calendar date.`);
  else if (release.date > todayUtc()) fail(release.line, `the date of ${release.label} is in the future.`);

  if (release.sections === 0 || release.bullets === 0) {
    fail(release.line, `${release.label} needs at least one ### section with at least one bullet.`);
  }

  const older = releases[index + 1];
  if (!older) return;
  if (compareVersions(release.version, older.version) <= 0) {
    fail(release.line, `${release.label} must be higher than the release below it (${older.label}).`);
  }
  if (release.validDate && older.validDate && release.date < older.date) {
    fail(release.line, `${release.label} is dated before the release below it (${older.label}).`);
  }
});

const pomVersion = projectVersion();
if (releases.length && pomVersion && pomVersion !== releases[0].label) {
  fail(releases[0].line, `the newest release is ${releases[0].label} but pom.xml is ${pomVersion}.`);
}

if (errors.length) {
  errors.forEach((message) => console.error(message));
  process.exit(1);
}

console.log(`CHANGELOG.md is valid: ${releases.length} release(s), newest ${releases[0].label}.`);
