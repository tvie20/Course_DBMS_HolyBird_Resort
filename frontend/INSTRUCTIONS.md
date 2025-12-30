# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# 📂 Create project

1. npm create vite@latest

2. npm i

3. npm install tailwindcss @tailwincss/vite

4. `vite.config.js`

import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [react(), tailwindcss()]
})

5. `index.css`

@import "tailwindcss";

6. npm i react-hook-form

7. npm i zod @hookform/resolvers

# 📂 React Project Architecture & Best Practices

This document outlines the project structure, organizational patterns, and naming conventions used in this application. Following these guidelines ensures the codebase remains scalable, maintainable, and consistent across the team.

## 🏗 High-Level Structure

We follow a **Functionality-First** approach, separating logic (hooks/services) from presentation (components/pages).

root/
├── public/                 # Static assets (favicon, robots.txt, etc.)
├── src/
│   ├── assets/             # Media files (images, fonts) and global styles
│   ├── components/         # Shared/Global UI Components (Dumb Components)
│   ├── config/             # Environment variables and app constants
│   ├── hooks/              # Custom React Hooks (Reusable logic)
│   ├── layouts/            # Page layouts (e.g., AuthLayout, DashboardLayout)
│   ├── pages/              # Page views (Route components)
│   ├── services/           # API and Network logic
│   ├── stores/             # Global State Management (Redux/Context/Zustand)
│   ├── utils/              # Pure utility functions (Non-React logic)
│   ├── App.jsx             # Root Component
│   └── main.jsx            # Application Entry Point
└── ...config files         # (vite.config, package.json, etc.)

# 📘 React Development Guidelines

This document serves as the standard reference for the project structure, naming conventions, and best practices. All contributors should follow these guidelines to maintain code quality and consistency.

## 📂 1. Directory Details

We adhere to a **Feature-First** and **Separation of Concerns** architecture.

### `src/assets/`
Storage for static assets that are imported directly into JavaScript/CSS files.
* **Contains:** Images, Icons (SVGs), Fonts, and Global Styles (Reset CSS, Variables).
* **Note:** These files are processed by the bundler (Vite/Webpack) for optimization.

### `src/components/` (Shared UI)
Contains global, reusable UI elements that are **agnostic** to the business logic of specific pages.
* **Type:** Mostly "Dumb" or "Presentational" components.
* **Structure:**
    * Simple components: `Button.jsx`
    * Complex components: Folder `Button/` containing `index.js`, `Button.jsx`, and `Button.styles.css`.

### `src/pages/` (Views)
Contains the main views corresponding to the application routes.
* **Responsibility:** These components act as "Containers". They fetch data, connect to the store, and pass props down to child components.
* **Mapping:** Usually 1-to-1 mapping with `react-router` paths.

### `src/layouts/`
Contains Higher-Order Components (HOCs) or wrappers that define the structural scaffolding of the page.
* **Examples:** `MainLayout` (Sidebar + Header), `AuthLayout` (Centered Box).

### `src/services/` (API Layer)
Isolates all HTTP requests and API configurations. **No direct fetch/axios calls allowed in components.**
* **Benefit:** Allows changing the API library or base URL in one place without breaking the UI.

### `src/hooks/`
Contains custom React Hooks to abstract stateful logic from UI components.
* **Rule:** Files must strictly follow the `use[Name].js` naming pattern.

### `src/utils/` (Helpers)
Contains pure JavaScript functions for data processing.
* **Constraint:** Files here should **not** contain JSX or React-specific imports (like `useState`).
* **Usage:** Formatting dates, regex validation, currency calculation.

### `src/stores/` (State Management)
Contains the global state logic (Redux Slices, Zustand Stores, or Context Providers).
* **Usage:** For data shared across multiple distinct features (e.g., `UserSession`, `ThemeMode`, `ShoppingCart`).

### `src/config/`
Centralized configuration constants.
* **Contains:** Environment variables, Route paths, API constants, Third-party keys.

---

## 📏 2. Naming Conventions

Consistency in naming is critical for maintainability.

### File & Folder Naming

+--------------------+-----------------------------+-------------------------------------+
| Type               | Case Style                  | Examples                            |
+--------------------+-----------------------------+-------------------------------------+
| :---               | :---                        | :---                                |
| **Components**     | `PascalCase`                | `PrimaryButton.jsx`, `UserProfile/` |
| **Hooks**          | `camelCase` (prefix `use`)  | `useAuth.js`, `useWindowSize.js`    |
| **Utils/Services** | `camelCase`                 | `apiClient.js`, `formatDate.js`     |
| **Styles**         | `PascalCase` or `camelCase` | `Header.css`, `headerStyles.css`    |
| **Tests**          | Same as target + `.test`    | `Button.test.js`, `utils.test.js`   |
+--------------------+-----------------------------+-------------------------------------+

### Code Naming

+--------------------+------------------------------+--------------------------------------+
| Entity             | Convention                   | Example                              |
+--------------------+------------------------------+--------------------------------------+
| :---               | :---                         | :---                                 |
| **Component Name** | `PascalCase`                 | `const UserCard = () => {}`          |
| **Prop Names**     | `camelCase`                  | `onClick`, `isLoading`, `userAvatar` |
| **Boolean Props**  | Prefix `is`, `has`, `should` | `isVisible`, `hasError`, `canEdit`   |
| **Event Handlers** | Prefix `handle`              | `handleSubmit`, `handleInputChange`  |
| **Prop Callback**  | Prefix `on`                  | `onClick`, `onSubmitSuccess`         |
| **Constants**      | `UPPER_SNAKE_CASE`           | `MAX_ITEMS_PER_PAGE`, `API_BASE_URL` |
+--------------------+------------------------------+--------------------------------------+

---

## 🚀 3. Best Practices

### A. Imports
Always use **Absolute Imports** (Aliases) to avoid messy relative paths.
* ❌ **Avoid:** `import Button from '../../../components/Button';`
* ✅ **Use:** `import Button from '@/components/Button';`

### B. Component Structure
Keep components clean and readable. Use the following order inside a component:
1.  **Imports** (Libraries -> Components -> Assets/Styles)
2.  **Component Definition**
3.  **Hooks** (`useState`, `useEffect`, etc.)
4.  **Helper Functions** (Handlers like `handleClick`)
5.  **Return Statement** (JSX)
6.  **PropTypes / Export**

### C. Logic Separation
* **UI Logic:** If it involves visual state (open/close modal), keep it in the Component.
* **Business Logic:** If it involves data processing or side effects, move it to a **Custom Hook**.
* **Calculations:** If it involves math or string manipulation, move it to **Utils**.

### D. DRY (Don't Repeat Yourself)
* If you copy-paste code **twice**, it's okay.
* If you copy-paste code **three times**, refactor it into a reusable Component, Hook, or Utility function.

### E. Security & Performance
* **Never** commit `.env` files containing real secret keys to Git.
* Use `useMemo` and `useCallback` only when necessary (e.g., strictly for heavy calculations or preventing re-renders of heavy children), do not overuse them prematurely.

---