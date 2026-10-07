# ADR 0002: Store data in Supabase and authenticate in NestJS

- Status: Accepted

## Context

The existing API creates users, hashes passwords, issues JWTs, and reads or writes Supabase tables through a server-side client. The schema in [`supabase/bootstrap.sql`](../../supabase/bootstrap.sql) restricts table and RPC access for browser roles. Switching to Supabase Auth would change the account flow and token format.

## Decision

Keep account authentication in NestJS for the current app. Use `SUPABASE_SECRET_KEY` only in the API process to access PostgreSQL and private Storage. Keep public clients away from this key. Use the SQL bootstrap as the schema source for a new Supabase project.

## Consequences

- The API is responsible for password security, token handling, authorization, and user data access. Supabase Auth features such as managed password reset are not inherited automatically.
- The server key has broad privileges, so every API endpoint must enforce the authenticated user's scope. A future move to Supabase Auth needs a migration plan.
- A new deployment must provision the schema and protect secret values outside source control.
