# SkillForge Learning Platform 🚀

SkillForge is a comprehensive, AI-integrated learning management and career guidance platform designed for modern developers. It provides dynamic learning roadmaps, interactive interview assignments, study notes, and career tracking.

## 🌟 Features

- **Dynamic Learning Roadmaps**: Visual, structured paths for various developer careers (Frontend, Backend, Full Stack, Cloud, AI, Android).
- **Interactive Interview Assignments**: Topic-specific multiple-choice assessments (90+ questions) that provide real-time grading and explanations.
- **Categorized Study Notes**: An integrated knowledge base linking to official documentation (MDN, React, AWS, Docker, GeeksforGeeks) based on your career focus.
- **Developer Portfolio**: A professional showcase of projects with links to source code and live demos.
- **Modern UI/UX**: Built with React and Bootstrap, featuring glassmorphism, responsive grids, micro-animations, and a cohesive design system.

## 🛠️ Technology Stack

- **Frontend Core**: React 18
- **Styling**: Vanilla CSS3 + React Bootstrap (Bootstrap 5)
- **Routing**: React Router DOM (v6)
- **Icons**: React Icons (FontAwesome & Bootstrap Icons)

## 📁 Project Structure

The codebase is organized following senior-level React architecture patterns, prioritizing separation of concerns:

```
src/
├── assets/          # Static files, images, global SVGs
├── components/      # Reusable UI components (NavigationBar, etc.)
├── pages/           # Route-level components (Profile, Interview, Notes, etc.)
├── routes/          # Application routing configuration (AppRoutes.jsx)
├── *Data/           # Static data stores (mcqData, roadmapData, notesData, projectsData)
└── utils/           # Helper functions and global hooks
```

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v16+) installed.

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🎨 Design Philosophy

SkillForge utilizes a premium "glassmorphism" aesthetic with vibrant gradients and subtle hover animations to create an engaging, modern user experience. All components are fully responsive and designed mobile-first.
