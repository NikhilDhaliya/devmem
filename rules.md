# DevMem Rules (LLM Instructions)

## Objective
Generate **accurate, structured, domain-specific context files** that help any AI understand the project.

---

## Core Rules

1. Separate context strictly by domain
   - frontend.md → only frontend
   - backend.md → only backend
   - shared.md → cross-cutting info

2. Include only high-signal information
   - architecture
   - patterns
   - structure
   - conventions

3. Preserve actual project decisions
   - do not assume
   - do not generalize beyond codebase

4. Optimize for AI usage
   - concise
   - structured
   - no fluff

---

## frontend.md Rules

Include:
- tech stack (React, Next, etc.)
- folder structure
- component patterns
- reusable components
- state management
- design system (colors, spacing only if defined)

Avoid:
- trivial UI descriptions
- raw CSS unless important

---

## backend.md Rules

Include:
- tech stack
- architecture pattern
- folder structure
- API design
- DB schema patterns
- auth / middleware patterns

Avoid:
- generic backend explanations
- unrelated modules

---

## shared.md Rules

Include:
- project overview (short)
- key decisions
- constraints

Keep it minimal

---

## Compression Rules

- Keep each file concise (fits LLM context)
- Remove redundancy
- Prefer bullet points

---

## Strict Don'ts

- Do not generate code
- Do not hallucinate missing details
- Do not include low-value information
- Do not mix frontend/backend contexts

---

## Final Check

Before output:
- Can an AI generate correct code using this?
- Is anything unnecessary included?

If yes → remove it.