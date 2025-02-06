# Remove existing git repository
if (Test-Path .git) {
    Write-Host "Removing existing git repository..."
    Remove-Item -Recurse -Force .git
}

# Initialize fresh repository
Write-Host "Initializing fresh git repository..."
git init

# Configure Git
git config --global user.name "AjnasNB"
git config --global user.email "ajnasnb@gmail.com"

# Connect to your repository
git remote add origin https://github.com/AjnasNB/movie-recommender.git
git branch -M main

# Clean up unnecessary files
Write-Host "Cleaning up unnecessary files..."
if (Test-Path "app.rar") { Remove-Item "app.rar" }
if (Test-Path "fidhaaaaaa.zip") { Remove-Item "fidhaaaaaa.zip" }
if (Test-Path "movie-recommender.zip") { Remove-Item "movie-recommender.zip" }
if (Test-Path "commit_and_push.ps1") { Remove-Item "commit_and_push.ps1" }
if (Test-Path "push.ps1") { Remove-Item "push.ps1" }
if (Test-Path "gitpush.ps1") { Remove-Item "gitpush.ps1" }
if (Test-Path "backend/__pycache__") { Remove-Item -Recurse -Force "backend/__pycache__" }

# Stage and commit in logical groups
Write-Host "Adding and committing files in groups..."

# Frontend configuration
git add next.config.mjs tsconfig.json postcss.config.mjs tailwind.config.js package.json package-lock.json
git commit -m "Add frontend configuration files"

# App files
git add app/
git commit -m "Add Next.js application files"

# UI components
git add components/ components.json
git commit -m "Add UI components and configurations"

# Utilities and hooks
git add lib/ hooks/ styles/
git commit -m "Add utilities, hooks, and styles"

# Public assets
git add public/
git commit -m "Add public assets"

# Backend files
git add backend/main.py backend/requirements.txt backend/README.md
git commit -m "Add FastAPI backend with movie recommendation system"

# Configuration files
git add .gitignore
git commit -m "Add configuration files"

# Force push everything to GitHub
Write-Host "Pushing to GitHub..."
git push -u origin main --force

Write-Host "`nAll done! Check your repository at https://github.com/AjnasNB/movie-recommender" 