# Next.js Authentication Guide

Understanding authentication is crucial for protecting your application's data. Next.js supports secure authentication flows utilizing Server Actions, Cache Components, and the `cookies()` API.

## 1. Core Concepts
- **Authentication**: Verifies user identity (who they are).
- **Session Management**: Tracks the user's auth state across requests.
- **Authorization**: Decides what routes and data the user can access based on their identity/role.

*Recommendation*: While you can build a custom auth solution, it is highly recommended to use an established authentication library (e.g., NextAuth.js, Clerk, Supabase, Auth0) for increased security, ease of use, and out-of-the-box features like OAuth and Multi-Factor Authentication.

## 2. Authentication Flow
To implement a custom sign-up or login flow:
1. **Capture Credentials**: Use the `<form>` element to submit data to a **Server Action**. In the client component, use React's `useActionState` hook to manage form state and pending status.
2. **Server-Side Validation**: Validate the submitted `FormData` within the Server Action using a schema validation library like **Zod** or **Valibot**. Return validation errors early if they exist.
3. **Verify/Create**: Hash passwords (e.g., using `bcrypt`) and insert the user into your database, or verify against existing records.
4. **Create Session**: Once authenticated, generate a session and redirect the user.

## 3. Session Management
Sessions track users between requests.
- **Stateless Sessions (Cookies)**: Session data is encrypted and stored entirely in the user's browser cookie. This is simple and fast.
  - Requires a strong secret key (stored in environment variables).
  - Use libraries like `jose` to encrypt and decrypt the session token.
  - Store cookies using the `cookies()` API from `next/headers` with secure flags (`httpOnly`, `secure`, `sameSite`, and an expiration time).
- **Database Sessions**: The session data lives in a database table, and only an encrypted session ID is stored in the user's cookie. This is more secure and allows for revoking sessions remotely, but requires a database lookup.

## 4. Authorization Best Practices
Control what authenticated users can see and do.

### Data Access Layer (DAL)
Create a centralized Data Access Layer (e.g., a `verifySession` function) for all authorization checks. Use React's `cache` function to memoize the session verification so it only executes once per render pass, even if called in multiple components.

### Data Transfer Objects (DTO)
Never return raw database user objects to the UI. Use DTO functions to strip out sensitive data (like password hashes or phone numbers) and only pass the necessary fields to your components.

### Secure Checks vs Optimistic Checks
- **Secure Checks**: Perform deep authorization checks (using the DAL) directly inside Server Components, Route Handlers, and Server Actions right before accessing or mutating data.
- **Optimistic Checks (Proxy)**: Use `proxy.ts` (formerly Middleware) to read the session cookie and quickly redirect unauthenticated users away from protected routes. Do not perform database queries inside the Proxy to avoid performance bottlenecks.

### Component Architecture
- **Do not use Layouts for auth checks**: Layouts do not re-render on client-side navigations. Instead, fetch user data in the layout, but perform the actual authorization check closer to the data source or inside the specific Page component.
- **Streaming & Suspense**: Top-level `await` calls to `cookies()` or your DAL will block the entire page from streaming. Instead, wrap the component needing session data in a `<Suspense>` boundary so the static shell of your app can load instantly.

## 5. Authentication with Cache Components
When `cacheComponents: true` is enabled in Next.js 16, session reads happen at request time and cannot be prerendered into the static shell.
- **Read the Session (`use cache: private`)**: You cannot use `'use cache'` on a function that calls `cookies()`. Instead, use `'use cache: private'`. This keeps the result in the browser only (never cached on the server).
- **Use Suspense Boundaries**: Any component that reads the session MUST be wrapped in a `<Suspense>` boundary. The surrounding static shell prerenders and loads instantly, while the authenticated UI streams in.
- **Share the User via Context**: Instead of prop drilling or reading the session repeatedly, create a Promise of the user inside the Suspense boundary and pass it to a React Context provider. Client Components can then consume it using `use(UserContext)`.
- **Cache Session-Derived Data**: Extract the `userId` using your private cache, and pass it to a separate data-fetching function marked with standard `'use cache'` (which caches on the server). Tag the cache using `cacheTag('data:' + userId)`.
- **Mutations**: In a Server Action, after verifying the session and modifying data, use `updateTag('data:' + userId)` to immediately refresh the cached data.
- **Prefetching**: Use `<Link prefetch={true}>` to aggressively prefetch destinations that require session-derived data and parameters, making navigation instant.
