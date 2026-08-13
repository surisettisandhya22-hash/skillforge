import React from "react";
import "./Hero.css";
import { Link } from "react-router-dom";
import heroImage from "../../assets/images/hero.jpeg";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <div className="container position-relative z-1">
        <div className="row align-items-center min-vh-100 py-5">
          {/* Left Side */}
          <div className="col-lg-6 text-center text-lg-start pe-lg-5 hero-content">
            <div className="hero-badge-wrapper mb-4">
              <span className="hero-badge glass-panel">
                <span className="me-2">🚀</span> Developer Growth Platform
              </span>
            </div>

            <h1 className="hero-title display-3 fw-bold mb-4">
              Build Skills.<br />
              <span className="text-gradient">Track Progress.</span><br />
              Achieve Goals.
            </h1>

            <p className="hero-description lead text-muted mb-5">
              SkillForge helps students and developers manage their learning journey, 
              organize projects, follow learning roadmaps, and become job-ready developers.
            </p>

            <div className="hero-actions d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
              <Link to="/roadmap" className="btn btn-primary btn-lg custom-btn hover-lift">
                Start Your Journey
              </Link>
              <Link to="/dashboard" className="btn btn-outline-secondary btn-lg custom-btn-outline hover-lift glass-panel">
                View Dashboard
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="col-lg-6 text-center mt-5 mt-lg-0">
            <div className="hero-image-wrapper hover-lift">
              <div className="image-decoration glass-panel"></div>
              <img
                src={heroImage}
                alt="Developer Working"
                className="img-fluid hero-image"
              />
              
              {/* Floating elements for visual interest */}
              <div className="floating-card card-1 glass-panel">
                <div className="d-flex align-items-center">
                  <div className="icon-box bg-success text-white me-3">✓</div>
                  <div>
                    <h6 className="mb-0 fw-bold">React Master</h6>
                    <small className="text-muted">Skill unlocked</small>
                  </div>
                </div>
              </div>
              
              <div className="floating-card card-2 glass-panel">
                 <div className="d-flex align-items-center">
                  <div className="icon-box bg-primary text-white me-3">🔥</div>
                  <div>
                    <h6 className="mb-0 fw-bold">30 Day Streak</h6>
                    <small className="text-muted">Keep it up!</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;