import { Command } from 'commander';
import readline from 'readline';
import pc from 'picocolors';
import { saveConfig, loadConfig, maskKey, DEFAULT_MODELS, type DevMemConfig } from '../utils/config.js';

function createRL(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function ask(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

export function registerSetupCommand(program: Command): void {
  program
    .command('setup')
    .description('Configure your AI provider and API key')
    .option('--show', 'Show current configuration')
    .option('--remove', 'Remove current configuration and API key')
    .action(async (options) => {
      if (options.remove) {
        try {
          await import('../utils/config.js').then(m => m.removeConfig());
          console.log(pc.green('\n  ✓ Configuration and API key removed successfully.\n'));
        } catch (err: any) {
          console.log(pc.red(`\n  ✗ Failed to remove configuration: ${err.message}\n`));
        }
        return;
      }

      if (options.show) {
        try {
          const config = await loadConfig();
          console.log();
          console.log(pc.bold('  DevMem Configuration'));
          console.log(pc.dim('  ─────────────────────'));
          console.log(`  Provider : ${pc.cyan(config.provider)}`);
          console.log(`  Model    : ${pc.cyan(config.model)}`);
          console.log(`  API Key  : ${pc.yellow(maskKey(config.apiKey))}`);
          console.log();
        } catch {
          console.log(pc.red('\n  ✗ No configuration found. Run `devmem setup` first.\n'));
        }
        return;
      }

      const rl = createRL();

      try {
        console.log();
        console.log(pc.bold('  🧠 DevMem Setup'));
        console.log(pc.dim('  ─────────────────'));
        console.log();

        // 1. Choose provider
        console.log(pc.dim('  Available providers:'));
        console.log(`    ${pc.cyan('1')} — Gemini`);
        console.log(`    ${pc.cyan('2')} — OpenAI`);
        console.log(`    ${pc.cyan('3')} — Anthropic`);
        console.log();

        let providerChoice = '';
        while (!['1', '2', '3'].includes(providerChoice)) {
          providerChoice = await ask(rl, pc.bold('  Select provider (1/2/3): '));
        }

        const providerMap: Record<string, DevMemConfig['provider']> = {
          '1': 'gemini',
          '2': 'openai',
          '3': 'anthropic',
        };
        const provider = providerMap[providerChoice]!;

        // 2. Enter API key
        console.log();
        const apiKey = await ask(rl, pc.bold(`  Enter your ${provider} API key: `));
        if (!apiKey) {
          console.log(pc.red('\n  ✗ API key cannot be empty.\n'));
          rl.close();
          return;
        }

        // 3. Choose model
        const defaultModel = DEFAULT_MODELS[provider]!;
        console.log();
        const modelInput = await ask(
          rl,
          pc.bold(`  Model ${pc.dim(`(default: ${defaultModel})`)}: `)
        );
        const model = modelInput || defaultModel;

        // Save
        const config: DevMemConfig = { provider, apiKey, model };
        await saveConfig(config);

        console.log();
        console.log(pc.green('  ✓ Configuration saved!'));
        console.log(pc.dim(`  Provider: ${provider} | Model: ${model}`));
        console.log();
      } finally {
        rl.close();
      }
    });
}
