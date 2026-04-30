# Admin Panel for SM Bakery House

A modern admin panel built with Next.js, featuring SSR (Server-Side Rendering) and FSD (Feature-Sliced Design) architecture for managing SM Bakery House operations.

## Features

-   **Modern Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS
-   **Feature-Sliced Design**: Clean and scalable architecture
-   **Server-Side Rendering**: Optimized for performance and SEO
-   **Internationalization**: Multi-language support with next-intl
-   **Form Management**: React Hook Form with Zod validation
-   **State Management**: Zustand for global state
-   **API Integration**: Auto-generated TypeScript clients from Swagger/OpenAPI
-   **Real-time Updates**: Socket.io integration
-   **Maps Integration**: Google Maps integration via @vis.gl/react-google-maps
-   **UI Components**: Headless UI and Heroicons
-   **Toast Notifications**: React Toastify for user feedback

## Demo

![San Martin Admin Panel](./Monosnap%20San%20Martin%20Admin%20Panel%202026-04-09%2015-55-47.png)

## Prerequisites

-   Node.js (v20 max)
-   pnpm package manager

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory (copy from `.env` if available):

```env
# Add your environment variables here
```

### 3. Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### 4. Generate API Client (Optional)

For development with local API:

```bash
pnpm libgen:dev
```

For production API:

```bash
pnpm libgen
```

## Architecture

This project follows the **Feature-Sliced Design (FSD)** methodology:

```
src/
  app/              # Next.js App Router
  actions/          # Server-side actions
  i18n/             # Internationalization setup and translations
  shared/           # Cross-cutting concerns and utilities
    lib/            # Utility libraries
      sanMartinApi/ # Auto-generated API client
    hooks/          # Custom React hooks
    ui/             # Shared UI components (FSD)
    types/          # Shared TypeScript types
    utils/          # Utility functions
  entities/         # Business entities and data models (FSD)
  features/         # User-facing features (FSD)
  widgets/          # Composite UI components (FSD)
```
