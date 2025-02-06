from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
import os
from groq import Groq
import json
import asyncio

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
client = Groq(
    api_key="Add from env",
)

class MovieInput(BaseModel):
    movies: List[str]

class MovieRecommendation(BaseModel):
    movie_title: str
    why_recommended: str

def generate_recommendations(movies: List[str]):
    try:
        prompt = f"""Based on these movies: {', '.join(movies)}, recommend 5 similar movies.
        For each recommendation, provide:
        1. The movie title
        2. A detailed explanation of why it's recommended based on the input movies

        Format your response exactly like this example:
        {{
            "recommendations": [
                {{
                    "movie_title": "Example Movie",
                    "why_recommended": "Detailed explanation of why this movie would appeal to fans of the input movies..."
                }}
            ]
        }}

        Make each recommendation unique and detailed. Focus on themes, style, and connections to the input movies.
        """

        completion = client.chat.completions.create(
            messages=[{
                "role": "user", 
                "content": prompt
            }],
            model="llama-3.3-70b-versatile",  # Using a valid model name
            temperature=0.7,
            max_tokens=2000,
        )

        # Extract the content from the response
        content = completion.choices[0].message.content
        
        # Clean up the content
        content = content.replace('```json', '').replace('```', '').strip()
        
        try:
            # Try to parse as JSON first
            data = json.loads(content)
            if "recommendations" in data:
                return data
        except json.JSONDecodeError:
            # If JSON parsing fails, try to extract recommendations manually
            recommendations = []
            lines = content.split('\n')
            current_title = None
            current_explanation = []
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                    
                if line.startswith('"movie_title":'):
                    if current_title and current_explanation:
                        recommendations.append({
                            "movie_title": current_title,
                            "why_recommended": ' '.join(current_explanation)
                        })
                    current_title = line.split(':', 1)[1].strip().strip('"').strip(',').strip('"')
                    current_explanation = []
                elif line.startswith('"why_recommended":'):
                    explanation = line.split(':', 1)[1].strip().strip('"').strip(',').strip('"')
                    current_explanation = [explanation]
                elif current_explanation is not None:
                    current_explanation.append(line.strip('"').strip(','))
            
            # Add the last recommendation if exists
            if current_title and current_explanation:
                recommendations.append({
                    "movie_title": current_title,
                    "why_recommended": ' '.join(current_explanation)
                })
            
            return {"recommendations": recommendations}

    except Exception as e:
        print(f"Error in generate_recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend")
async def get_recommendations(movie_input: MovieInput):
    try:
        if len(movie_input.movies) < 3:
            raise HTTPException(status_code=400, detail="Please provide at least 3 movies")
        if len(movie_input.movies) > 10:
            raise HTTPException(status_code=400, detail="Maximum 10 movies allowed")

        result = generate_recommendations(movie_input.movies)
        
        # Validate the result structure
        if not result or "recommendations" not in result or not result["recommendations"]:
            raise HTTPException(status_code=500, detail="Failed to generate valid recommendations")
            
        return JSONResponse(content=result)
    except Exception as e:
        print(f"Error in get_recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 