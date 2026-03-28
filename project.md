# DevMem

## Idea
DevMem is a CLI tool that scans a codebase and generates **persistent, domain-specific context files** (frontend, backend, shared) that can be used with any AI tool.

Instead of re-explaining projects, developers reuse these context files to give AI full understanding instantly.

## Core Principle
Preserve project context in **separate, reusable files** that map to how developers think:
- frontend
- backend
- shared

## Key Features
- Generate:
  - frontend.md
  - backend.md
  - shared.md
- Context is:
  - structured
  - compressed
  - AI-ready
- Works across all AI tools (ChatGPT, Claude, Gemini)

## File Structure

.dev/
- frontend.md → UI, design, component patterns
- backend.md → architecture, APIs, DB patterns
- shared.md → project overview, decisions, constraints

## Tech Stack

### Core
- Node.js
- TypeScript

### CLI
- Commander / Yargs

### Parsing
- fs + glob
- ts-morph / Babel (AST)

### AI Layer
- OpenAI / Anthropic / Gemini APIs
- Used for summarization + structuring

## Philosophy
- Not an AI assistant
- Not an agent
- A **context preservation layer for developers**

## Goal
Eliminate re-explaining projects to AI by maintaining clean, reusable context files.