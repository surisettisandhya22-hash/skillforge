import React, { useState, useEffect } from "react";
import { Container, Row, Col, ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./Dashboard.css";

const Dashboard = () => {
  const [skillsCount, setSkillsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [interviewQsCount, setInterviewQsCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    document.title = "SkillForge - Dashboard";

    if (!auth.currentUser) return;

    // Fetch User Profile
    const fetchProfile = async () => {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserProfile(userSnap.data());
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();

    // Fetch Skills Count
    const skillsQ = query(collection(db, "skills"), where("userId", "==", auth.currentUser.uid));
    const unsubscribeSkills = onSnapshot(skillsQ, (snapshot) => {
      setSkillsCount(snapshot.size);
    });

    // Fetch Projects Count
    const projectsQ = query(collection(db, "projects"), where("userId", "==", auth.currentUser.uid));
    const unsubscribeProjects = onSnapshot(projectsQ, (snapshot) => {
      setProjectsCount(snapshot.size);
    });

    // Fetch Interview Qs Count
    const interviewRef = collection(db, "users", auth.currentUser.uid, "interviewScores");
    const unsubscribeInterview = onSnapshot(interviewRef, (snapshot) => {
      let totalQs = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.total) totalQs += data.total;
      });
      setInterviewQsCount(totalQs);
    });

    return () => {
      unsubscribeSkills();
      unsubscribeProjects();
      unsubscribeInterview();
    };
  }, []);

  const metrics = [
    { title: "Skills Mastered", count: skillsCount, icon: "💻", color: "primary" },
    { title: "Active Projects", count: projectsCount, icon: "📂", color: "success" },
    { title: "Roadmaps Followed", count: userProfile?.followedRoadmaps?.length || 0, icon: "🗺️", color: "info" },
    { title: "Interview Qs", count: interviewQsCount, icon: "🎯", color: "warning" }
  ];

  return (
    <div className="page-content bg-light-subtle min-vh-100 py-5">
      <Container>
        {/* Welcome Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5">
          <div className="dashboard-header-text">
            <h2 className="fw-bold mb-2">👋 Welcome Back, <span className="text-gradient">{userProfile?.name ? userProfile.name.split(' ')[0] : 'Developer'}</span></h2>
            <p className="text-muted mb-0 fs-5">Continue your learning journey today.</p>
          </div>
          <div className="mt-3 mt-md-0">
            <span className="hero-badge glass-panel text-success">
              🔥 7 Day Streak
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <Row className="g-4 mb-5">
          {metrics.map((metric, index) => (
            <Col lg={3} md={6} key={index}>
              <div className="dashboard-card glass-panel hover-lift p-4 h-100 d-flex flex-column justify-content-center align-items-center text-center">
                <div className={`metric-icon-box bg-${metric.color}-subtle text-${metric.color} mb-3`}>
                  {metric.icon}
                </div>
                <h2 className="display-5 fw-bold text-main mb-1">{metric.count}</h2>
                <p className="text-muted text-uppercase tracking-wider fw-semibold mb-0">{metric.title}</p>
              </div>
            </Col>
          ))}
        </Row>

        {/* Bottom Section */}
        <Row className="g-4">
          <Col lg={8}>
            <div className="glass-panel p-5 h-100">
              <h4 className="fw-bold mb-4">Learning Progress</h4>
              {userProfile?.followedRoadmaps && userProfile.followedRoadmaps.length > 0 ? (
                userProfile.followedRoadmaps.map((roadmap, index) => (
                  <div className="progress-wrapper mb-4" key={index}>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-semibold">{roadmap.name}</span>
                      <span className="fw-bold text-primary">{roadmap.progress}%</span>
                    </div>
                    <ProgressBar now={roadmap.progress} variant={index % 2 === 0 ? "primary" : "success"} className="custom-progress" />
                  </div>
                ))
              ) : (
                <div className="text-muted text-center py-4">
                  <p>No roadmaps followed yet.</p>
                  <Link to="/roadmap" className="btn btn-outline-primary btn-sm">Explore Roadmaps</Link>
                </div>
              )}
            </div>
          </Col>

          <Col lg={4}>
            <div className="glass-panel p-5 h-100 d-flex flex-column">
              <h4 className="fw-bold mb-4">Quick Actions</h4>
              
              <Link to="/skills" className="btn custom-btn w-100 mb-3 hover-lift d-flex align-items-center justify-content-center gap-2">
                <span>+</span> Add New Skill
              </Link>
              
              <Link to="/projects" className="btn btn-outline-success custom-btn-outline w-100 hover-lift d-flex align-items-center justify-content-center gap-2">
                <span>+</span> Add Project
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;