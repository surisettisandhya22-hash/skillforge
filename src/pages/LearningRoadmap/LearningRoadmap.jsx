import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Badge } from "react-bootstrap";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./LearningRoadmap.css";

const roadmapDetails = {
  "frontend": [
    { step: "1. HTML & CSS Basics", desc: "Start with semantic HTML tags, CSS Flexbox, Grid, and responsive web design principles.", url: "https://www.w3schools.com/html/" },
    { step: "2. CSS Frameworks", desc: "Learn Bootstrap or Tailwind CSS to rapidly build and style modern UI components.", url: "https://www.w3schools.com/bootstrap5/" },
    { step: "3. JavaScript Fundamentals", desc: "Master variables, ES6+ features, DOM manipulation, async/await, and APIs.", url: "https://www.w3schools.com/js/" },
    { step: "4. React Mastery", desc: "Build dynamic SPAs using React Hooks, Context API, and state management libraries.", url: "https://www.w3schools.com/react/" },
  ],
  "backend": [
    { step: "1. Programming Language", desc: "Learn the core concepts of Python, including data structures, OOP, and modules.", url: "https://www.w3schools.com/python/" },
    { step: "2. Web Frameworks", desc: "Master Django or Flask to handle HTTP requests, routing, and middleware.", url: "https://www.w3schools.com/django/" },
    { step: "3. Databases & ORMs", desc: "Understand SQL, PostgreSQL, and how to interact with databases using Object-Relational Mappers.", url: "https://www.w3schools.com/sql/" },
    { step: "4. Building REST APIs", desc: "Design secure RESTful APIs with authentication (JWT) and proper error handling.", url: "https://www.w3schools.com/nodejs/nodejs_api.asp" },
  ],
  "fullstack": [
    { step: "1. Frontend Foundation", desc: "Master HTML, CSS, JavaScript, and a modern framework like React.", url: "https://www.w3schools.com/whatis/" },
    { step: "2. Backend Development", desc: "Build scalable server-side applications using Node.js/Express or Python/Django.", url: "https://www.w3schools.com/nodejs/" },
    { step: "3. Database Management", desc: "Learn both SQL (PostgreSQL) and NoSQL (MongoDB) database architectures.", url: "https://www.w3schools.com/mongodb/" },
    { step: "4. Integration & Deployment", desc: "Connect your frontend to your backend API and deploy full applications to platforms like Vercel or Heroku.", url: "https://www.w3schools.com/git/" },
  ],
  "ai": [
    { step: "1. Python & Math", desc: "Master Python programming along with Statistics, Linear Algebra, and Calculus fundamentals.", url: "https://www.w3schools.com/python/python_math.asp" },
    { step: "2. Data Analysis", desc: "Learn Pandas, NumPy, and Matplotlib to clean, process, and visualize complex datasets.", url: "https://www.w3schools.com/python/pandas/default.asp" },
    { step: "3. Machine Learning", desc: "Build predictive models using Scikit-Learn (Regression, Classification, Clustering).", url: "https://www.w3schools.com/python/python_ml_getting_started.asp" },
    { step: "4. Deep Learning & GenAI", desc: "Implement neural networks using PyTorch/TensorFlow and explore Large Language Models (LLMs).", url: "https://www.w3schools.com/ai/default.asp" },
  ],
  "cloud": [
    { step: "1. Cloud Fundamentals", desc: "Understand virtualization, networking, and core cloud services on AWS or Azure.", url: "https://www.w3schools.com/aws/" },
    { step: "2. Containerization", desc: "Learn Docker to package applications and their dependencies into portable containers.", url: "https://www.docker.com/101-tutorial/" },
    { step: "3. Orchestration", desc: "Master Kubernetes (K8s) to automate deployment, scaling, and management of containers.", url: "https://kubernetes.io/docs/tutorials/" },
    { step: "4. Infrastructure as Code", desc: "Use Terraform or CloudFormation to provision and manage cloud infrastructure automatically.", url: "https://developer.hashicorp.com/terraform/tutorials" },
  ],
  "android": [
    { step: "1. Programming Language", desc: "Master Java or Kotlin, focusing on object-oriented programming and memory management.", url: "https://www.w3schools.com/java/" },
    { step: "2. Android Studio & UI", desc: "Learn to build user interfaces using XML layouts and Jetpack Compose.", url: "https://developer.android.com/courses" },
    { step: "3. App Architecture", desc: "Implement MVVM architecture, Room database for local storage, and Retrofit for networking.", url: "https://developer.android.com/topic/architecture" },
    { step: "4. Publishing", desc: "Understand the Android build system (Gradle), app signing, and Google Play Store deployment.", url: "https://developer.android.com/studio/publish" },
  ]
};

