# Next.js Development Guide

This document serves as a development guide for our Next.js ecommerce application, summarizing key concepts from the official documentation.

## 1. Project Structure and Organization (App Router)

### Top-Level Folders & Files
- **`app/`**: Used for the App Router (modern routing and layouts).
- **`public/`**: Static assets to be served.
- **`src/`**: Optional root folder for application code to keep configuration files at the root separate.
- **Configuration Files**: Include `next.config.js`, `package.json`, `.env` (and variants), `tsconfig.json`, `eslint.config.mjs`, etc.

### Routing Conventions
- Routes are defined by folders nested inside the `app/` directory.
- A route is only public if it contains a `page.js/tsx` or `route.js/ts` file.
- **Special Files**:
  - `page.tsx`: Defines the unique UI of a route.
  - `layout.tsx`: Shared UI that wraps child segments.
  - `loading.tsx`: Loading UI (React Suspense fallback).
  - `error.tsx` / `global-error.tsx`: Error boundaries.
  - `not-found.tsx`: Not found UI.
  - `route.ts`: API endpoint.

### Advanced Routing
- **Dynamic Routes**: Use square brackets, e.g., `[slug]` (single), `[...slug]` (catch-all), `[[...slug]]` (optional catch-all).
- **Route Groups**: Use parentheses, e.g., `(shop)`. Organizes routes without affecting the URL path. Useful for multiple root layouts or applying layouts to specific segments.
- **Private Folders**: Prefix with an underscore, e.g., `_components`. Opts the folder out of routing entirely.
- **Parallel Routes**: Use `@folder`. Renders named slots (e.g., sidebars).
- **Intercepting Routes**: Use `(.)folder`, `(..)folder`, etc. Loads a route within the current layout (e.g., modals).

### Colocation Strategies
Next.js supports colocating project files (components, libs, tests) safely within the `app` directory since only specific files (`page`, `route`) are routable. Common strategies include:
- Storing project files outside `app` (e.g., in `components/`, `lib/`).
- Storing project files in top-level folders inside `app`.
- Splitting project files by feature alongside their routes.

### Metadata Conventions
Next.js supports special files for SEO and metadata:
- `favicon.ico`, `icon.tsx`, `apple-icon.tsx` for icons.
- `opengraph-image.tsx`, `twitter-image.tsx` for social cards.
- `sitemap.ts`, `robots.ts` for search engine crawlers.

## 2. Layouts and Pages

### Pages
- A **page** is UI rendered on a specific route.
- Created by default exporting a React component from a `page.tsx` file.

### Layouts
- A **layout** is UI shared between multiple pages. It preserves state, remains interactive, and does not rerender on navigation.
- Created by default exporting a React component from a `layout.tsx` file. It must accept a `children` prop.
- **Root Layout**: The layout at the root of the `app` directory is required and must contain `<html>` and `<body>` tags.
- **Nested Layouts**: Layouts defined in nested folders will wrap the layouts or pages inside their child route segments.

### Dynamic Segments
- Used to create routes from data. Created by wrapping a folder name in square brackets (e.g., `[slug]`).
- Values from dynamic segments are passed to pages and layouts via the `params` prop, which is a Promise (e.g., `const { slug } = await params`).

### Search Parameters
- **Server Components**: Access via the `searchParams` prop in a page component (which is a Promise). Using this opts the page into dynamic rendering. Use this when you need search parameters to load data from a database (e.g., pagination).
- **Client Components**: Access via the `useSearchParams` hook. Use this for client-side interactions (e.g., filtering a list already loaded via props).

### Navigation
- **`<Link>` Component**: The primary way to navigate between routes. It extends the HTML `<a>` tag to provide prefetching and fast client-side navigation. Import from `next/link`.
- **`useRouter` Hook**: For advanced programmatic navigation.

### Route Props Helpers
- Next.js provides global utility types (`PageProps` and `LayoutProps`) that infer `params` and named slots from your route structure automatically.
- No imports are required; types are generated during development (`next dev`), build (`next build`), or `next typegen`.

## 3. Linking and Navigating

### How Navigation Works
- **Server Rendering**: Next.js Pages and Layouts are React Server Components by default. The payload is generated on the server (either Prerendered or Dynamically Rendered).
- **Prefetching**: Routes linked with the `<Link>` component are automatically prefetched in the background when they enter the viewport. Static routes are fully prefetched, while dynamic routes are only partially prefetched if `loading.tsx` is present.
- **Streaming**: Next.js streams dynamic parts of a page as they are ready. Creating a `loading.tsx` file wraps the route in `<Suspense>` to show instant fallback UI while the content loads.
- **Client-Side Transitions**: The `<Link>` component updates the page without a full browser reload, preserving state, shared layouts, and UI.

