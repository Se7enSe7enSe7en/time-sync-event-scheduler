## Antigravity browser settings add these in the allow url

- nuxt.com
- docs.n8n.io
- prisma.io
- kysely.dev

## Install Frontend tools

### Initialize Nuxt 4 using nuxi (nuxt cli tool)

```sh
npx nuxi@latest init . --force
```

### Adding TailwindCSS through nuxi

```sh
npx nuxi@latest module add tailwindcss
```

## Install Database and Backend tools

### Prisma (ORM), Kysely (Query Builder), Prisma-Kysely (Adapter), Postgres (Driver)

```sh
npm install -D prisma prisma-kysely
npm install kysely pg
```

### Initialize Prisma

```sh
npx prisma init
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
npx prisma generate
```

### Setup local db with supabase cli

#### Initialize supabase

```sh
npx supabase init
```

#### Start supabase (requires docker running)

```sh
npx supabase start
```

#### Once the DB is running, push the schema

```sh
npx prisma db push
```
