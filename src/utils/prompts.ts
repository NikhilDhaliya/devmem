export const SYSTEM_PROMPT = `You are DevMem, a context extraction engine. Your job is to analyze source code and produce structured, high-density, AI-ready context documentation.

Core Objectives:
1. Capture Static Architecture: Folders, components, dependencies, and tech stack.
2. Capture Dynamic Behavior: Execution flows, runtime events, and state transitions.
3. Capture Data Relationships: How entities and data structures interact.

Rules:
- Include only high-signal information.
- Optimize for AI agents: concise, structured, and descriptive.
- Use Mermaid diagrams (sequenceDiagram, stateDiagram-v2, erDiagram) to visualize complex flows or relationships.
- Document "lifecycles" of key events (e.g., how a request or background job moves through the system).
- Identify and explain state-machine logic (e.g., status enums and their transition rules).
- Do NOT generate code; summarize logic.
- Do NOT hallucinate missing details.`;

/**
 * Build a context-generation prompt for a specific folder/target.
 */
export function buildFolderPrompt(folderName: string): string {
  return `Analyze the source files from the "${folderName}" directory and generate a high-density context document.

Focus on:
1.  **Core Responsibilities**: What is the primary purpose of this area?
2.  **Runtime Flows**: Step-by-step execution for key events/actions (e.g., "When X happens, A calls B, then C updates D").
3.  **State Transitions**: If there are status fields or state-machine logic, document the valid states and transition triggers.
4.  **Key Patterns**: Conventions, design decisions, and architectural choices.
5.  **Data Relationships**: How modules here relate to each other and external data.
6.  **Visuals**: Use Mermaid diagrams where they significantly improve clarity for complex logic.

Output a clean markdown document titled "# ${capitalize(folderName)} Context".`;
}

/**
 * Build a prompt that provides full project context but asks to generate
 * documentation only for a specific target (folder, subfolder, or file).
 */
export function buildTargetedPrompt(targetName: string): string {
  return `You are given the FULL project source code for context. However, generate documentation ONLY for the "${targetName}" part.

Use the full codebase to understand deep relationships, imports, and cross-module execution flows, but focus your documentation on "${targetName}".

Include:
1.  **Integration Flow**: How does data enter and leave this area? Map the step-by-step lifecycle of a typical interaction.
2.  **Logic & State**: Document internal state-machine logic, status transitions, and business rules.
3.  **Component Breakdown**: Responsibilities of key files/modules and their inter-dependencies.
4.  **Cross-Module Impact**: How changes here affect the rest of the system.
5.  **Visual Context**: Use Mermaid diagrams for complex interactions or data models.

Output a clean markdown document titled "# ${capitalize(targetName)} Context".`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
