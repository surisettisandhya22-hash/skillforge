import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./SkillForm.css";

const SkillForm = ({ addSkill }) => {
  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState("");
  const [progress, setProgress] = useState("");
  const [status, setStatus] = useState("");

  const handleProgressChange = (e) => {
    const val = e.target.value;
    setProgress(val);
    
    if (val === "") {
      setStatus("");
      return;
    }
    
    const num = parseInt(val, 10);
    if (num === 0) {
      setStatus("Not Started");
    } else if (num > 0 && num < 100) {
      setStatus("In Progress");
    } else if (num === 100) {
      setStatus("Completed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSkill = {
      id: Date.now(),
      skillName,
      category,
      progress: parseInt(progress, 10),
      status
    };
    addSkill(newSkill);
    setSkillName("");
    setCategory("");
    setProgress("");
    setStatus("");
  };

  return (
    <div className="glass-panel p-4 h-100">
      <h4 className="mb-4 fw-bold">Add New Skill</h4>
      <Form onSubmit={handleSubmit} className="custom-form">
        
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold text-muted small text-uppercase tracking-wider">Skill Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., React JS"
            className="custom-input"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold text-muted small text-uppercase tracking-wider">Category</Form.Label>
          <Form.Select
            className="custom-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="Programming">Programming</option>
            <option value="Tools">Tools</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold text-muted small text-uppercase tracking-wider">Progress (%)</Form.Label>
          <Form.Control
            type="number"
            placeholder="0 - 100"
            className="custom-input"
            value={progress}
            onChange={handleProgressChange}
            min="0"
            max="100"
            required
          />
        </Form.Group>

        <Form.Group className="mb-5">
          <Form.Label className="fw-semibold text-muted small text-uppercase tracking-wider">Status</Form.Label>
          <Form.Select
            className="custom-input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled
            required
          >
            <option value="">Select Status</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" className="custom-btn w-100 hover-lift">
          + Add Skill
        </Button>
      </Form>
    </div>
  );
};

export default SkillForm;