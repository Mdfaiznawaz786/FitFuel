# dietChartGenerator
Deep Learning Final Project

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

This project is the final submission for the **Deep Learning course**. It is a complete pipeline for generating **personalized diet charts** using a fine-tuned DistilGPT model trained on a custom diet dataset. The application takes into account individual user profiles including health conditions, preferences, and goals to generate tailored diet recommendations.

---

## 🚀 Features

- 🧠 Fine-tuned **DistilGPT** model on a custom nutrition & diet dataset
- 📦 User authentication and data storage using **Supabase**
- 📝 Automatically generates personalized diet charts based on user input
- 🌐 Deployed with a simple and clean UI for interaction

---

## 🔧 Tech Stack

- **Model:** DistilGPT (fine-tuned using HuggingFace Transformers)
- **Dataset:** Custom compiled diet and nutrition dataset
- **Backend:** Python (FastAPI)
- **Frontend:** React / Next.js (optional)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Docker + DigitalOcean

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
- **Fine-tuning:** Done on Google Colab with custom prompts + responses dataset
- **Tokenizer:** GPT2Tokenizer
- **Frameworks:** PyTorch + HuggingFace Transformers

Training Sample:
