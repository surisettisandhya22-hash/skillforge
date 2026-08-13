import React from "react";
import { Row, Col } from "react-bootstrap";
import SkillCard from "../SkillCard/SkillCard";
import "./SkillList.css";

const SkillList = ({ skills, deleteSkill }) => {
  if (skills.length === 0) {
    return (
      <div className="glass-panel p-5 text-center h-100 d-flex flex-column align-items-center justify-content-center">
        <span className="display-1 mb-3">📭</span>
        <h4 className="fw-bold">No Skills Added Yet</h4>
        <p className="text-muted">Start by adding your first skill on the left.</p>
      </div>
    );
  }

  return (
    <Row className="g-4">
      {skills.map((skill) => (
        <Col md={6} key={skill.id}>
          <SkillCard skill={skill} deleteSkill={deleteSkill} />
        </Col>
      ))}
    </Row>
  );
};

export default SkillList;