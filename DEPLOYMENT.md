# Deploy FitFuel from GitHub

The active app has a Next.js frontend and a NestJS API. GitHub Pages serves
static files and cannot run the API. The included `render.yaml` defines two
Render web services linked to one GitHub repository. The separate Python model
service is not required for this app's current diet generation flow.

## Zero-cost portfolio demo

The existing Blueprint can run both services on Render's Free plan. You also
need one Supabase Free project and a Gemini API key on Google's Free tier.
These are provider accounts; there are no credentials in this repository.

- Render gives a workspace 750 shared Free instance hours each calendar month.
  Both web services consume hours while running and can take about a minute to
  wake after 15 minutes idle. For a lightly used demo this may be enough, but
  two continuously active services can exhaust the shared allowance.
- Supabase Free allows two active projects and may pause an inactive project.
  Restore a paused project in the dashboard before testing the app.
- Gemini's Free tier has model and request limits. Free-tier prompts may be used
  to improve Google's products. Use sample data for a public portfolio demo;
  do not enter real medical details.

The web and API code is open source. The hosted Gemini model is not. Running an
open-source model yourself would require a continuously available machine with
enough memory, which this no-cost Blueprint does not provide.

## Before publishing

1. Keep all credentials out of GitHub. The root `.env` and generated files are
   excluded by `.gitignore`; enter secrets only in provider dashboards.
2. Review the staged files before pushing.

## Deploy with Render

1. Create or restore a Supabase Free project. In its SQL Editor, run
   `supabase/bootstrap.sql` once for a new project.
2. Create a Gemini API key in Google AI Studio and confirm its Free-tier quota
   is available to your account.
3. Connect your GitHub account to Render and create a Blueprint from this
   repository's `render.yaml`. The [Deploy to Render shortcut](https://render.com/deploy?repo=https://github.com/Mdfaiznawaz786/FitFuel)
   opens this repository's Blueprint.
4. Provide `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `GEMINI_API_KEY` when
   prompted for the **API** service. Render generates `JWT_SECRET`. Keep all
   four values server-side. The publishable Supabase key is not needed here.
5. Render creates `fitfuel-diet-api` and `fitfuel-diet-web`. The web build reads
   the API service's public hostname and sets `NEXT_PUBLIC_API_URL` at build
   time. The API allows browser requests from the web service's Render hostname.
   If you host the web app on another domain, set `CORS_ORIGINS` on the API to
   that exact `https://` origin, then redeploy the API.
6. Open the web service's public URL and try signup, profile save, diet
   generation, and checkout. A protected API endpoint returning `401` without
   a token is expected.

The Blueprint starts on Render's free web-service plan. Free services can
sleep during inactivity, so the first request after a pause can be slow. Change
the plan in `render.yaml` if you need always-on service and accept its cost.

Store checkout links open retailer websites. FitFuel cannot verify their
payment or delivery; receipt amounts are user-recorded notes.
