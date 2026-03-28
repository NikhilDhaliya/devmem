# DevMem

> Stop re-explaining your codebase to AI. Turn it into context that actually works.

We’ve all been there: you open ChatGPT or Claude, and then spend 10 minutes copying and pasting files just so it understands what you’re working on. **DevMem** exists to skip that part.

It scans your project, understands your folder structure, and feeds it to an LLM to generate clean, high-density context files. One command, and you have exactly what you need to give any AI the full picture of your app.

---

##  Why DevMem?

- **Zero Friction**: No manual copying. Just `devmem generate`.
- **Folder-Smart**: It knows your `client` is different from your `server`. It gives you separate, organized context for each.
- **AI-Ready**: The output isn't just a code dump; it’s optimized for LLMs to consume efficiently.
- **Privacy First**: Everything runs locally. Your keys, your code, your control.

---

##  Quick Start

### 1. Install it

**Using npm (Recommended)**
```bash
npm install -g devmem
```

**From Source**
```bash
git clone https://github.com/NikhilDhaliya/devmem.git
cd devmem
npm install
npm run build
npm link
```

### 2. Connect your AI
```bash
devmem setup
```
Pick your favorite—**Gemini, OpenAI, or Anthropic**. Pop in your API key, choose a model, and you're good to go.

---

##  Usage

### The Magic Command
Navigate to your project (any project!) and run:

```bash
devmem generate
```

**What happens next?**
DevMem scans your files (smartly ignoring the junk like `node_modules`), groups them by top-level folders, and creates a `.dev/` directory for you:

```text
my-app/
├── client/       →  .dev/client.md   (Frontend context)
├── server/       →  .dev/server.md   (Backend context)
├── shared/       →  .dev/shared.md   (Models & types)
└── package.json  →  .dev/root.md     (The big picture)
```

Now, whenever you start a new chat with an AI, just drop those `.md` files in. **Instantly ready.**

### Need something specific?
If you're only working on the auth system, don't waste context space. Just target what you need:

```bash
# Just the client
devmem generate --only client

# Just one specific file
devmem generate --only src/utils/db.ts
```

---

##  Configuration

Your settings live in `~/.devmem/config.json`. You can always check or reset them:

```bash
devmem setup --show    # See what's currently set
devmem setup --remove  # Start fresh
```

### Supported Models
| Provider  | Default Model (The fast, cheap, smart ones) |
|-----------|--------------------------------------------|
| Gemini    | `gemini-2.0-flash`                         |
| OpenAI    | `gpt-4o-mini`                              |
| Anthropic | `claude-3-5-haiku-latest`                  |

---

##  Project Structure

Here is how DevMem looks under the hood:

```text
devmem/
├── src/
│   ├── index.ts        # The CLI front door
│   ├── commands/       # setup & generate logic
│   └── utils/          # The engine (scanning, AI clients, prompts)
├── package.json
└── README.md
```

---

## License

MIT. Go wild.