### Optimizing Navigation
- **`loading.tsx`**: Add `loading.tsx` to dynamic routes to ensure immediate navigation and visual feedback (enables partial prefetching).
- **`generateStaticParams`**: Add this to dynamic segments to ensure they are statically generated at build time rather than falling back to dynamic rendering on request.
- **Slow Networks**: Use the `useLinkStatus` hook from `next/link` to display visual feedback (e.g., a delayed loading spinner) when navigation takes too long.
- **Disabling Prefetching**: Pass `prefetch={false}` to `<Link>` when rendering large lists of links to save resources. You can also implement custom prefetching logic (like prefetching only on hover).

### Native History API
Next.js supports `window.history.pushState` and `window.history.replaceState` for updating the URL without reloading the page. These integrate perfectly with Next.js hooks like `usePathname` and `useSearchParams`.

## 4. Server and Client Components

### When to Use Which?
- **Server Components (Default)**: Use for data fetching, accessing backend resources directly, keeping sensitive data (API keys) on the server, and reducing the client-side JavaScript bundle size.
- **Client Components**: Use when you need state (`useState`), lifecycle effects (`useEffect`), event listeners (`onClick`), browser-only APIs (`window`, `localStorage`), or custom React hooks.

### How They Work
- **Server-Side**: Next.js renders Server Components into a special data format called the **React Server Component Payload (RSC Payload)**.
- **Client-Side**: Next.js uses the HTML to show an immediate, non-interactive preview. It then uses the RSC Payload to reconcile the trees and JavaScript to **hydrate** the Client Components, making the page interactive.

### Using Client Components
- Add the `'use client'` directive at the top of a file to opt into client-side rendering.
- This creates a boundary: all modules imported by this file become part of the client bundle.
- **Optimization Strategy**: Keep `'use client'` components as low in the tree as possible (at the leaves) to minimize the JS bundle size.

### Composition and Interleaving
- **Passing Data**: Server Components can pass data to Client Components via props, but the props must be serializable.
- **Nesting**: You cannot import a Server Component directly into a Client Component. Instead, pass the Server Component as a `children` prop (or another prop) to a Client Component. (e.g., `<Modal><Cart /></Modal>`).
- **Context Providers**: React Context is not supported in Server Components. Wrap your context providers in a Client Component (e.g., `ThemeProvider` with `'use client'`), and then render that provider within your Server Component (like `layout.tsx`).
- **Third-Party Components**: If a third-party component uses client features but lacks the `'use client'` directive, wrap it in your own Client Component before using it in a Server Component.

### Preventing Environment Poisoning
- To prevent accidentally importing server-only code (like database queries or secret keys) into a Client Component, install and import the `server-only` package in those files. This will cause a build-time error if the file is imported on the client.

## 5. Fetching Data

### Server Components
- **Async Components**: Fetch data directly in Server Components using `async`/`await` with the `fetch` API, an ORM, or a database client.
- **Memoization**: Identical `fetch` requests within the same React component tree are automatically memoized, so you can fetch data where you need it without prop drilling.
- **Security**: Database credentials and queries are secure since Server Components do not expose their code to the client bundle.

### Streaming
- To prevent slow data fetches from blocking the entire page load, use streaming.
- **`loading.tsx`**: Creates an instant fallback UI for the route segment, automatically wrapping the `page.tsx` in a `<Suspense>` boundary.
- **`<Suspense>`**: Use React's `<Suspense>` component for granular streaming. It allows parts of the page (like a header) to render immediately while slower components (like a list of items) stream in later.

### Client Components
- **The `use()` API**: You can initiate a data fetch in a Server Component (without awaiting it) and pass the Promise as a prop to a Client Component. Inside the Client Component, unwrap the Promise using React's `use(promise)`.
- **Community Libraries**: Use libraries like SWR or React Query for fetching data directly from the client (e.g., polling, client-side mutations).

### Data Fetching Patterns
- **Sequential Fetching**: When one request depends on the result of another. This can cause waterfalls; mitigate by wrapping dependent components in `<Suspense>`.
- **Parallel Fetching**: When requests do not depend on each other, initiate them simultaneously and await them together using `Promise.all([req1, req2])` to improve performance.
- **Reusing Data with `React.cache`**: For non-`fetch` requests (like ORM queries), wrap the function in `React.cache(async () => {...})` to memoize the result. This prevents duplicate queries if multiple components call the same function during a single request.

## 6. Mutating Data

