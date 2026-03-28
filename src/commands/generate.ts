import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import pc from 'picocolors';
import ora from 'ora';
import { loadConfig } from '../utils/config.js';
import { createAIClient } from '../utils/ai.js';
import {
  scanProjectByFolders,
  getAllFiles,
  filterByTargets,
  type FileEntry,
  type FolderScanResult,
} from '../utils/scanner.js';
import { buildFolderPrompt, buildTargetedPrompt } from '../utils/prompts.js';

function formatFileContents(files: FileEntry[]): string {
  if (files.length === 0) return '';
  return files
    .map((f) => `### ${f.relativePath}\n\`\`\`\n${f.content}\n\`\`\``)
    .join('\n\n');
}

export function registerGenerateCommand(program: Command): void {
  program
    .command('generate')
    .description('Scan codebase and generate context files')
    .option('-o, --output <dir>', 'Output directory', '.dev')
    .option('--only <targets>', 'Generate only for specific folders, subfolders, or files (comma-separated)')
    .action(async (options) => {
      const projectDir = process.cwd();
      const outputDir = path.resolve(projectDir, options.output);

      // Load config
      let config;
      try {
        config = await loadConfig();
      } catch (err: any) {
        console.log(pc.red(`\n  ✗ ${err.message}\n`));
        process.exit(1);
      }

      console.log();
      console.log(pc.bold('  🧠 DevMem Generate'));
      console.log(pc.dim('  ─────────────────────'));
      console.log(pc.dim(`  Provider: ${config.provider} | Model: ${config.model}`));
      console.log();

      // Step 1: Scan full project
      const scanSpinner = ora({ text: '  Scanning project...', indent: 2 }).start();
      const fullScan = await scanProjectByFolders(projectDir);
      const allFiles = getAllFiles(fullScan);
      const folderNames = Object.keys(fullScan);

      if (allFiles.length === 0) {
        scanSpinner.fail('  No relevant files found.');
        console.log(pc.dim('  Make sure you are in the root of a project.\n'));
        return;
      }

      // Determine what to generate
      const isTargeted = !!options.only;
      let targetsToGenerate: FolderScanResult;

      if (isTargeted) {
        const targets = (options.only as string).split(',').map((t: string) => t.trim());
        targetsToGenerate = filterByTargets(fullScan, targets);

        if (Object.keys(targetsToGenerate).length === 0) {
          scanSpinner.fail('  No matching targets found.');
          console.log(pc.dim(`  Available folders: ${folderNames.join(', ')}\n`));
          return;
        }

        const targetKeys = Object.keys(targetsToGenerate);
        const targetFileCount = Object.values(targetsToGenerate).flat().length;
        scanSpinner.succeed(
          `  Found ${pc.cyan(String(allFiles.length))} total files | Targeting: ${targetKeys.map((t) => pc.yellow(t)).join(', ')} (${targetFileCount} files)`
        );
      } else {
        targetsToGenerate = fullScan;
        const folderSummary = folderNames
          .map((f) => `${f}: ${fullScan[f]!.length}`)
          .join(', ');
        scanSpinner.succeed(
          `  Found ${pc.cyan(String(allFiles.length))} files across ${pc.cyan(String(folderNames.length))} folders — ${folderSummary}`
        );
      }

      // Step 2: Generate with AI
      const ai = createAIClient(config);
      await fs.ensureDir(outputDir);

      // Full project context (used for targeted generation)
      const fullContext = formatFileContents(allFiles);

      for (const [folderKey, files] of Object.entries(targetsToGenerate)) {
        const spinner = ora({ text: `  Generating ${pc.cyan(folderKey)} context...`, indent: 2 }).start();

        try {
          let prompt: string;
          let context: string;

          if (isTargeted) {
            // Targeted: send FULL project as context, but prompt asks for specific target only
            prompt = buildTargetedPrompt(folderKey);
            context = fullContext;
          } else {
            // Full scan: send only the folder's files
            prompt = buildFolderPrompt(folderKey);
            context = formatFileContents(files);
          }

          const result = await ai.summarize(prompt, context);
          const outPath = path.join(outputDir, `${folderKey}.md`);
          await fs.writeFile(outPath, result, 'utf-8');
          spinner.succeed(`  ${folderKey} → ${pc.green(path.relative(projectDir, outPath))}`);
        } catch (err: any) {
          spinner.fail(`  ${folderKey} failed: ${err.message}`);
        }
      }

      console.log();
      console.log(pc.green(pc.bold('  ✓ Context files generated!')));
      console.log(pc.dim(`  Output: ${path.relative(projectDir, outputDir)}/\n`));
    });
}
