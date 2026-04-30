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

## Available Scripts

-   `pnpm dev` - Start development server with Node.js inspector
-   `pnpm build` - Build the application for production
-   `pnpm start` - Start production server
-   `pnpm lint` - Run ESLint
-   `pnpm format` - Format code with Prettier
-   `pnpm test` - Run build as a test
-   `pnpm docker` - Build and run Docker container for production
-   `pnpm docker:dev` - Build and run Docker container for development

## Project Structure

```
src/
  app/              # Next.js App Router
  pages/            # Pages directory (if using Pages Router)
  shared/           # Shared utilities and libraries
    lib/            # Utility libraries
      sanMartinApi/ # Auto-generated API client
  features/         # Feature modules (FSD architecture)
  entities/         # Business entities
  widgets/          # UI widgets
```

## Architecture

This project follows the **Feature-Sliced Design (FSD)** methodology:

-   **app/** - Application setup and routing
-   **shared/** - Cross-cutting concerns and utilities
-   **entities/** - Business entities and data models
-   **features/** - User-facing features
-   **widgets/** - Composite UI components

## Tech Stack Details

### Core Framework

-   **Next.js 15**: React framework with App Router support
-   **React 19**: Latest React version with concurrent features
-   **TypeScript**: Type-safe development

### Styling & UI

-   **Tailwind CSS**: Utility-first CSS framework
-   **Headless UI**: Unstyled, accessible UI components
-   **Heroicons**: SVG icon library

### State & Data Management

-   **Zustand**: Lightweight state management
-   **React Hook Form**: Form state management
-   **Zod**: Schema validation
-   **SWR**: Data fetching (if used)

### Development Tools

-   **ESLint**: Code linting
-   **Prettier**: Code formatting
-   **TypeScript**: Static type checking

## License

This project is private and proprietary.
