# Gemini Context: Migration Assistant

## Project Overview

**Migration Assistant** is a web application designed to guide users through the process of migrating their web projects to production hosting platforms. It features a step-by-step wizard interface that assists with:

1.  **Pre-Migration:** Preparing the project (dependencies, env vars, database).
2.  **GitHub Setup:** initializing git, creating repositories, and pushing code.
3.  **Platform Selection:** Choosing a hosting provider (Vercel, Netlify, Render, GitHub Pages).
4.  **Deployment:** Configuring and deploying the application.

## Key Technologies

*   **Frontend Framework:** React 18
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui (Radix UI primitives)
*   **Routing:** React Router DOM
*   **Animations:** Framer Motion
*   **State Management/Data Fetching:** Tanstack Query
*   **Testing:** Vitest, React Testing Library

## Building and Running

The project is managed via `npm`.

### Core Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server. |
| `npm run build` | Builds the application for production. |
| `npm run preview` | Previews the production build locally. |
| `npm run test` | Runs the test suite (Vitest). |
| `npm run test:watch` | Runs tests in watch mode. |
| `npm run lint` | Runs ESLint to check for code quality issues. |

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/          # Reusable UI components (shadcn/ui)
│   │   └── wizard/      # Components specific to the migration wizard feature
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and shared logic (e.g., utils.ts)
│   ├── pages/           # Application pages (routes)
│   ├── test/            # Test setup and examples
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Entry point
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── vitest.config.ts     # Vitest configuration
```

## Development Conventions

*   **Component Library:** This project uses `shadcn/ui`. New UI components should generally be added to `src/components/ui`.
*   **Styling:** Use Tailwind CSS utility classes. Avoid custom CSS files where possible, preferring utility classes or `class-variance-authority` for component variants.
*   **Testing:** Tests are written using Vitest. Place test files alongside components or in the `test/` directory.
*   **Routing:** `react-router-dom` is used for client-side routing. Routes are defined in `src/App.tsx`.
