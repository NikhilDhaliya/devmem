import { glob } from 'glob';
import fs from 'fs-extra';
import path from 'path';

export interface FileEntry {
  relativePath: string;
  content: string;
}

/** Map of folder name → files in that folder */
export type FolderScanResult = Record<string, FileEntry[]>;

const IGNORE_PATTERNS = [
  'node_modules/**',
  'dist/**',
  'build/**',
  '.next/**',
  '.git/**',
  '.dev/**',
  '*.lock',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '*.map',
  '*.min.*',
  '.env',
  '.env.*',
  '!.env.example',
];

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.mp4', '.webm', '.mp3', '.wav', '.ogg',
  '.pdf', '.zip', '.tar', '.gz', '.bz2',
  '.exe', '.dll', '.so', '.dylib',
]);

const MAX_FILE_SIZE = 50 * 1024; // 50KB

/**
 * Scan a project and group files by their top-level folder.
 * Root-level files are grouped under "root".
 */
export async function scanProjectByFolders(projectDir: string): Promise<FolderScanResult> {
  const files = await glob('**/*', {
    cwd: projectDir,
    nodir: true,
    ignore: IGNORE_PATTERNS,
    dot: false,
  });

  const result: FolderScanResult = {};

  for (const file of files) {
    const absPath = path.join(projectDir, file);

    // Skip large files
    const stat = await fs.stat(absPath);
    if (stat.size > MAX_FILE_SIZE) continue;

    // Skip binary files
    const ext = path.extname(file).toLowerCase();
    if (BINARY_EXTENSIONS.has(ext)) continue;

    // Determine the top-level folder (or "root")
    const parts = file.split(path.sep);
    const folderKey = parts.length > 1 ? parts[0]! : 'root';

    try {
      const content = await fs.readFile(absPath, 'utf-8');

      if (!result[folderKey]) {
        result[folderKey] = [];
      }
      result[folderKey]!.push({ relativePath: file, content });
    } catch {
      // Skip unreadable files
    }
  }

  return result;
}

/**
 * Get all files from a FolderScanResult as a flat list.
 */
export function getAllFiles(scan: FolderScanResult): FileEntry[] {
  return Object.values(scan).flat();
}

/**
 * Filter a scan result to only include specific targets.
 * Targets can be top-level folder names, subfolder paths, or file paths.
 */
export function filterByTargets(
  scan: FolderScanResult,
  targets: string[]
): FolderScanResult {
  const filtered: FolderScanResult = {};

  for (const target of targets) {
    const normalizedTarget = target.replace(/\/$/, ''); // remove trailing slash

    // 1. Exact top-level folder match
    if (scan[normalizedTarget]) {
      filtered[normalizedTarget] = scan[normalizedTarget]!;
      continue;
    }

    // 2. Subfolder or file match — search across all folders
    for (const [folder, files] of Object.entries(scan)) {
      const matching = files.filter((f) => {
        // Match if the file path starts with the target (subfolder)
        // or equals the target (exact file)
        return (
          f.relativePath === normalizedTarget ||
          f.relativePath.startsWith(normalizedTarget + '/')
        );
      });

      if (matching.length > 0) {
        // Use the target as the key for the output file name
        const key = normalizedTarget.replace(/\//g, '-');
        if (!filtered[key]) {
          filtered[key] = [];
        }
        filtered[key]!.push(...matching);
      }
    }
  }

  return filtered;
}
