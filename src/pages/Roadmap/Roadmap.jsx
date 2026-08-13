import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import roadmapData from "../../roadmapData/roadmapData";
import "./Roadmap.css";

const Roadmap = () => {
  useEffect(() => {
    document.title = "SkillForge - Roadmaps";
  }, []);

  return (
    <div className="page-content bg-light-subtle min-vh-100 py-5">
      <Container>
        
        <div className="text-center mb-5">
          <span className="hero-badge glass-panel mb-2">Curriculum</span>
          <h2 className="display-5 fw-bold mb-3">
            Learning <span className="text-gradient">Roadmaps</span>
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Select your career path and follow structured, industry-standard guides to become a senior developer.
          </p>
        </div>

        <Row className="g-4">
          {roadmapData.map((roadmap) => (
            <Col lg={4} md={6} key={roadmap.id}>
              <div className="roadmap-card glass-panel hover-lift h-100 p-5 text-center d-flex flex-column">
                
                <div className="roadmap-icon-wrapper mb-4 mx-auto">
                  <span className="display-3">{roadmap.icon}</span>
                </div>
                
                <h4 className="fw-bold mb-3">{roadmap.title}</h4>
                <p className="text-muted flex-grow-1">{roadmap.description}</p>
                
                <Link to={`/learning/${roadmap.path}`} className="btn custom-btn w-100 mt-4 hover-lift">
                  Start Learning
                </Link>
                
              </div>
            </Col>
          ))}
        </Row>

      </Container>
    </div>
  );
};

export default Roadmap;