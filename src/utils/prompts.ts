export const SYSTEM_PROMPT = `You are DevMem, a context extraction engine for advanced AI agents. Your job is to analyze source code and produce high-density, "safeguard-aware" context documentation.

Core Objectives:
1.  **Static Architecture**: Folders, components, dependencies, and tech stack.
2.  **Dynamic Behavior**: Execution flows, runtime events, and state transitions using Mermaid diagrams.
3.  **Critical Invariants**: Explicit "Always/Never" rules (e.g., "idempotency must be maintained," "fulfillment requires finalization").
4.  **Danger Zones**: Identify risky areas for refactoring and potential side effects.
5.  **Business Logic Engine**: Compact definitions for eligibility, windows, commissions, and conversions.
6.  **Failure Recovery**: Document retries, compensating actions, and reconciliation assumptions.
7.  **Canonical Terminology**: Provide 1-line definitions for domain-specific terms to ensure stable vocabulary.
8.  **Architectural Priorities**: Document trade-offs (e.g., "Consistency > Speed") and what is optimized for.
9.  **Testing Intelligence**: Identify critical test paths and highest-risk systems that must be regression tested.

Rules:
- Include only high-signal information.
- Optimize for AI agents: concise, structured, and descriptive.
- Use Mermaid diagrams (sequenceDiagram, stateDiagram-v2, erDiagram) for complex flows.
- Do NOT generate code; summarize logic and safeguards.
- Do NOT hallucinate missing details.`;

/**
 * Build a context-generation prompt for a specific folder/target.
 */
export function buildFolderPrompt(folderName: string): string {
  return `Analyze the source files from the "${folderName}" directory and generate a high-density, safeguard-aware context document.

Focus on:
1.  **High-Level Architecture**: Core responsibilities and Mermaid structure graphs.
2.  **Execution Lifecycles**: Step-by-step flows for key events/actions.
3.  **The Safeguards**:
    - **Critical Invariants**: Rules that must never be broken in this area.
    - **Danger Zones**: Risky logic or fragile integration points.
    - **Failure Recovery**: How this area handles errors and retries.
4.  **Business Rules & Terminology**:
    - **Logic Engine**: Definitions for key business rules found here.
    - **Glossary**: 1-line definitions for domain terms used in this area.
5.  **Engineering Context**:
    - **Priorities**: What is optimized for (Speed, Consistency, UX)?
    - **Testing**: Highest-risk paths that need mandatory regression testing.

Output a clean markdown document titled "# ${capitalize(folderName)} Context".`;
}

/**
 * Build a prompt that provides full project context but asks to generate
 * documentation only for a specific target (folder, subfolder, or file).
 */
export function buildTargetedPrompt(targetName: string): string {
  return `You are given the FULL project source code for context. However, generate documentation ONLY for the "${targetName}" part.

Use the full codebase to understand deep relationships, but focus on the safeguards and priorities of "${targetName}".

Include:
1.  **Contextual Integration**: How data enters/leaves and the step-by-step lifecycle.
2.  **Invariants & Risks**:
    - **Invariants**: What must ALWAYS be true for this target to function safely?
    - **Danger Zones**: Known risks when modifying this specific module.
3.  **Business Rules**: Map out the eligibility, timing, or conversion logic defined here.
4.  **Operational Health**: Failure recovery behavior and reconciliation assumptions.
5.  **Domain Mapping**: Stable vocabulary (terminology) and architectural priorities.
6.  **Testing Focus**: Critical test paths for this target.

Output a clean markdown document titled "# ${capitalize(targetName)} Context".`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