### Server Functions (Server Actions)
- **Definition**: Asynchronous functions that run on the server to mutate data. When passed to forms or `startTransition`, they are called **Server Actions**.
- **Creation**: Defined by adding the `'use server'` directive at the top of an async function, or at the top of a file to mark all exports as Server Functions.
- **Security**: Server Functions are reachable via direct POST requests from the client. **Always verify authentication and authorization** inside every Server Function.

### Using Server Functions
- **Server Components**: Can be defined inline within the component.
- **Client Components**: Cannot be defined inline. They must be imported from a separate file that uses the `'use server'` directive, or passed to the Client Component as a prop.

### Invoking Server Functions
- **Forms**: Pass the action to a `<form action={myAction}>` or `<button formAction={myAction}>`. The function automatically receives a `FormData` object.
- **Event Handlers**: Invoke them in Client Components using event handlers (like `onClick`), usually by wrapping the call in `startTransition`.
- **`useEffect`**: Invoke them on mount or when dependencies change (e.g., updating view counts).

### Handling State and Feedback
- **Pending States**: Use React's `useActionState` or `useTransition` hooks in Client Components to show loading indicators while the Server Action executes.
- **Revalidating Data**: After mutating data, call `revalidatePath('/path')` or `revalidateTag('tag')` (from `next/cache`) inside the Server Action to clear the cache and fetch fresh data.
- **Redirecting**: Use `redirect('/new-path')` (from `next/navigation`) to navigate the user to a different page after a successful mutation. It throws a control-flow exception, so it should be the last call.
- **Cookies**: Use the `cookies()` API (from `next/headers`) inside a Server Action to get, set, or delete cookies. Modifying a cookie will automatically re-render the current page on the server.

## 7. Caching (with Cache Components)

### Enabling Cache Components
- Enabled by setting `cacheComponents: true` in `next.config.ts`.
- Uses the `'use cache'` directive to cache the return value of async functions and components.

### Usage
- **Data-level**: Add `'use cache'` to an async function fetching data to cache its output.
- **UI-level**: Add `'use cache'` to a component or page to cache the rendered UI.
- Pair `'use cache'` with `cacheLife('duration')` (e.g., `'hours'`) from `next/cache` to set expiration.
- Arguments and variables captured from parent scopes automatically become part of the cache key.

### Streaming Uncached Data
- Do not use `'use cache'` for data that must be fresh on every request.
- Instead, wrap the component reading uncached data in a `<Suspense>` boundary. The fallback UI will be prerendered in the static shell, and the dynamic data will stream in at request time.

### Working with Runtime APIs
- Runtime APIs include `cookies()`, `headers()`, `searchParams`, and dynamic `params`.
- Components accessing these **must** be wrapped in `<Suspense>`.
- Alternatively, you can use `'use cache: private'` to cache runtime data for a user's session, or extract the runtime value (e.g., getting a session ID from a cookie) and pass it as a prop to a cached child component.

### Random Values & Timestamps
- Functions like `Math.random()`, `Date.now()`, or `crypto.randomUUID()` vary per render.
- To generate a unique value per request, call `await connection()` (from `next/server`) before the function and wrap the component in `<Suspense>`.
- To share a random value across users (e.g., a build ID), wrap it in a `'use cache'` component.
- Predictable values (e.g., `fs.readFileSync` for static config) are automatically prerendered.

### Partial Prerendering (PPR)
- **Static Shell**: At build time, Next.js generates a static HTML shell containing static content, `'use cache'` results, and `<Suspense>` fallbacks.
- **Dynamic Content**: Any runtime data inside `<Suspense>` boundaries streams into the shell at request time.
- **Instant Navigation**: The static shell can be served instantly from a CDN.

### Prefetching
- By default, Next.js prefetches the App Shell (static UI and session-agnostic content).
- Using `<Link prefetch={true}>` includes destination-specific `searchParams` and `params`, prefetching relevant cached content before the user clicks.

## 8. Revalidating
Revalidation is the process of updating cached data.
- **Time-based**: Use `cacheLife(duration)` (e.g., `'minutes'`, `'hours'`, or a custom object) inside a `'use cache'` scope to automatically refresh data after a set duration.
- **On-demand**: Invalidating data manually after a mutation.
  - **`cacheTag('tag')`**: Inside a `'use cache'` scope, tag the data so it can be targeted later.
  - **`revalidateTag('tag')`**: Invalidates data using stale-while-revalidate (background refresh). Usable in Server Actions and Route Handlers.
  - **`updateTag('tag')`**: Immediately expires cached data (read-your-own-writes) so the user sees changes instantly. Usable only in Server Actions.
  - **`revalidatePath('/path')`**: Invalidates all cached data for a specific route path. (Tag-based revalidation is preferred for precision).

