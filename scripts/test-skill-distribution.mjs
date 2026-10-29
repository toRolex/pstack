import assert from 'node:assert/strict';
import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = join(root, 'skills');
const adapterSource = readFileSync(join(root, 'docs/harness/claude-code.md'), 'utf8');
const harnessSource = readFileSync(join(skillsRoot, 'how/references/pstack-harness.md'), 'utf8');
const skillDirs = readdirSync(skillsRoot).filter(name => existsSync(join(skillsRoot, name, 'SKILL.md')));
const adapterSkills = skillDirs.filter(name => readFileSync(join(skillsRoot, name, 'SKILL.md'), 'utf8').includes('references/claude-code.md'));
const harnessSkills = skillDirs.filter(name => readFileSync(join(skillsRoot, name, 'SKILL.md'), 'utf8').includes('references/pstack-harness.md'));
const guidePages = [
  '01-setup.md',
  '02-poteto-mode.md',
  '06-verify-and-ship.md',
  '07-overnight.md',
  '08-principles.md',
  '09-make-it-yours.md',
  '10-recipes-and-pitfalls.md',
];
const tempRoot = mkdtempSync(join(tmpdir(), 'pstack-skill-distribution-'));

try {
  const generatedCheck = spawnSync(process.execPath, ['scripts/generate-skill-resources.mjs', '--check'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(generatedCheck.status, 0, generatedCheck.stderr || generatedCheck.stdout);
  assert.equal(adapterSkills.length, 23, 'all 23 adapter pointers must be discoverable');
  assert.equal(harnessSkills.length, 13, 'all 13 Harness/Subagents pointers must be discoverable');

  const runtimeMarkdown = [];
  for (const name of skillDirs) {
    runtimeMarkdown.push(join(skillsRoot, name, 'SKILL.md'));
    const playbooks = join(skillsRoot, name, 'playbooks');
    if (existsSync(playbooks)) {
      runtimeMarkdown.push(...readdirSync(playbooks).filter(file => file.endsWith('.md')).map(file => join(playbooks, file)));
    }
  }
  for (const path of runtimeMarkdown) {
    assert.doesNotMatch(readFileSync(path, 'utf8'), /docs\/harness\/claude-code\.md|\.\.\/\.\.\/docs\/|agents\/poteto-agent\.md/, `runtime resource must be bundled: ${path}`);
  }
  const readme = readFileSync(join(root, 'README.md'), 'utf8');
  const standalone = readme.split('以下技能可单独安装并使用：')[1].split('需要跨技能工作的场景')[0];
  for (const [name, dependencies] of [
    ['figure-it-out', ['poteto-mode', 'show-me-your-work', 'architect']],
    ['automate-me', ['poteto-mode', 'unslop']],
    ['show-me-your-work', ['unslop']],
  ]) {
    assert.ok(!standalone.includes(`\`${name}\``), `${name} requires sibling skills`);
    const row = readme.split('\n').find(line => line.startsWith(`| \`${name}\` |`));
    assert.ok(row, `missing dependency row: ${name}`);
    for (const dependency of dependencies) assert.ok(row.includes(`\`${dependency}\``), `missing dependency: ${name} -> ${dependency}`);
  }

  const portableFiles = [];
  for (const name of adapterSkills) {
    const path = join(skillsRoot, name, 'references/claude-code.md');
    assert.equal(readFileSync(path, 'utf8'), adapterSource, `${name} adapter copy drifted`);
    portableFiles.push(path);
  }
  for (const name of harnessSkills) {
    const path = join(skillsRoot, name, 'references/pstack-harness.md');
    assert.equal(readFileSync(path, 'utf8'), harnessSource, `${name} harness copy drifted`);
    portableFiles.push(path);
  }

  const potetoPromptPath = join(skillsRoot, 'poteto-mode/references/poteto-agent.md');
  const commentPromptPath = join(skillsRoot, 'no-comments/references/comment-sicko.md');
  const potetoPrompt = readFileSync(potetoPromptPath, 'utf8');
  const commentPrompt = readFileSync(commentPromptPath, 'utf8');
  portableFiles.push(potetoPromptPath, commentPromptPath);
  for (const [label, prompt] of [['poteto-agent', potetoPrompt], ['comment-sicko', commentPrompt]]) {
    assert.match(prompt, /^> Prompt resource for a generic subagent/m, `${label} must be a bundled prompt resource`);
    assert.doesNotMatch(prompt, /^---\s*$/m, `${label} must not retain agent frontmatter`);
    assert.doesNotMatch(prompt, /\.\.\/docs\/harness\/claude-code\.md/, `${label} must use its bundled adapter`);
  }
  for (const page of guidePages) {
    const path = join(skillsRoot, 'poteto-help/references/guide', page);
    assert.ok(existsSync(path), `missing bundled guide ${page}`);
    portableFiles.push(path);
  }
  for (const path of portableFiles) {
    const skillName = relative(skillsRoot, path).split(sep)[0];
    const packageRoot = join(skillsRoot, skillName);
    const markdown = readFileSync(path, 'utf8');
    for (const [, target] of markdown.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(target)) continue;
      const linkPath = target.split(/[?#]/, 1)[0];
      if (!linkPath) continue;
      const linkedPath = resolve(dirname(path), decodeURIComponent(linkPath));
      const packagePath = relative(packageRoot, linkedPath);
      assert.ok(packagePath !== '..' && !packagePath.startsWith('../'), `reference escapes package: ${path} -> ${target}`);
      assert.ok(existsSync(linkedPath), `broken bundled reference: ${path} -> ${target}`);
    }
  }

  const tdd = readFileSync(join(skillsRoot, 'tdd/SKILL.md'), 'utf8');
  assert.match(tdd, /^name: tdd-pstack$/m);
  assert.ok(existsSync(join(skillsRoot, 'tdd/SKILL.md')));
  assert.equal(existsSync(join(skillsRoot, 'tdd-pstack')), false, 'tdd-pstack is an install name, not a source directory');

  const cloneRoot = join(tempRoot, 'clone');
  mkdirSync(cloneRoot, { recursive: true });
  cpSync(skillsRoot, join(cloneRoot, 'skills'), { recursive: true });
  const agentSkillsRoot = join(tempRoot, 'project/.agents/skills');
  mkdirSync(agentSkillsRoot, { recursive: true });
  const links = [
    ['how', 'how'],
    ['poteto-help', 'poteto-help'],
    ['poteto-mode', 'poteto-mode'],
    ['no-comments', 'no-comments'],
    ['tdd', 'tdd-pstack'],
    ['arena', 'arena'],
    ['in-your-own-words', 'in-your-own-words'],
  ];
  for (const [sourceName, installName] of links) {
    const target = join(agentSkillsRoot, installName);
    const source = join(cloneRoot, 'skills', sourceName);
    symlinkSync(source, target, 'dir');
    assert.equal(lstatSync(target).isSymbolicLink(), true, `${installName} must be a symlink`);
    assert.equal(realpathSync(target), realpathSync(source), `${installName} must link to its source directory`);
    assert.ok(existsSync(join(target, 'SKILL.md')), `${installName} must expose SKILL.md`);
  }
  for (const path of [
    'how/references/claude-code.md',
    'how/references/pstack-harness.md',
    'how/references/explainer-prompt.md',
    'how/references/explorer-prompt.md',
    'poteto-help/references/guide/01-setup.md',
    'poteto-mode/references/poteto-agent.md',
    'no-comments/references/comment-sicko.md',
    'tdd-pstack/SKILL.md',
  ]) {
    assert.ok(existsSync(join(agentSkillsRoot, path)), `resource missing through skill link: ${path}`);
  }

  console.log(`PASS: ${adapterSkills.length} adapters, ${harnessSkills.length} harness references, ${guidePages.length} guide pages, prompt resources, tdd-pstack mapping, and clone/symlink layout.`);
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
