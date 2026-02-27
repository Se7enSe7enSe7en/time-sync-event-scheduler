## Antigravity browser settings add these in the allow url

- nuxt.com
- docs.n8n.io
- spacetimedb.com

## Install Frontend tools

### Initialize Nuxt 4 using nuxi (nuxt cli tool)

```sh
pnpm dlx nuxi@latest init . --force
```

### Adding TailwindCSS through nuxi

```sh
pnpm dlx nuxi@latest module add tailwindcss
```

### Install tailwind autocomplete extension

- https://open-vsx.org/vscode/item?itemName=bradlc.vscode-tailwindcss

### Initialize tailwind.config.js using tailwind cli

```sh
pnpm dlx tailwindcss init
```

## Install Database and Backend tools

### Install SpacetimeDB CLI

#### for Mac / Linux:

```sh
curl -sSf https://install.spacetimedb.com | sh
```

### Start local SpacetimeDB server

```sh
spacetime start
```

### Publish the SpacetimeDB module (local)

```sh
pnpm run spacetime:publish:local
```

### Generate TypeScript client bindings

```sh
pnpm run spacetime:generate
```

### View SpacetimeDB logs

```sh
spacetime logs time-sync-event-scheduler
```
