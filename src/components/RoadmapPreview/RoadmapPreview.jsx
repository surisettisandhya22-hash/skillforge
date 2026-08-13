import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./RoadmapPreview.css";
import roadmapData from "../../roadmapData/roadmapData";

const RoadmapPreview = () => {

  const navigate = useNavigate();

  const careerPaths = roadmapData.slice(0, 4); // Show only top 4 on home page

  return (
    <section className="roadmap-section">

      <Container>

        <div className="text-center mb-5">
          <h2 className="roadmap-title">
            Learning Roadmaps
          </h2>

          <p className="roadmap-subtitle">
            Select your career path and start learning.
          </p>
        </div>

        <Row className="g-4">

          {careerPaths.map((career, index) => (

            <Col lg={3} md={6} key={index}>

              <Card className="roadmap-card h-100">

                <Card.Body className="text-center d-flex flex-column">

                  <div className="roadmap-icon fs-1 mb-3">
                    {career.icon}
                  </div>

                  <h4>{career.title}</h4>

                  <p className="text-muted">
                    {career.description}
                  </p>

                  <Button
                    className="mt-auto"
                    variant="primary"
                    onClick={() => navigate(`/learning/${career.path}`)}
                  >
                    Start Learning
                  </Button>

                </Card.Body>

              </Card>

            </Col>

          ))}

        </Row>

      </Container>

    </section>
  );
};

export default RoadmapPreview;