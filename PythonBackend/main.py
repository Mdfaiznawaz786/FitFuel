from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import uvicorn
import logging
from typing import Optional, List, Dict, Any
import google.generativeai as genai
import re
import json
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Diet Plan Generator API",
    description="API for generating personalized diet plans based on user details",
    version="1.0.0"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request model
class DietPlanRequest(BaseModel):
    age: int = Field(..., description="User's age", example=30)
    goal: str = Field(..., description="User's diet goal", example="Weight loss")
    restrictions: Optional[str] = Field(None, description="Dietary restrictions", example="No dairy")
    diseases: Optional[List[str]] = Field(None, description="Medical conditions", example=["Diabetes", "Hypertension"])
    activity_level: Optional[str] = Field("Moderate", description="Activity level", example="Moderate")
    gender: Optional[str] = Field(None, description="User's gender", example="Male")
    height: Optional[str] = Field(None, description="User's height", example="175cm")
    weight: Optional[str] = Field(None, description="User's weight", example="70kg")
    otherDisease: Optional[str] = Field(None, description="Other diseases not in list", example="Celiac disease")
    age: Optional[int] = Field(None, description="User's age", example=30)

# Define response model
class DietPlanResponse(BaseModel):
    diet_plan: str = Field(..., description="Generated diet plan")
    calories: Optional[int] = Field(None, description="Recommended daily calorie intake")
    protein: Optional[int] = Field(None, description="Recommended daily protein intake in grams")
    carbs: Optional[int] = Field(None, description="Recommended daily carbohydrate intake in grams")
    fats: Optional[int] = Field(None, description="Recommended daily fat intake in grams")

# Load model on startup
model = None
tokenizer = None

@app.on_event("startup")
async def load_model():
    global model, tokenizer
    try:
        logger.info("Loading model and tokenizer")
        model_path = "./diet_model_finetuned"  # Path to your saved model
        tokenizer = AutoTokenizer.from_pretrained(model_path)
        model = AutoModelForCausalLM.from_pretrained(model_path)
        
        # Use CPU for deployment (or configure for GPU if available)
        device = "cuda" if torch.cuda.is_available() else "cpu"
        model = model.to(device)
        
        logger.info(f"Model loaded successfully on {device}")
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        # If model fails to load, load distilgpt2 as a fallback
        try:
            logger.info("Attempting to load distilgpt2 as fallback")
            tokenizer = AutoTokenizer.from_pretrained("distilgpt2")
            model = AutoModelForCausalLM.from_pretrained("distilgpt2")
            model = model.to(device)
        except Exception as e2:
            logger.error(f"Failed to load fallback model: {str(e2)}")

@app.get("/")
def read_root():
    return {"message": "Diet Plan Generator API is running. Use /docs to view API documentation."}


@app.post("/generate-diet-plan", response_model=DietPlanResponse)
async def generate_diet_plan(request: DietPlanRequest):
    geminiAPIKey = os.getenv("GEMINI_API_KEY")
    if not geminiAPIKey:
        raise HTTPException(status_code=503, detail="GEMINI_API_KEY is not configured")
    genai.configure(api_key=geminiAPIKey)
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model is not loaded")
    
    try:
        # Prepare input
        input_text = f"Age: {request.age}, Goal: {request.goal}"
        
        if request.restrictions:
            input_text += f", Restrictions: {request.restrictions}"
        if request.diseases:
            input_text += f", Diseases: {request.diseases}"
        if request.activity_level:
            input_text += f", Activity level: {request.activity_level}"
        if request.gender:
            input_text += f", Gender: {request.gender}"
        if request.height:
            input_text += f", Height: {request.height}cm"
        if request.weight:
            input_text += f", Weight: {request.weight}kg"
        if request.otherDisease:
            input_text += f", Other diseases: {request.otherDisease}"
            
        prompt = f"""
You are a nutrition expert AI.

Based on the following user input, generate a comprehensive personalized diet plan, including full nutritional information.

User details:
{input_text}

Output ONLY a valid JSON object with the structure below. Do not include any text, explanation, markdown, or formatting outside the JSON.

JSON structure:
{{
  "diet_plan": "The complete diet plan text with all recommendations and guidance.",
  "daily_targets": {{
    "calories": <number>,
    "protein": <number>,
    "carbs": <number>,
    "fats": <number>,
    "fiber": <number>,
    "water": "<recommendation>"
  }},
  "meal_plan": [
    {{
      "day": 1,
      "meals": [
        {{
          "meal_type": "Breakfast",
          "foods": [
            {{
              "name": "<food item>",
              "portion": "<portion size>",
              "calories": <number>,
              "protein": <number>,
              "carbs": <number>,
              "fats": <number>
            }}
          ]
        }}
      ]
    }}
  ]
}}

Ensure:
- Each food item has full nutritional breakdown.
- Daily totals align with daily_targets.
- Your response must be valid JSON.
"""
        # Make a single call to Gemini API
        gemini_model = genai.GenerativeModel('gemini-2.0-flash')
        response = gemini_model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.5,
                "max_output_tokens": 4096
            }
        )
        
        # Process Gemini API response
        response_text = response.text
        
        try:
            # Try to parse JSON response
            response_data = json.loads(response_text)
            diet_plan = response_data.get("diet_plan", "")
            
            # Extract nutritional info from the JSON
            daily_targets = response_data.get("daily_targets", {})
            calories = daily_targets.get("calories")
            protein = daily_targets.get("protein")
            carbs = daily_targets.get("carbs")
            fats = daily_targets.get("fats")
            
        except json.JSONDecodeError:
            # If response is not valid JSON, use the raw text as diet plan
            logger.warning("Failed to parse JSON response, using raw text")
            diet_plan = response_text
            
            # Try to extract nutritional information from the text
            calories = None
            protein = None
            carbs = None
            fats = None
            
            # Try to extract nutritional information from the generated text
            try:
                for line in diet_plan.split("\n"):
                    if "calories:" in line.lower() or "calorie:" in line.lower():
                        cal_match = re.search(r'(\d+)\s*(?:kcal|calories|calorie)', line.lower())
                        if cal_match:
                            calories = int(cal_match.group(1))
                    
                    if "protein:" in line.lower():
                        prot_match = re.search(r'(\d+)\s*(?:g|grams)\s*(?:protein|proteins)', line.lower())
                        if prot_match:
                            protein = int(prot_match.group(1))
                            
                    if "carb" in line.lower():
                        carb_match = re.search(r'(\d+)\s*(?:g|grams)\s*(?:carb|carbs|carbohydrates)', line.lower())
                        if carb_match:
                            carbs = int(carb_match.group(1))
                            
                    if "fat" in line.lower():
                        fat_match = re.search(r'(\d+)\s*(?:g|grams)\s*(?:fat|fats)', line.lower())
                        if fat_match:
                            fats = int(fat_match.group(1))
            except Exception as extract_err:
                logger.warning(f"Error extracting nutritional info: {str(extract_err)}")
        
        return DietPlanResponse(
            diet_plan=diet_plan,
            calories=calories,
            protein=protein,
            carbs=carbs,
            fats=fats
        )
        
    except Exception as e:
        logger.error(f"Error generating diet plan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating diet plan: {str(e)}")
# For direct execution
if __name__ == "__main__":
    import re  # Import here for pattern matching
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
