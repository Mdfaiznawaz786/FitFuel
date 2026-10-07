# ADR 0003: Use Gemini for the active diet generator

- Status: Accepted

## Context

The repository contains a Python notebook and FastAPI experiment that fine-tunes a DistilGPT model. The generated checkpoint is not included. The current Next.js planner calls a NestJS endpoint that requests a meal plan from Gemini and parses its JSON response.

## Decision

Treat the NestJS-to-Gemini route as the active generator. Keep `GEMINI_API_KEY` server-side, allow `GEMINI_MODEL` to select a supported model, and retain the Python work as a separate research artifact.

## Consequences

- Diet generation requires a working Gemini key, model access, network access, and available quota. An invalid or unavailable response stops generation.
- AI output is a draft; it is not clinically validated or evidence of a trained local model running in production.
- The application should add stronger nutritional validation and operational controls before being used for consequential health decisions.
