## Antigravity browser settings add these in the allow url

- nuxt.com
- docs.n8n.io
- prisma.io
- kysely.dev

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

### Prisma (ORM), Kysely (Query Builder), Prisma-Kysely (Adapter), Postgres (Driver)

```sh
pnpm install -D prisma prisma-kysely
pnpm approve-builds
pnpm install kysely pg
```

### Initialize Prisma

```sh
pnpm prisma init
```

### Setup prisma-kysely, replace the defualt client generator in your `schema.prisma`

```ts
generator kysely {
    provider = "prisma-kysely"

    // Optionally provide a destination directory for the generated file
    // and a filename of your choice
    output = "../src/db"
    fileName = "types.ts"
    // Optionally generate runtime enums to a separate file
    enumFileName = "enums.ts"
}
```

### Generate Kysely base types

```sh
pnpm prisma generate
```

### Setup local db with supabase cli

#### Add supabase cli to dev deps

```sh
pnpm add -D supabase
pnpm approve-builds
```

#### Initialize supabase

```sh
pnpm supabase init
```

#### Start supabase (requires docker running)

```sh
pnpm supabase start
```

#### Once the DB is running, push the schema

```sh
pnpm prisma db push
```
