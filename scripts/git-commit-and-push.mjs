import git from 'isomorphic-git';
import fs from 'node:fs';
import path from 'node:path';
import http from 'isomorphic-git/http/node';

const dir = process.cwd();
const remoteUrl = process.argv[2] || 'https://github.com/cuttoff/trail.git';
const token = process.env.GITHUB_TOKEN || process.argv[3];

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (
      file === 'node_modules' ||
      file === '.next' ||
      file === '.git' ||
      file === 'temp_app' ||
      file === '.github' ||
      file === '.env.local' ||
      file.endsWith('.tsbuildinfo')
    ) {
      return;
    }
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      const relativePath = path.relative(dir, fullPath).replace(/\\/g, '/');
      arrayOfFiles.push(relativePath);
    }
  });

  return arrayOfFiles;
}

async function run() {
  console.log('Resetting git index...');
  await git.init({ fs, dir, defaultBranch: 'main' });
  await git.remove({ fs, dir, filepath: '.env.local' }).catch(() => {});

  const filesToStage = getAllFiles(dir);

  for (const filepath of filesToStage) {
    await git.add({ fs, dir, filepath });
    console.log(`Staged: ${filepath}`);
  }

  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'cutoff-bot',
      email: 'bot@cutoff.in',
    },
    message: 'feat: add NLUs & Law Colleges directory page (/colleges)',
  });
  console.log('Commit created:', sha);

  await git.branch({ fs, dir, ref: 'main', checkout: true }).catch(() => {});

  console.log(`Setting remote origin to ${remoteUrl}...`);
  try {
    await git.addRemote({ fs, dir, remote: 'origin', url: remoteUrl, force: true });
  } catch (err) {
    await git.deleteRemote({ fs, dir, remote: 'origin' }).catch(() => {});
    await git.addRemote({ fs, dir, remote: 'origin', url: remoteUrl });
  }

  if (!token) {
    console.log('Token missing.');
    return;
  }

  console.log('Pushing to GitHub remote main branch...');
  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'HEAD',
    remoteRef: 'refs/heads/main',
    force: true,
    onAuth: () => ({ username: token, password: '' }),
  });
  console.log('Successfully pushed to GitHub! Result:', pushResult);
}

run().catch(console.error);
