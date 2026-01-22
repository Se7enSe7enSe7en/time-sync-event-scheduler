# Project description

AI automation scheduler for self time management or small time event organizing like scheduled gaming sessions with friends.

## Core features

- a dashboard where you can see the current upcoming event in the group you are in
- group or lobby system where users can join and the next event will be scheduled
- once inside a group, UI for making schedule should should be able to see all other user's (within the group) timezones
- the UI for making schedule should somehow highlight the possible time slots where everyone is available
- users can input their availability time through their profile, can be set outside of the group

## Extra features

- notification system through email, use n8n to email automatically the users within the group 2 days before the event
- AI chatbot that can schedule events for the group based on the users' availability

# Tech stack

## Frontend

### Full stack framework: **nuxt**

- Nuxt: https://nuxt.com/docs/4.x/getting-started/introduction

#### Nuxt desired specs

- Typescript: https://www.typescriptlang.org/
- Vue3 composition api: https://vuejs.org/api/composition-api-setup.html#composition-api-setup
- tailwind: https://tailwindcss.com/
- no state management, use Fetch or SSE if posible

## Backend

### ORM + query builder: **prisma-kysely**

- prisma-kysely: https://github.com/valtyr/prisma-kysely
- prisma: https://www.prisma.io/docs/guides/nuxt
- kysely: https://kysely.dev/docs/intro

### DB: **supabase + postgresql**

- postgresql: https://www.postgresql.org/docs/16/index.html

## Other tools

### Containerization: **Docker**

- Docker: https://docs.docker.com/

### Automation: **N8N**

- n8n: https://docs.n8n.io/

### Authentication: **Supabase Auth**

- supabase auth: https://supabase.com/docs/guides/auth

### AI provider: **Google Gemini**

- note: this should be flexible to change in the future any provider should work but for now we choose gemini.

- Gemini: https://ai.google.dev/gemini-api/docs
