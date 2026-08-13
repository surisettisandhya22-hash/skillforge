import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Statistics.css";

const Statistics = () => {
  const statistics = [
    { count: "5000+", title: "Students Enrolled", icon: "👨‍🎓", delay: "0.1s" },
    { count: "120+", title: "Skills Covered", icon: "🚀", delay: "0.2s" },
    { count: "50+", title: "Curated Roadmaps", icon: "🗺️", delay: "0.3s" },
    { count: "95%", title: "Success Rate", icon: "⭐", delay: "0.4s" }
  ];

  return (
    <section className="statistics-section py-5 position-relative">
      <div className="stat-bg-decorator"></div>
      <Container className="position-relative z-1">
        <Row className="g-4 justify-content-center">
          {statistics.map((item, index) => (
            <Col lg={3} md={6} sm={6} key={index}>
              <div 
                className="stat-card glass-panel text-center p-4 hover-lift"
                style={{ animationDelay: item.delay }}
              >
                <div className="stat-icon mb-3 fs-1">{item.icon}</div>
                <h2 className="display-5 fw-bold text-gradient mb-2">
                  {item.count}
                </h2>
                <p className="text-muted fw-semibold mb-0 text-uppercase tracking-wider">
                  {item.title}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Statistics;