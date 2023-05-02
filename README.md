# Requirements

- Arundo NPM token (or run `npm login`)
- Yarn (to avoid Yarn/NPM clashes with package-lock.json vs yarn.lock, we only use Yarn)

# Getting Started

- Clone repo
- Ensure NPM_TOKEN is found in environment variables (or run `npm login` for temporary access)
- Install dependencies by running `yarn` inside the project
- add `.env` files described below

### Running

- **Development Mode**: `yarn dev`
  Development mode allows for active saving/modifications, but is generally slower and unoptimized.
- **Production Mode**: `yarn verify`
  Production mode will build the project as if for production (slower), then run the built package. The app will be far more optimized in this mode, but will not listen for changes/saves to the project files.

### .env Files

In order to run the new Vite branch, the .env vars have changed (and will need to change respectively on all deployed versions like **develop, pre, and prod**).  
Non-secret environment variable are included in the `/envs` directory.  
The only secret needed is Auth0 client secret for the Arundo environment.
To add that you need a `./envs/env.development.local` file to run `yarn dev` and be pointed at the develop backend services.
Add `./envs/env.production.local` file to run `yarn local_prod` and be pointed at the prod backend services.
Add `./envs/env.pre.local` file to run `yarn local_pre` and be pointed at the pre backend services.
In each case the file just needs to look like the below:

```
AUTH0_CLIENT_SECRET=<value>
```

#### Recommendations

- Replace auth layer with serverless function to handle token validation/delivery. This would allow ditching the entire express microservice and migrating to a static site delivery (e.g. Cloudflare Worker Sites, S3 buckets, Netlify, etc) which is much cheaper, more reliable, and removes the one-server bottleneck.
- Migrate to ViteJS (preferably) or Create React App (CRA) - Fusebox is now out of favor, less-documented compared to its siblings, does not support more recent Node versions, and "eats" errors. ViteJS drastically improves DX, but doesn't play nicely with some poorly-written libraries.

# State of ViteJS Major Migration

This branch represents a Work In Progress (WIP) major overhaul of the Marathon build, structure, etc. It updates us from an outdated and relatively unsupported (in 2021) Fusebox build to a future-ready ViteJS path. In so doing, much of the structure has been reorganized to be more logically organized, with files easily referenced via a root `~` alias (equivalent to `/src/*`).

### Build

- [x] on `yarn build` or `yarn verify`, copy server.js to /dist folder
- [x] ensure auth works for `yarn dev` (run server.js as proxy?)
- [x] ensure `yarn build` and `yarn verify` works as current

### Organization

- [x] relocated all hooks to `/src/hooks`
- [x] relocated all misc components to `/src/components/Misc`
- [x] added a `/src/services/messages.js` to handle previous adk-react toast messages
- [x] moved all global environment variable/constant handling to `/src/constants.js` for inclusion elsewhere. This takes advantage of Vite's env handling system, rather than the previous index.html injection method used by our adk-express.
- [x] `/src/server.js` has been rewritten to handle the different needs of static file serving from previous methods, including a path for dev, and one for prod/deployed.
