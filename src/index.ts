#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { registerSetupCommand } from './commands/setup.js';
import { registerGenerateCommand } from './commands/generate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

const program = new Command();

program
  .name('devmem')
  .description('Generate persistent, domain-specific context files for AI tools')
  .version(pkg.version);

registerSetupCommand(program);
registerGenerateCommand(program);

program.parse();
