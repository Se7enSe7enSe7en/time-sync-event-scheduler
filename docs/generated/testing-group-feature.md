# Testing the Group Feature

Quick manual test flow for **create group**, **join via code**, and **view group details** before moving to Phase 4.

## Prerequisites

1. **Environment**
   - `.env` in project root with:
     - `DATABASE_URL` — Postgres connection string (e.g. from Supabase: **Settings → Database → Connection string**).
     - `SUPABASE_URL` and `SUPABASE_KEY` (anon key) — from Supabase project **Settings → API** (or use [Supabase local](https://supabase.com/docs/guides/cli/local-development) and its `.env` output).

2. **Database**
   ```bash
   pnpm exec prisma migrate dev
   ```

3. **Run the app**
   ```bash
   pnpm dev
   ```
   Open **http://localhost:3000**.

---

## Test flow

### 1. Auth and profile

- Go to **http://localhost:3000/login** (or `/login`).
- **Sign up** with an email/password (or **sign in** if you already have an account).
- You should land on **Dashboard** (`/` or `/dashboard`).
- Go to **Profile** (`/profile`), fill name/timezone, and **Save**.  
  (Groups require a profile row; creating or joining a group will fail with “Profile not found” until you’ve saved once.)

### 2. Groups list and create

- Go to **Groups** (`/groups`). You can use the “My Groups” link on the dashboard.
- Click **Create group**, enter a name (e.g. “Test Lobby”), submit.
- The new group should appear in the list. Note the **group code** if you’ll test join next.

### 3. Group detail

- Click a group in the list to open **Group detail** (`/groups/[id]`).
- You should see:
  - Group name, code, “Active”, created date.
  - **Members** list with at least you (name/email and timezone).
- Use **Schedule Event** / **Invite Members** only to confirm the buttons are there (Phase 4 will wire them).

### 4. Join with a second user (optional)

- In another browser or incognito window, go to `/login` and **sign up** a second user.
- Open **Profile** and **Save** (so they have a profile).
- Go to **Groups** → **Join via code**, enter the **group code** from step 2, submit.
- Open that group from the list and confirm **Members** shows both users.

---

## If something fails

- **401 on `/api/groups` or `/api/groups/:id`**  
  You’re not logged in or the Supabase session isn’t sent. Check Supabase env vars and try signing out and back in.

- **“Profile not found” when creating/joining a group**  
  Save your profile once at `/profile`.

- **DB errors (e.g. relation "profiles" does not exist)**  
  Run `pnpm exec prisma migrate dev` and ensure `DATABASE_URL` points to the same database.

- **Group detail shows “Loading…” or error**  
  Check browser Network tab for `/api/groups/[id]` (403 = not a member, 404 = wrong id, 401 = auth).
