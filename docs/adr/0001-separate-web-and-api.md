# ADR 0001: Separate the web app and API

- Status: Accepted

## Context

The interface uses Next.js App Router, while account, diet, profile, and shopping endpoints are implemented in NestJS. These processes have different environment variables and deployment needs. GitHub Pages cannot host the API.

## Decision

Deploy the Next.js app and NestJS API as separate Node services. The browser sends requests to the public API URL set by `NEXT_PUBLIC_API_URL`; the API keeps database and Gemini credentials in its server environment. [`render.yaml`](../../render.yaml) describes the two services.

## Consequences

- Each service can build and start independently.
- Deployment must set the correct public API URL during the web build and allow browser requests from the web origin.
- The current API allows all CORS origins; this must be narrowed for a broadly accessible production deployment.
- The separate Python service is not required for the active web app.
