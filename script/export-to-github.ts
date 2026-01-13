// GitHub Export Script - Uses Replit GitHub integration
import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
import * as path from 'path';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

// Files and directories to ignore
const ignorePatterns = [
  'node_modules',
  '.git',
  'dist',
  '.replit',
  'replit.nix',
  '.cache',
  '.config',
  '.upm',
  'generated-icon.png',
  '.breakpoints',
  'attached_assets',
];

function shouldIgnore(filePath: string): boolean {
  return ignorePatterns.some(pattern => filePath.includes(pattern));
}

function getAllFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);
    
    if (shouldIgnore(relativePath)) continue;
    
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      files.push(relativePath);
    }
  }
  
  return files;
}

async function exportToGitHub(owner: string, repo: string) {
  console.log(`Exporting to ${owner}/${repo}...`);
  
  const octokit = await getUncachableGitHubClient();
  
  // Get the default branch
  let defaultBranch = 'main';
  let existingRepo = false;
  
  try {
    const repoInfo = await octokit.repos.get({ owner, repo });
    defaultBranch = repoInfo.data.default_branch;
    existingRepo = true;
    console.log(`Repository exists with default branch: ${defaultBranch}`);
  } catch (error: any) {
    if (error.status === 404) {
      console.log('Repository not found. Please create the repository first on GitHub.');
      process.exit(1);
    }
    throw error;
  }
  
  // Get current commit SHA for the branch
  let baseSha: string | undefined;
  let baseTreeSha: string | undefined;
  
  try {
    const ref = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${defaultBranch}`,
    });
    baseSha = ref.data.object.sha;
    
    const commit = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: baseSha,
    });
    baseTreeSha = commit.data.tree.sha;
    console.log(`Found existing branch ${defaultBranch} at ${baseSha.substring(0, 7)}`);
  } catch (error: any) {
    if (error.status !== 404) {
      throw error;
    }
    console.log('Branch not found, will create new one');
  }
  
  // Get all files
  const projectDir = process.cwd();
  const files = getAllFiles(projectDir);
  console.log(`Found ${files.length} files to upload`);
  
  // Create blobs for all files
  const treeItems: Array<{
    path: string;
    mode: '100644';
    type: 'blob';
    sha: string;
  }> = [];
  
  for (const filePath of files) {
    const fullPath = path.join(projectDir, filePath);
    const content = fs.readFileSync(fullPath);
    const isText = !content.includes(0x00);
    
    try {
      const blob = await octokit.git.createBlob({
        owner,
        repo,
        content: isText ? content.toString('utf-8') : content.toString('base64'),
        encoding: isText ? 'utf-8' : 'base64',
      });
      
      treeItems.push({
        path: filePath,
        mode: '100644',
        type: 'blob',
        sha: blob.data.sha,
      });
      
      console.log(`  Uploaded: ${filePath}`);
    } catch (error: any) {
      console.error(`  Failed to upload ${filePath}: ${error.message}`);
    }
  }
  
  // Create tree
  console.log('Creating tree...');
  const tree = await octokit.git.createTree({
    owner,
    repo,
    tree: treeItems,
    base_tree: baseTreeSha,
  });
  
  // Create commit
  console.log('Creating commit...');
  const commit = await octokit.git.createCommit({
    owner,
    repo,
    message: 'Export AIO Mapper from Replit',
    tree: tree.data.sha,
    parents: baseSha ? [baseSha] : [],
  });
  
  // Update branch reference
  console.log('Updating branch...');
  if (baseSha) {
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${defaultBranch}`,
      sha: commit.data.sha,
    });
  } else {
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${defaultBranch}`,
      sha: commit.data.sha,
    });
  }
  
  console.log(`\nSuccess! Code exported to https://github.com/${owner}/${repo}`);
}

// Parse the repository from command line
const repoArg = process.argv[2] || 'laratutton333/aio-mapper-2.0';
const [owner, repo] = repoArg.split('/');

if (!owner || !repo) {
  console.error('Usage: npx tsx script/export-to-github.ts owner/repo');
  process.exit(1);
}

exportToGitHub(owner, repo).catch(error => {
  console.error('Export failed:', error.message);
  process.exit(1);
});
