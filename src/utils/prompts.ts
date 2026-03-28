export const SYSTEM_PROMPT = `You are DevMem, a context extraction engine. Your job is to analyze source code and produce structured, concise, AI-ready context documentation.

Rules:
- Include only high-signal information: architecture, patterns, structure, conventions
- Preserve actual project decisions — do not assume or generalize beyond the codebase
- Optimize for AI usage: concise, structured, no fluff
- Prefer bullet points
- Keep output concise enough to fit in an LLM context window
- Do NOT generate code
- Do NOT hallucinate missing details
- Do NOT include low-value information`;

/**
 * Build a context-generation prompt for a specific folder/target.
 */
export function buildFolderPrompt(folderName: string): string {
  return `Analyze the following source files from the "${folderName}" part of the project and generate a structured context document.

Include:
- Tech stack and frameworks used in this area
- Folder structure overview
- Key patterns and conventions
- Important modules/components and their responsibilities
- How this area connects to other parts of the project
- Any notable design decisions or constraints

Avoid:
- Trivial descriptions
- Listing every single file
- Generic explanations not specific to this codebase

Output a clean markdown document titled "# ${capitalize(folderName)} Context".`;
}

/**
 * Build a prompt that provides full project context but asks to generate
 * documentation only for a specific target (folder, subfolder, or file).
 */
export function buildTargetedPrompt(targetName: string): string {
  return `You are given the FULL project source code for context. However, generate documentation ONLY for the "${targetName}" part of the project.

Use the full codebase to understand relationships, dependencies, imports, and how this area fits into the bigger picture, but ONLY document "${targetName}".

Include:
- Tech stack and frameworks used in this specific area
- Structure overview
- Key patterns and conventions
- Important modules/components and their responsibilities
- How this area connects to other parts of the project
- Dependencies and relationships with other parts of the codebase

Avoid:
- Documenting parts of the project outside "${targetName}"
- Trivial descriptions
- Generic explanations not specific to this codebase

Output a clean markdown document titled "# ${capitalize(targetName)} Context".`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