## 9. Error Handling

### Expected Errors
These occur during normal operation, like form validation or expected API failures.
- **Server Functions**: Do not `throw` errors. Instead, return an error object (e.g., `{ message: 'Failed' }`) and use React's `useActionState` hook in the client to display the error.
- **Server Components**: Check the response (e.g., `!res.ok`) and conditionally return an error UI or call `redirect()`.
- **Not Found**: Call `notFound()` (from `next/navigation`) to trigger the closest `not-found.tsx` UI.

### Uncaught Exceptions
Unexpected bugs that crash the application.
- **Error Boundaries (`error.tsx`)**: Placed in route segments to catch errors in child components and display a fallback UI. Must be a Client Component (`'use client'`).
- **`catchError`**: For component-level granularity, wrap a specific component in `catchError(ErrorFallback)`.
- **Event Handlers**: Error boundaries do not catch errors in event handlers (`onClick`). You must use `try/catch` and `useState` to manually handle these.
- **Global Errors (`global-error.tsx`)**: Placed at the root. It replaces the root layout when an error occurs, so it must define its own `<html>` and `<body>` tags.

## 10. Image Optimization
The Next.js `<Image>` component (`next/image`) automatically sizes images, prevents Cumulative Layout Shift (CLS), and lazy-loads images as they enter the viewport.

### Local Images
- **Static Imports**: Importing an image directly (`import img from './img.png'`) automatically sets the `width`, `height`, and `blurDataURL` (for blur-up placeholders).
- **Public Folder**: Referencing images from the `/public` folder (e.g., `src="/img.png"`) requires manually specifying `width` and `height`.
- **Dynamic Imports**: You can also use dynamic `import()` to get automatic dimensions for local images when static imports aren't possible.

### Remote Images
- Remote images require manually specifying `width` and `height` (or using the `fill` property).
- You **must** configure allowed remote domains in `next.config.ts` under `images.remotePatterns` for security purposes.

## 11. Font Optimization
The `next/font` module optimizes fonts by automatically self-hosting them, preventing layout shifts and external network requests.
- **Google Fonts**: Import from `next/font/google` (e.g., `import { Geist } from 'next/font/google'`). Use variable fonts when possible.
- **Local Fonts**: Import `localFont` from `next/font/local` and point `src` to your local font file (or an array of objects for multiple weights).
- Apply the font by passing `myFont.className` to an HTML element (like `<html className={geist.className}>`).

## 12. Metadata and OG Images
Metadata APIs define `<head>` tags for SEO and social sharing (supported only in Server Components).
- **Static Metadata**: Export a `metadata` object from `layout.tsx` or `page.tsx`.
- **Dynamic Metadata**: Export an async `generateMetadata` function (e.g., to fetch a blog post title). Use `React.cache` to deduplicate data fetches shared with the page body.
- **Streaming**: Metadata streams separately so it doesn't block UI rendering (except for bots/crawlers).
- **File-based Metadata**:
  - `favicon.ico`, `apple-icon.jpg`.
  - `opengraph-image.jpg` (more specific routes take precedence).
  - `robots.txt`, `sitemap.xml`.
- **Dynamic OG Images**: Use `ImageResponse` from `next/og` in an `opengraph-image.tsx` file to generate images dynamically using JSX and CSS (supports flexbox).

## 13. Route Handlers
Route Handlers (`route.ts`) provide custom endpoints inside the `app` directory using Web Request/Response APIs.
- **Convention**: Export HTTP methods (e.g., `export async function GET(request)`). You cannot place a `route.ts` and `page.tsx` at the exact same route level.
- **APIs**: Uses `NextRequest` and `NextResponse` to provide convenient helpers.
- **Caching**: 
  - Not cached by default.
  - With Cache Components enabled, `GET` handlers follow the same prerendering rules as UI pages. They can be prerendered unless they access runtime APIs (like `headers()`) or random values.
  - You can use `'use cache'` inside a helper function to cache operations like DB queries inside a Route Handler.

## 14. Proxy (formerly Middleware)
*Note: In Next.js 16, Middleware was renamed to **Proxy**.*
- **Purpose**: Runs code before a request completes to rewrite, redirect, modify headers, or respond directly. (Not intended for slow data fetching).
- **Convention**: Create a single `proxy.ts` file in the root or `src` directory.
- **Usage**: Export a function (default or named `proxy`) that takes a `NextRequest` and returns a `NextResponse` (e.g., `NextResponse.redirect(...)`).
- **Matcher**: Export a `config` object with a `matcher` array to filter which paths trigger the Proxy.
