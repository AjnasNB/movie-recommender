"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Film, Plus, X, Loader2, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Recommendation {
  movie_title: string
  why_recommended: string
  isTyping?: boolean
  displayedText?: string
}

export default function MovieRecommender() {
  const [movies, setMovies] = useState<string[]>([])
  const [currentMovie, setCurrentMovie] = useState("")
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [recommendations])

  const handleAddMovie = () => {
    if (currentMovie.trim() && movies.length < 10) {
      setMovies([...movies, currentMovie.trim()])
      setCurrentMovie("")
    }
  }

  const handleRemoveMovie = (index: number) => {
    setMovies(movies.filter((_, i) => i !== index))
  }

  const simulateTyping = async (recommendations: Recommendation[]) => {
    const CHAR_DELAY = 15 // milliseconds per character
    const RECOMMENDATION_DELAY = 800 // milliseconds between recommendations

    for (let i = 0; i < recommendations.length; i++) {
      const rec = recommendations[i]
      const fullText = rec.why_recommended
      let currentText = ""

      // Add the recommendation with empty text
      setRecommendations(prev => [
        ...prev,
        { ...rec, displayedText: "", isTyping: true }
      ])

      // Add a small delay before starting to type
      await new Promise(resolve => setTimeout(resolve, 300))

      // Type out the text character by character
      for (let j = 0; j < fullText.length; j++) {
        currentText += fullText[j]
        setRecommendations(prev => {
          const updated = [...prev]
          updated[i] = { ...rec, displayedText: currentText, isTyping: true }
          return updated
        })

        // Add random variation to typing speed
        const randomDelay = CHAR_DELAY + Math.random() * 10
        await new Promise(resolve => setTimeout(resolve, randomDelay))

        // Add slightly longer pause after punctuation
        if (".!?".includes(fullText[j])) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }

      // Mark recommendation as complete
      setRecommendations(prev => {
        const updated = [...prev]
        updated[i] = { ...rec, displayedText: fullText, isTyping: false }
        return updated
      })

      // Wait before starting the next recommendation
      if (i < recommendations.length - 1) {
        await new Promise(resolve => setTimeout(resolve, RECOMMENDATION_DELAY))
      }
    }
    setIsLoading(false)
  }

  const handleSubmit = async () => {
    if (movies.length < 3) {
      setError("Please enter at least 3 movies")
      return
    }

    setIsLoading(true)
    setRecommendations([])
    setError("")

    try {
      const response = await fetch('http://localhost:8000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movies }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch recommendations')
      }

      if (!data.recommendations || !Array.isArray(data.recommendations)) {
        throw new Error('Invalid response format from server')
      }

      await simulateTyping(data.recommendations)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-purple-800">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-6">
          Movie Recommendation System
        </h1>
        <p className="text-gray-300 text-xl mb-12">
          Discover your next favorite movies with our advanced AI-powered recommendation system
        </p>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="space-y-4 pb-6">
              <CardTitle className="text-gray-100 flex items-center gap-3 text-2xl">
                <Film className="w-7 h-7" />
                Your Movie Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={currentMovie}
                    onChange={(e) => setCurrentMovie(e.target.value)}
                    placeholder={`Movie ${movies.length + 1}`}
                    className="bg-gray-800/50 border-gray-700 text-gray-100 text-lg py-6 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    onKeyPress={(e) => e.key === "Enter" && handleAddMovie()}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                    #{movies.length + 1}
                  </span>
                </div>
                <Button
                  onClick={handleAddMovie}
                  disabled={movies.length >= 10 || !currentMovie.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 px-6 hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                {movies.map((movie, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-gray-800/70 text-gray-100 flex items-center gap-2 text-lg py-2 px-4 transition-all duration-300 hover:bg-gray-700/70 group"
                  >
                    <span className="text-blue-400 mr-1">#{index + 1}</span>
                    {movie}
                    <button 
                      onClick={() => handleRemoveMovie(index)} 
                      className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all duration-300 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                ))}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading || movies.length < 3}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Generating Recommendations...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-3" />
                    Get AI Recommendations
                  </>
                )}
              </Button>

              {error && (
                <p className="text-red-400 mt-4 text-base bg-red-400/10 p-4 rounded-lg border border-red-400/20">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm shadow-xl">
            <CardHeader className="space-y-4 pb-6">
              <CardTitle className="text-gray-100 flex items-center gap-3 text-2xl">
                <Sparkles className="w-7 h-7" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-6" ref={scrollAreaRef}>
                {isLoading && recommendations.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-gray-400 h-full space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin" />
                    <p className="text-xl">Analyzing your movie preferences...</p>
                  </div>
                )}
                <div className="space-y-6">
                  {recommendations.map((rec, index) => (
                    <Card 
                      key={index} 
                      className={`
                        bg-gray-800/50 border-gray-700/50 backdrop-blur-sm 
                        transition-all duration-500 
                        ${rec.isTyping ? 'border-blue-500/30' : 'hover:bg-gray-800/70 hover:shadow-xl'}
                      `}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-2xl text-gray-100 flex items-center bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                          {rec.movie_title}
                          {rec.isTyping && (
                            <span className="ml-3 w-2.5 h-6 bg-blue-400/50 animate-pulse rounded-sm" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 text-lg leading-relaxed">
                          {rec.displayedText}
                          {rec.isTyping && (
                            <span className="ml-2 inline-block w-2.5 h-6 bg-blue-400/50 animate-pulse rounded-sm" />
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
