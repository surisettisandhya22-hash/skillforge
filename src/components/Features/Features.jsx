import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Features.css";

const Features = () => {
  const features = [
    {
      icon: "📈",
      title: "Skill Tracking",
      desc: "Track your learning progress and improve consistently with visual metrics.",
      delay: "0.1s"
    },
    {
      icon: "🗺️",
      title: "Learning Roadmaps",
      desc: "Follow structured, industry-standard learning paths for every technology.",
      delay: "0.2s"
    },
    {
      icon: "📂",
      title: "Project Portfolio",
      desc: "Organize, document, and showcase your best development projects.",
      delay: "0.3s"
    },
    {
      icon: "🎯",
      title: "Interview Prep",
      desc: "Practice technical interview questions and build real-world confidence.",
      delay: "0.4s"
    }
  ];

  return (
    <section className="features-section py-5">
      <Container>
        <div className="text-center mb-5 features-header">
          <span className="hero-badge glass-panel mb-3">Capabilities</span>
          <h2 className="features-title display-5 fw-bold mb-3">
            Why Choose <span className="text-gradient">SkillForge?</span>
          </h2>
          <p className="features-subtitle lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Everything you need to go from beginner to senior developer, all in one powerful platform.
          </p>
        </div>

        <Row className="g-4">
          {features.map((feat, idx) => (
            <Col lg={3} md={6} key={idx}>
              <div 
                className="feature-card glass-panel hover-lift h-100 p-4" 
                style={{ animationDelay: feat.delay }}
              >
                <div className="feature-icon-wrapper mb-4">
                  <span className="feature-icon display-5">{feat.icon}</span>
                </div>
                <h5 className="fw-bold mb-3">{feat.title}</h5>
                <p className="text-muted mb-0">{feat.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Features;