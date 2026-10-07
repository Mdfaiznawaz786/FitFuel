# dietChartGenerator
Deep Learning Final Project

Project maintainer: Mohammed Faiz Nawaz

For a live deployment, see [DEPLOYMENT.md](DEPLOYMENT.md). GitHub stores the
source; the running Next.js and NestJS services need a web host.

## Run locally

Use Node.js 22 and npm. From the project root, install the two active application services:

```powershell
cd Frontend
npm ci
cd ..\NestJSBackend\diet-chart-generator
npm ci
```

Create a `.env` file in the project root with `GEMINI_API_KEY` and a random `JWT_SECRET`. For accounts and saved diet charts, create a Supabase project, run [supabase/bootstrap.sql](supabase/bootstrap.sql) in its **SQL Editor**, and add the project's URL and **secret** API key to `.env`:

```env
GEMINI_API_KEY=your-gemini-api-key
# Optional; defaults to gemini-3.8-flash
GEMINI_MODEL=gemini-3.8-flash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
```

Get the URL from the project's **Connect** dialog and the secret key from **Settings → API Keys**. Keep `SUPABASE_SECRET_KEY` in the backend environment only; never paste it into chat, browser code, or source control. This app uses its own JWT authentication and needs the server-only key to access tables whose public access is disabled. The API reads the root `.env` file on startup.

Create or replace the Gemini key on the [Google AI Studio API keys page](https://aistudio.google.com/api-keys). A suspended key cannot generate diet plans; replace it in `.env` and restart the NestJS API. Keep this key server-side as well.

In separate terminals, run:

```powershell
cd Frontend
npm run dev
```

```powershell
cd NestJSBackend\diet-chart-generator
npm run start:dev
```

Open http://localhost:3000. The frontend sends API requests to http://localhost:3001 by default; set `NEXT_PUBLIC_API_URL` in the frontend environment if the API runs elsewhere. The Python service is separate from the current frontend and NestJS API flow.

Doc Link: https://docs.google.com/document/d/1bN4nzD3LRyAuY305WRv_w-5LNVFiPYjsPIJqBMg8KsQ/edit?tab=t.0

# 🥗 dietChartGenerator

This project began as a deep learning course submission. The current FitFuel app uses a Next.js frontend, a NestJS API, Supabase for account and diet data, and Google's Gemini API to generate draft diet plans. The Python training notebook is a separate research artifact; its fine-tuned checkpoint is not included in this repository or used by the current app.

The dashboard shows profile weight and its dated history, saved diet plans, and grocery amounts the user records after shopping. Saving a weight in Profile starts the weight history; another weight on a later date creates a trend. Medical History summarizes information entered in Profile. Medical-report file upload and extraction are not implemented. Store links do not confirm purchases or deliveries.

---

## 🚀 Features

- 🧠 Gemini-generated draft diet plans from details entered by the user
- 📦 User authentication and data storage using **Supabase**
- 📝 Automatically generates personalized diet charts based on user input
- 📊 Dashboard for profile weight, saved plans, and recorded grocery spending

---

## 🔧 Tech Stack

- **Current generator:** Google Gemini through the NestJS API
- **Dataset:** Custom compiled diet and nutrition dataset
- **Backend:** NestJS; the FastAPI code is separate from the current app flow
- **Frontend:** Next.js
- **Database:** Supabase (PostgreSQL)
- **Deployment configuration:** Render Blueprint in `render.yaml`; no DigitalOcean deployment is verified here

---

## 🧪 Dataset

The custom dataset contains:
- Nutritional information
- User health profiles (e.g., diabetic, hypertensive)
- Sample diet recommendations
- Caloric and macronutrient breakdowns

The dataset was cleaned and tokenized for fine-tuning DistilGPT using HuggingFace `Trainer`.

---

## 🧠 Model Training

- **Base Model:** `distilgpt2` from HuggingFace
- **Fine-tuning evidence:** The included notebook records a completed three-epoch run on 10,000 examples, with a 90/10 train/test split. Its execution location cannot be confirmed from this repository.
- **Tokenizer:** GPT2Tokenizer
- **Frameworks:** PyTorch + HuggingFace Transformers

The notebook saves to `./diet_model_finetuned`, but that directory is absent here. `PythonBackend/project_weights_mohammed_faiz_nawaz.txt` contains an external Box link to weights that has not been verified. `PythonBackend/main.py` attempts to load the checkpoint, then calls Gemini to generate the response; the current Next.js frontend calls the NestJS API instead.

Training Sample:
