import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const adapterSkills = [
  'principle-prove-it-works',
  'poteto-mode',
  'create-formal-verification-skill',
  'no-comments',
  'architect',
  'create-verification-skill',
  'teach',
  'setup-pstack',
  'show-me-your-work',
  'poteto-help',
  'why',
  'maintain-formal-verification-skill',
  'automate-me',
  'swarm',
  'reflect',
  'arena',
  'figure-it-out',
  'technical-writing',
  'maintain-verification-skill',
  'interrogate',
  'how',
  'recall',
  'make-bot-ui',
];
const harnessSkills = [
  'how',
  'no-comments',
  'automate-me',
  'reflect',
  'show-me-your-work',
  'architect',
  'arena',
  'why',
  'interrogate',
  'poteto-help',
  'swarm',
  'figure-it-out',
  'recall',
];
const guidePages = [
  '01-setup.md',
  '02-poteto-mode.md',
  '06-verify-and-ship.md',
  '07-overnight.md',
  '08-principles.md',
  '09-make-it-yours.md',
  '10-recipes-and-pitfalls.md',
];
const generated = new Map();

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

function section(markdown, title) {
  const start = markdown.indexOf(`## ${title}\n`);
  if (start < 0) throw new Error(`Missing section: ${title}`);
  const next = markdown.indexOf('\n## ', start + 1);
  return `${markdown.slice(start, next < 0 ? markdown.length : next).trimEnd()}\n`;
}

function githubUrl(path, isDirectory = false) {
  return `https://github.com/toRolex/pstack/${isDirectory ? 'tree' : 'blob'}/main/${path}`;
}

function portableGuide(markdown) {
  return markdown.replace(/\]\(([^)]+)\)/g, (link, target) => {
    if (/^(?:[a-z]+:|#)/i.test(target)) return link;
    const [path, ...anchor] = target.split('#');
    let replacement = path;
    if (path.startsWith('../../skills/')) {
      const sourcePath = path.slice('../../'.length);
      replacement = githubUrl(sourcePath, path.endsWith('/'));
    } else if (path.startsWith('../../automations/')) {
      replacement = githubUrl(path.slice('../../'.length), path.endsWith('/'));
    } else if (path === '../harness/claude-code.md') {
      replacement = '../claude-code.md';
    } else if (path.startsWith('./images/')) {
      replacement = githubUrl(`docs/guide/${path.slice(2)}`);
    } else if (path.startsWith('./') && path.endsWith('.md')) {
      const page = basename(path);
      if (!guidePages.includes(page)) replacement = githubUrl(`docs/guide/${path.slice(2)}`);
    } else if (path.startsWith('../../')) {
      replacement = githubUrl(path.slice('../../'.length), path.endsWith('/'));
    }
    return `](${replacement}${anchor.length ? `#${anchor.join('#')}` : ''})`;
  });
}

function promptBody(relativePath) {
  const source = read(relativePath);
  const frontmatter = source.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n+/);
  if (!frontmatter) throw new Error(`Missing agent frontmatter: ${relativePath}`);
  const body = source.slice(frontmatter[0].length)
    .replaceAll('../docs/harness/claude-code.md', 'claude-code.md')
    .trimStart();
  return `> Prompt resource for a generic subagent. This file does not register a named agent.\n\n${body}`;
}

const adapter = read('docs/harness/claude-code.md');
for (const name of adapterSkills) {
  generated.set(`skills/${name}/references/claude-code.md`, adapter);
}

const potetoMode = read('skills/poteto-mode/SKILL.md');
let subagents = section(potetoMode, 'Subagents');
const genericRules = subagents.indexOf('**Defaults for every subagent call.**');
if (genericRules < 0) throw new Error('Missing generic Subagents rules');
subagents = `## Subagents\n\n${subagents.slice(genericRules).trimStart()}`;
let harness = section(potetoMode, 'Harness')
  .split('\n')
  .filter(line => !line.startsWith('- **`poteto-agent`.**'))
  .join('\n')
  .replaceAll('references/claude-code.md', 'claude-code.md')
  .replaceAll('references/poteto-agent.md', 'poteto-agent.md');
const harnessReference = `${subagents.trimEnd()}\n\n${harness.trimStart()}`;
for (const name of harnessSkills) {
  generated.set(`skills/${name}/references/pstack-harness.md`, harnessReference);
}

generated.set('skills/poteto-mode/references/poteto-agent.md', promptBody('agents/poteto-agent.md'));
generated.set('skills/no-comments/references/comment-sicko.md', promptBody('agents/comment-sicko.md'));

for (const page of guidePages) {
  generated.set(`skills/poteto-help/references/guide/${page}`, portableGuide(read(`docs/guide/${page}`)));
}

const check = process.argv.includes('--check');
const unknownArgs = process.argv.slice(2).filter(arg => arg !== '--check');
if (unknownArgs.length) throw new Error(`Unknown argument: ${unknownArgs[0]}`);

const stale = [];
for (const [relativePath, content] of generated) {
  const outputPath = resolve(root, relativePath);
  if (check) {
    if (!existsSync(outputPath) || readFileSync(outputPath, 'utf8') !== content) stale.push(relativePath);
  } else {
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, content);
  }
}

if (check && stale.length) {
  console.error(`Generated skill resources are missing or stale (${stale.length}):`);
  for (const path of stale) console.error(`  ${path}`);
  process.exitCode = 1;
} else {
  console.log(check ? `Checked ${generated.size} generated skill resources.` : `Generated ${generated.size} skill resources.`);
}
