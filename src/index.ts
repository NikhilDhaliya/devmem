#!/usr/bin/env node

import { Command } from 'commander';
import { registerSetupCommand } from './commands/setup.js';
import { registerGenerateCommand } from './commands/generate.js';

const program = new Command();

program
  .name('devmem')
  .description('Generate persistent, domain-specific context files for AI tools')
  .version('1.0.0');

registerSetupCommand(program);
registerGenerateCommand(program);

program.parse();
