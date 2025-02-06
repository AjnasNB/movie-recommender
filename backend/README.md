# Movie Recommendation Backend

This is the backend service for the movie recommendation system using FastAPI and Groq AI.

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
- Make sure you have a `.env` file with your Groq API key:
```
GROQ_API_KEY=your_api_key_here
```

## Running the Server

To start the backend server:

```bash
python main.py
```

The server will run on `http://localhost:8000`.

## API Endpoints

### POST /recommend
- Accepts a list of movies (minimum 3, maximum 10)
- Returns streaming movie recommendations based on the input movies
- Request body example:
```json
{
    "movies": ["The Matrix", "Inception", "Interstellar"]
}
```

## CORS Configuration
By default, the server accepts requests from `http://localhost:3000`. Update the CORS settings in `main.py` if your frontend is running on a different URL. 