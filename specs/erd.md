# Entity Relationship Diagram

```mermaid
erDiagram
    direction TB

    Profile {
        uuid id PK
        string user_id UK "Supabase Auth ID"
        string email UK
        string name "nullable"
        string timezone "default: UTC"
        datetime created_at
        datetime updated_at
    }

    Group {
        uuid id PK
        string name
        string description "nullable"
        string code UK "invite code"
        uuid owner_id FK
        datetime created_at
        datetime updated_at
    }

    GroupMember {
        uuid id PK
        uuid group_id FK
        uuid profile_id FK
        string role "ADMIN | MEMBER"
        datetime joined_at
    }

    Availability {
        uuid id PK
        uuid profile_id FK
        int day_of_week "0=Sun … 6=Sat"
        string start_time "HH:mm 24h"
        string end_time "HH:mm 24h"
    }

    Event {
        uuid id PK
        uuid group_id FK
        string title
        string description "nullable"
        datetime start_time
        datetime end_time
        string location "nullable"
        datetime created_at
        datetime updated_at
    }

    Profile ||--o{ Group : "owns"
    Profile ||--o{ GroupMember : "memberships"
    Profile ||--o{ Availability : "sets availability"
    Group ||--o{ GroupMember : "has members"
    Group ||--o{ Event : "schedules"
```

## Relationship Summary

| Relationship               | Type        | Description                                     |
| -------------------------- | ----------- | ----------------------------------------------- |
| **Profile → Group**        | One-to-Many | A profile can own many groups (`owner_id`)      |
| **Profile → GroupMember**  | One-to-Many | A profile can be a member of many groups        |
| **Profile → Availability** | One-to-Many | A profile can have many availability time slots |
| **Group → GroupMember**    | One-to-Many | A group can have many members                   |
| **Group → Event**          | One-to-Many | A group can have many scheduled events          |

## Constraints

- `GroupMember` has a **unique composite index** on `(group_id, profile_id)` — a profile can only join a group once.
- `Availability` has an **index** on `profile_id` for fast lookups.
- `Profile.user_id` is unique and maps to the **Supabase Auth** user ID.
- `Group.code` is unique and serves as the **invite/join code**.
