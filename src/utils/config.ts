import fs from 'fs-extra';
import path from 'path';
import os from 'os';

export interface DevMemConfig {
  provider: 'gemini' | 'openai' | 'anthropic';
  apiKey: string;
  model: string;
}

const CONFIG_DIR = path.join(os.homedir(), '.devmem');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export function getConfigPath(): string {
  return CONFIG_FILE;
}


export async function loadConfig(): Promise<DevMemConfig> {
  const exists = await fs.pathExists(CONFIG_FILE);
  if (!exists) {
    throw new Error(
      'DevMem is not configured yet. Run `devmem setup` first.'
    );
  }

  const raw = await fs.readJSON(CONFIG_FILE);

  if (!raw.provider || !raw.apiKey) {
    throw new Error(
      'Invalid config. Run `devmem setup` to reconfigure.'
    );
  }

  return raw as DevMemConfig;
}

export async function saveConfig(config: DevMemConfig): Promise<void> {
  await fs.ensureDir(CONFIG_DIR);
  await fs.writeJSON(CONFIG_FILE, config, { spaces: 2 });
}

export async function removeConfig(): Promise<void> {
  await fs.remove(CONFIG_FILE);
}

export function maskKey(key: string): string {
  if (key.length <= 8) return '****';
  return key.slice(0, 4) + '...' + key.slice(-4);
}

export const DEFAULT_MODELS: Record<string, string> = {
  gemini: 'gemini-2.0-flash',
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-haiku-latest',
};