const LearningRoadmap = () => {
  const { type } = useParams();
  const [completedSteps, setCompletedSteps] = useState([]);

  const roadmapSteps = roadmapDetails[type] || [
    { step: "1. The Fundamentals", desc: "Start by mastering the basics of this technology stack." },
    { step: "2. Build Projects", desc: "Apply your knowledge by building real-world applications." },
    { step: "3. Advanced Concepts", desc: "Dive deep into performance, security, and architecture." },
  ];

  useEffect(() => {
    document.title = `SkillForge - ${type.replace(/-/g, ' ').toUpperCase()}`;
    window.scrollTo(0, 0);

    const trackRoadmap = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const currentRoadmaps = userData.followedRoadmaps || [];
            
            // Check if already followed
            const existingRoadmap = currentRoadmaps.find(r => r.id === type);
            if (!existingRoadmap) {
              const newRoadmap = {
                id: type,
                name: type.replace(/-/g, ' ').toUpperCase(),
                progress: 0,
                completedSteps: []
              };
              await updateDoc(userRef, {
                followedRoadmaps: arrayUnion(newRoadmap)
              });
              setCompletedSteps([]);
            } else {
              setCompletedSteps(existingRoadmap.completedSteps || []);
            }
          }
        } catch (error) {
          console.error("Error tracking roadmap:", error);
        }
      }
    };

    trackRoadmap();
  }, [type]);

  const handleStepClick = async (index, url) => {
    if(url) window.open(url, '_blank', 'noopener,noreferrer');
    
    if (!auth.currentUser) return;
    
    if (!completedSteps.includes(index)) {
      const newCompletedSteps = [...completedSteps, index];
      setCompletedSteps(newCompletedSteps);
      
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const currentRoadmaps = userData.followedRoadmaps || [];
          
          const rIndex = currentRoadmaps.findIndex(r => r.id === type);
          if (rIndex !== -1) {
            const roadmap = currentRoadmaps[rIndex];
            const totalSteps = roadmapSteps.length;
            const newProgress = Math.min(100, Math.round((newCompletedSteps.length / totalSteps) * 100));
            
            currentRoadmaps[rIndex] = {
              ...roadmap,
              completedSteps: newCompletedSteps,
              progress: newProgress
            };
            
            await updateDoc(userRef, { followedRoadmaps: currentRoadmaps });
          }
        }
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    }
  };

  return (
    <div className="page-content bg-light-subtle min-vh-100 py-5">
      <Container>
        <div className="mb-5 d-flex align-items-center justify-content-between">
          <Link to="/roadmap" className="btn btn-outline-secondary hover-lift">
            &larr; Back to Roadmaps
          </Link>
        </div>

        <div className="glass-panel p-5 mb-5 text-center position-relative overflow-hidden">
          <div className="roadmap-hero-bg"></div>
          <div className="position-relative z-1">
            <Badge bg="primary" pill className="mb-3 px-3 py-2">Professional Track</Badge>
            <h1 className="display-4 fw-bold text-capitalize text-main mb-3">
              {type.replace(/-/g, ' ')}
            </h1>
            <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '700px' }}>
              Follow this structured, high-level curriculum to master the skills required and advance your career to a senior level.
            </p>
          </div>
        </div>

        <div className="roadmap-timeline position-relative py-4">
          {roadmapSteps.map((item, index) => (
            <div 
              className="timeline-item glass-panel p-4 mb-4 hover-lift" 
              key={index}
              onClick={() => handleStepClick(index, item.url)}
              style={{ cursor: item.url ? 'pointer' : 'default', borderLeft: completedSteps.includes(index) ? '4px solid #198754' : '' }}
            >
              <div className="d-flex align-items-start gap-4 flex-column flex-md-row">
                <div className={`step-indicator text-white fw-bold rounded-circle d-flex align-items-center justify-content-center shadow ${completedSteps.includes(index) ? 'bg-success' : 'bg-primary'}`} style={{ width: '50px', height: '50px', flexShrink: 0 }}>
                  {completedSteps.includes(index) ? '✓' : index + 1}
                </div>
                <div>
                  <h3 className="fw-bold mb-2 text-main">
                    {item.step.substring(item.step.indexOf('.') + 2)} 
                    {item.url && <span className="ms-2 fs-6 text-primary">↗</span>}
                    {completedSteps.includes(index) && <Badge bg="success" className="ms-3 fs-6">Completed</Badge>}
                  </h3>
                  <p className="text-muted mb-0 fs-6 lh-lg">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </div>
  );
};

export default LearningRoadmap;