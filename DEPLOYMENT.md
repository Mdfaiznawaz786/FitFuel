# Deploy FitFuel from GitHub

The active app has a Next.js frontend and a NestJS API. GitHub Pages serves
static files and cannot run the API. The included `render.yaml` defines two
Render web services linked to one GitHub repository. The separate Python model
service is not required for this app's current diet generation flow.

## Before publishing

1. Use a **private** GitHub repository. The root `.env` and generated files are
   excluded by `.gitignore`; do not add credentials to source, notebooks, or
   commit messages.
2. If this is a new Supabase project, run `supabase/bootstrap.sql` in its SQL
   Editor. Existing projects that already have the schema do not need it again.
3. Review the staged files before pushing.

## Deploy with Render

1. Connect your GitHub account to Render and create a Blueprint from this
   repository's `render.yaml`.
2. Provide `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `GEMINI_API_KEY` when
   prompted for the **API** service. Render generates `JWT_SECRET`. Keep all
   four values server-side. The publishable Supabase key is not needed here.
3. Render creates `fitfuel-diet-api` and `fitfuel-diet-web`. The web build reads
   the API service's public hostname and sets `NEXT_PUBLIC_API_URL` at build
   time. Do not set this variable to `localhost` for deployment.
4. Open the web service's public URL and try signup, profile save, diet
   generation, and checkout. A protected API endpoint returning `401` without
   a token is expected.

The Blueprint starts on Render's free web-service plan. Free services can
sleep during inactivity, so the first request after a pause can be slow. Change
the plan in `render.yaml` if you need always-on service and accept its cost.

Store checkout links open retailer websites. FitFuel cannot verify their
payment or delivery; receipt amounts are user-recorded notes.
