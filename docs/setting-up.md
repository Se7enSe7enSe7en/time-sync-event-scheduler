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
