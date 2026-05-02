# Coding Guidelines for CodeRoom

## Tech Stack
- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Real-time: Liveblocks + Yjs
- Editor: Monaco Editor (@monaco-editor/react)
- Backend: Node.js + Express + MongoDB

## Coding Rules
1. **Client Components**: Always use the `'use client'` directive for components using React hooks or browser-only libraries (Monaco, Liveblocks).
2. **Standard Imports**: Use `@/components/...` for imports.
3. **No Legacy Code**: Avoid `pages/` directory logic. Stick to `app/` directory conventions.
4. **Real-time Integrity**: Use Yjs CRDTs for all shared state in the editor to prevent text conflicts.
5. **SEO & Performance**: Use `next/font` for typography and keep the landing page as a Server Component where possible.