# DevMem

> Generate persistent, domain-specific context files for AI tools.

DevMem scans your codebase and generates structured context files that any AI tool can use to instantly understand your project - no more re-explaining.

---

##  Features

- **Folder-aware output** — generates one `.md` per top-level folder, named to match your project structure
- **Targeted generation** — generate context for a specific folder, subfolder, or file with `--only`
- **Multi-provider AI** — supports Gemini, OpenAI, and Anthropic
- **Smart scanning** — ignores `node_modules`, binaries, lockfiles, and respects size limits
- **AI-optimized output** — concise, structured, bullet-point context that fits in LLM context windows

---

##  Installation

```bash
# Clone and install
git clone https://github.com/NikhilDhaliya/devmem.git
cd devmem
npm install
npm run build
npm link
```

---

##  Usage

### 1. Setup your AI provider

```bash
devmem setup
```

Choose between **Gemini**, **OpenAI**, or **Anthropic**, enter your API key, and optionally pick a model.

```bash
# View current config
devmem setup --show

# Remove config and API key
devmem setup --remove
```

### 2. Generate context

Navigate to any project and run:

```bash
devmem generate
```

This scans your project and creates `.dev/<folder>.md` for each top-level folder:

```
my-app/
├── client/       →  .dev/client.md
├── server/       →  .dev/server.md
├── shared/       →  .dev/shared.md
├── package.json  →  .dev/root.md
```

### 3. Targeted generation

Generate context for specific parts of your project:

```bash
# Single folder
devmem generate --only client

# Multiple folders
devmem generate --only "client,server"

# Subfolder or feature
devmem generate --only src/auth

# Specific file
devmem generate --only src/utils/db.ts
```

> **Note:** Even with `--only`, DevMem sends the **full project** to the AI so it understands the complete picture, but generates documentation only for the targeted area.

### 4. Custom output directory

```bash
devmem generate -o context/
```

---

##  Configuration

Config is stored in `~/.devmem/config.json`:

```json
{
  "provider": "gemini",
  "apiKey": "your-api-key",
  "model": "gemini-2.0-flash"
}
```

### Default models

| Provider  | Default Model            |
|-----------|--------------------------|
| Gemini    | `gemini-2.0-flash`       |
| OpenAI    | `gpt-4o-mini`            |
| Anthropic | `claude-3-5-haiku-latest` |

---

##  Philosophy

DevMem is **not** an AI assistant or agent. It's a **context preservation layer** for developers:

- Scan once, reuse everywhere
- Works with ChatGPT, Claude, Gemini, or any AI tool
- Structured, compressed, AI-ready context
- No fluff, no generic explanations

---

##  Project Structure

```
devmem/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── commands/
│   │   ├── setup.ts           # Interactive provider config
│   │   └── generate.ts        # Scan + AI context generation
│   └── utils/
│       ├── config.ts           # ~/.devmem/config.json management
│       ├── scanner.ts          # File discovery & folder grouping
│       ├── ai.ts               # Multi-provider AI client
│       └── prompts.ts          # Dynamic prompt generation
├── package.json
├── tsconfig.json
└── README.md
```

---

## License

MIT
