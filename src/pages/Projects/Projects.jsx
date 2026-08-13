import React, { useState, useEffect } from "react";
import { Container, Row, Col, ProgressBar, Button, Badge, Modal, Form, Spinner } from "react-bootstrap";
import { collection, onSnapshot, addDoc, query, where, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./Projects.css";
import { FaLinkedin, FaPlus } from "react-icons/fa";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    status: "In Progress",
    technology: "",
    progress: 0,
    live: ""
  });

  useEffect(() => {
    document.title = "SkillForge - My Projects";
    
    const projectsCollectionRef = collection(db, "projects");
    
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();

    const q = query(projectsCollectionRef, where("userId", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "progress") {
      let newStatus = newProject.status;
      if (value !== "") {
        const num = parseInt(value, 10);
        if (num === 0) {
          newStatus = "Planning";
        } else if (num > 0 && num < 100) {
          newStatus = "In Progress";
        } else if (num >= 100) {
          newStatus = "Completed";
        }
      }
      setNewProject(prev => ({ ...prev, progress: value, status: newStatus }));
      return;
    }

    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        ...newProject,
        technology: newProject.technology.split(",").map(t => t.trim()).filter(t => t !== ""),
        progress: Number(newProject.progress),
        userId: auth.currentUser ? auth.currentUser.uid : null
      };
      
      if (editMode && editProjectId) {
        await updateDoc(doc(db, "projects", editProjectId), projectData);
      } else {
        await addDoc(collection(db, "projects"), projectData);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error("Error saving project: ", error);
      alert("Failed to save project.");
    }
  };

  const handleEditProject = (project) => {
    setEditMode(true);
    setEditProjectId(project.id);
    setNewProject({
      title: project.title,
      description: project.description,
      status: project.status,
      technology: project.technology ? project.technology.join(", ") : "",
      progress: project.progress,
      live: project.live || ""
    });
    setShowModal(true);
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project.");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setEditProjectId(null);
    setNewProject({
      title: "",
      description: "",
      status: "In Progress",
      technology: "",
      progress: 0,
      live: ""
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "success";
      case "In Progress": return "primary";
      case "Planning": return "info";
      default: return "secondary";
    }
  };

  return (
    <div className="page-content bg-light-subtle min-vh-100 py-5">
      <Container>
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5">
          <div className="text-center text-md-start mb-3 mb-md-0">
             <span className="hero-badge glass-panel mb-2">Portfolio</span>
             <h2 className="display-5 fw-bold mb-0">
              My <span className="text-gradient">Projects</span>
            </h2>
          </div>
          <div className="d-flex gap-3">
            <Button 
              className="custom-btn hover-lift d-flex align-items-center gap-2"
              onClick={() => setShowModal(true)}
            >
              <FaPlus /> Add New Project
            </Button>
            {userProfile?.linkedin && (
              <Button 
                variant="outline-primary"
                className="hover-lift d-flex align-items-center gap-2"
                onClick={() => window.open(userProfile.linkedin, '_blank')}
              >
                <FaLinkedin /> View More on LinkedIn
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center p-5 glass-panel">
            <h4 className="text-muted">No projects found.</h4>
            <p>Click "Add New Project" to create one!</p>
          </div>
        ) : (
          <Row className="g-4">
            {projects.map((project) => (
              <Col lg={4} md={6} key={project.id}>
                <div className="project-card glass-panel hover-lift h-100 p-4 d-flex flex-column">
                  
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h4 className="fw-bold text-main mb-0">{project.title}</h4>
                    <Badge bg={getStatusColor(project.status)} pill className="px-3 py-2 fw-semibold">
                      {project.status}
                    </Badge>
                  </div>

                  <p className="text-muted small mb-4 flex-grow-1">
                    {project.description}
                  </p>

                  <div className="mb-4">
                    <span className="text-muted small fw-semibold tracking-wider text-uppercase d-block mb-2">Technologies</span>
                    <div className="d-flex flex-wrap gap-2">
                      {project.technology?.map((tech, idx) => (
                        <Badge key={idx} bg="light" text="dark" className="border fw-normal text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-top border-light">
                     <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small fw-semibold tracking-wider text-uppercase">Progress</span>
                      <span className="fw-bold text-primary">{project.progress}%</span>
                    </div>
                    <ProgressBar
                      now={project.progress}
                      variant="primary"
                      className="custom-progress mb-4"
                    />

                    <div className="d-flex justify-content-between gap-2 mt-3">
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        className="flex-grow-1"
                        onClick={() => handleEditProject(project)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="flex-grow-1"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        Delete
                      </Button>
                      {project.live && (
                        <Button 
                          as="a"
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="primary" 
                          size="sm" 
                          className="hover-lift px-3 flex-grow-1"
                        >
                          Live Demo
                        </Button>
                      )}
                    </div>
                  </div>

                </div>
              </Col>
            ))}
          </Row>
        )}

      </Container>

      {/* Add/Edit Project Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Project" : "Add New Project"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddProject}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Project Title</Form.Label>
              <Form.Control type="text" name="title" value={newProject.title} onChange={handleInputChange} required />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={newProject.description} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={newProject.status} onChange={handleInputChange} disabled>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Technologies (Comma separated)</Form.Label>
              <Form.Control type="text" name="technology" placeholder="React, Node, MongoDB" value={newProject.technology} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Progress (%)</Form.Label>
              <Form.Control type="number" min="0" max="100" name="progress" value={newProject.progress} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Live URL (Optional)</Form.Label>
              <Form.Control type="url" name="live" placeholder="https://..." value={newProject.live} onChange={handleInputChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button variant="primary" type="submit">{editMode ? "Update Project" : "Save Project"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </div>
  );
};

export default Projects;