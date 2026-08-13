import React from "react";
import { ProgressBar, Button, Badge } from "react-bootstrap";
import "./SkillCard.css";

const SkillCard = ({ skill, deleteSkill }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "success";
      case "In Progress": return "primary";
      case "Not Started": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="skill-card glass-panel h-100 hover-lift p-4 position-relative">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h4 className="fw-bold mb-1 text-main">{skill.skillName}</h4>
          <Badge bg="light" text="dark" className="border fw-normal tracking-wider text-uppercase">
            {skill.category}
          </Badge>
        </div>
        <Badge bg={getStatusColor(skill.status)} pill className="px-3 py-2 fw-semibold">
          {skill.status}
        </Badge>
      </div>

      <div className="mt-auto pt-3 border-top border-light">
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted small fw-semibold tracking-wider text-uppercase">Progress</span>
          <span className="fw-bold text-primary">{skill.progress}%</span>
        </div>
        <ProgressBar
          now={skill.progress}
          variant="primary"
          className="custom-progress mb-3"
        />

        <div className="d-flex justify-content-end">
          <Button
            variant="outline-danger"
            size="sm"
            className="hover-lift"
            onClick={() => deleteSkill(skill.id)}
          >
            🗑 Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;