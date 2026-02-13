# CertMaster - AI Exam Prep App

A modern, responsive web application for practicing certification exams. This app uses vanilla HTML, CSS, and JavaScript to provide a seamless study experience with an animated gradient theme.

## Features

- **Dynamic Question Generation**: Simulates AI generation based on your inputs.
- **Interactive Quiz Interface**: Instant feedback on answers.
- **Responsive Design**: Works on desktop and mobile.
- **Modern UI**: Animated background and glassmorphism cards.

## 🚀 Getting Started Locally

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone https://github.com/your-username/cert-master-app.git
    cd cert-master-app
    ```
    *(If you just downloaded the files, just open the folder).*

2.  **Open the app**:
    - Simply double-click `index.html` to open it in your default browser.
    - OR use a live server (e.g., VS Code Live Server extension).

## 🛠 Deployment Guide

### 1. Initialize Git Repository
Run these commands in your project terminal:

```bash
# Initialize new git repo
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - Exam Prep App"
```

### 2. Push to GitHub
1.  Go to [GitHub.com](https://github.com/new) and create a new repository named `cert-master-app`.
2.  Do not initialize with README/license (since we have them).
3.  Copy the remote URL (e.g., `https://github.com/YourUser/cert-master-app.git`) and run:

```bash
# Link local repo to GitHub
git remote add origin https://github.com/YourUser/cert-master-app.git

# Push code
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel
You can deploy using the Vercel CLI or the Dashboard.

**Option A: Vercel CLI (Recommended)**
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```
*Follow the prompts (accept defaults).*

**Option B: Vercel Dashboard**
1.  Go to [vercel.com](https://vercel.com).
2.  Click **"Add New Project"**.
3.  Import from **GitHub**.
4.  Select the `cert-master-app` repository.
5.  Click **Deploy**.

Your app will be live at a URL like `https://cert-master-app.vercel.app`!
