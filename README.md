# Movie Recommendation System

A modern, AI-powered movie recommendation system built with Next.js and FastAPI, using Groq AI for intelligent movie suggestions.

## Features

- 🎬 Input up to 10 favorite movies
- 🤖 AI-powered recommendations using Groq
- ✨ Beautiful, responsive UI with modern design
- ⚡ Real-time typing animation for recommendations
- 🎯 Detailed explanations for each recommendation

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Lucide Icons

### Backend
- FastAPI
- Groq AI
- Python 3.8+
- Uvicorn

## Getting Started

### Prerequisites
- Node.js 18+ for frontend
- Python 3.8+ for backend
- Groq API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AjnasNB/movie-recommender.git
cd movie-recommender
```

2. Set up the frontend:
```bash
npm install
npm run dev
```

3. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. Configure environment variables:
   - Create a `.env` file in the backend directory
   - Add your Groq API key:
   ```
   GROQ_API_KEY=your_api_key_here
   ```

5. Start the backend server:
```bash
python main.py
```

The frontend will be running on `http://localhost:3000` and the backend on `http://localhost:8000`.

## Usage

1. Enter at least 3 movies you enjoy (maximum 10)
2. Click "Get AI Recommendations"
3. Watch as the AI generates personalized movie recommendations with detailed explanations
4. Remove or add movies to get different recommendations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 