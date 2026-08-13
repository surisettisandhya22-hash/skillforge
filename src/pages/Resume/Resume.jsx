import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Tab, Nav, Badge, Spinner } from "react-bootstrap";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./Resume.css";

const Resume = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  
  // Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedResumeBase64, setUploadedResumeBase64] = useState(null);

  // Generate State
  const [resumeData, setResumeData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    languages: [],
    certificates: "",
    projects: "",
    strengths: "",
    achievements: ""
  });

  useEffect(() => {
    document.title = "SkillForge - Resume";
    const fetchUserData = async () => {
      if (!auth.currentUser) return;
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserProfile(data);
          
          if (data.resumeFile) {
            setUploadedResumeBase64(data.resumeFile);
          }
          
          if (data.generatedResume) {
            let fetchedResume = data.generatedResume;
            // Backward compatibility: convert old string languages to array
            if (typeof fetchedResume.languages === "string") {
              fetchedResume.languages = fetchedResume.languages 
                ? fetchedResume.languages.split(",").map(l => ({ name: l.trim(), level: "Fluent" })) 
                : [];
            }
            if (!fetchedResume.languages) fetchedResume.languages = [];
            
            setResumeData(fetchedResume);
          } else {
            // Auto populate from profile if available
            setResumeData(prev => ({
              ...prev,
              name: data.name || "",
              email: data.email || "",
              skills: data.skills ? data.skills.join(", ") : ""
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Please upload a file smaller than 2MB.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !auth.currentUser) return;
    setUploading(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = async () => {
        const base64String = reader.result;
        
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          { resumeFile: base64String },
          { merge: true }
        );
        
        setUploadedResumeBase64(base64String);
        setSelectedFile(null);
        alert("Resume uploaded successfully!");
      };
      reader.onerror = (error) => {
        console.error("Error converting file: ", error);
        alert("Error reading file.");
      };
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (index, field, value) => {
    const newLanguages = [...(resumeData.languages || [])];
    if (!newLanguages[index]) newLanguages[index] = { name: "", level: "Fluent" };
    newLanguages[index][field] = value;
    setResumeData(prev => ({ ...prev, languages: newLanguages }));
  };

  const addLanguage = () => {
    setResumeData(prev => ({ 
      ...prev, 
      languages: [...(prev.languages || []), { name: "", level: "Fluent" }] 
    }));
  };

  const removeLanguage = (index) => {
    setResumeData(prev => ({ 
      ...prev, 
      languages: (prev.languages || []).filter((_, i) => i !== index) 
    }));
  };

  const handleSaveGeneratedResume = async () => {
    if (!auth.currentUser) return;
    try {
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        { generatedResume: resumeData },
        { merge: true }
      );
      alert("Resume saved successfully!");
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume.");
    }
  };

  if (loading) {
    return (
      <div className="page-content bg-light-subtle min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="page-content bg-light-subtle min-vh-100 py-5">
      <Container className="resume-container">
        
        <div className="text-center mb-5">
          <span className="hero-badge glass-panel mb-2">Career Profile</span>
          <h2 className="display-5 fw-bold mb-3">
            Manage <span className="text-gradient">Resume</span>
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Upload your existing professional resume or use our built-in tool to create one instantly from your SkillForge profile.
          </p>
        </div>

        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <div className="resume-tabs d-flex justify-content-center mb-5">
            <Nav variant="pills" className="glass-panel p-2 rounded-pill gap-2 shadow-sm">
              <Nav.Item>
                <Nav.Link eventKey="upload">Upload Resume</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="create">Create Resume</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          <Tab.Content>
            {/* UPLOAD RESUME TAB */}
            <Tab.Pane eventKey="upload">
              <div className="glass-panel p-5 max-w-3xl mx-auto text-center">
                <h3 className="fw-bold mb-4">Upload Your Resume</h3>
                
                <div className="upload-area mb-4">
                  <div className="upload-icon">📄</div>
                  <h5 className="mb-2">Select a PDF or Word Document</h5>
                  <p className="text-muted mb-4 fs-6">Maximum file size: 2MB</p>
                  
                  <Form.Group>
                    <Form.Control 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      onChange={handleFileChange}
                      className="custom-file-input mx-auto w-auto"
                    />
                  </Form.Group>
                  
                  {selectedFile && (
                    <div className="mt-3 p-3 bg-light rounded text-success fw-bold">
                      Selected: {selectedFile.name}
                    </div>
                  )}
                </div>

                <Button 
                  variant="primary" 
                  size="lg" 
                  className="custom-btn px-5 shadow"
                  onClick={handleFileUpload}
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? <Spinner animation="border" size="sm" /> : "Upload to Profile"}
                </Button>

                {uploadedResumeBase64 && (
                  <div className="mt-5 pt-4 border-top">
                    <h5 className="fw-bold text-success mb-3">✓ Resume is currently uploaded on your profile</h5>
                    <Button 
                      variant="outline-primary"
                      as="a"
                      href={uploadedResumeBase64}
                      download="My_Resume"
                    >
                      Download Current Resume
                    </Button>
                  </div>
                )}
              </div>
            </Tab.Pane>

            {/* CREATE RESUME TAB */}
            <Tab.Pane eventKey="create">
              <Row className="g-4">
                <Col lg={5}>
                  <div className="glass-panel p-4 h-100" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
                    <h4 className="fw-bold mb-4 position-sticky top-0 bg-white py-2 z-1" style={{ background: 'rgba(255,255,255,0.9)' }}>Resume Details</h4>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Full Name</Form.Label>
                        <Form.Control type="text" name="name" value={resumeData.name} onChange={handleInputChange} />
                      </Form.Group>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Email Address</Form.Label>
                            <Form.Control type="email" name="email" value={resumeData.email} onChange={handleInputChange} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Phone Number</Form.Label>
                            <Form.Control type="tel" name="phone" value={resumeData.phone} onChange={handleInputChange} />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Location (State, Country)</Form.Label>
                        <Form.Control type="text" name="location" value={resumeData.location} onChange={handleInputChange} placeholder="E.g., California, USA" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Professional Summary</Form.Label>
                        <Form.Control as="textarea" rows={3} name="summary" value={resumeData.summary} onChange={handleInputChange} placeholder="Brief overview of your career goals and expertise..." />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Skills (Comma separated)</Form.Label>
                        <Form.Control type="text" name="skills" value={resumeData.skills} onChange={handleInputChange} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold d-flex justify-content-between align-items-center mb-2">
                          Languages
                          <Button variant="outline-primary" size="sm" onClick={addLanguage}>+ Add Language</Button>
                        </Form.Label>
                        {(resumeData.languages || []).map((lang, index) => (
                          <div key={index} className="d-flex gap-2 mb-2">
                            <Form.Control 
                              type="text" 
                              placeholder="E.g. English" 
                              value={lang.name} 
                              onChange={(e) => handleLanguageChange(index, 'name', e.target.value)} 
                            />
                            <Form.Select 
                              value={lang.level} 
                              onChange={(e) => handleLanguageChange(index, 'level', e.target.value)}
                              style={{ width: '150px' }}
                            >
                              <option value="Native">Native</option>
                              <option value="Fluent">Fluent</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Beginner">Beginner</option>
                            </Form.Select>
                            <Button variant="outline-danger" onClick={() => removeLanguage(index)}>✕</Button>
                          </div>
                        ))}
                        {(!resumeData.languages || resumeData.languages.length === 0) && (
                          <div className="text-muted small mb-2 fst-italic">Click "+ Add Language" to add proficiencies.</div>
                        )}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Strengths</Form.Label>
                        <Form.Control type="text" name="strengths" value={resumeData.strengths} onChange={handleInputChange} placeholder="E.g., Problem Solving, Team Leadership..." />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Experience</Form.Label>
                        <Form.Control as="textarea" rows={4} name="experience" value={resumeData.experience} onChange={handleInputChange} placeholder="E.g., Software Engineer at Tech Corp (2020-2023)..." />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Education</Form.Label>
                        <Form.Control as="textarea" rows={3} name="education" value={resumeData.education} onChange={handleInputChange} placeholder="E.g., B.S. Computer Science, University (2016-2020)" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Projects</Form.Label>
                        <Form.Control as="textarea" rows={3} name="projects" value={resumeData.projects} onChange={handleInputChange} placeholder="E.g., E-commerce App: Built with React & Node..." />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Certificates</Form.Label>
                        <Form.Control as="textarea" rows={2} name="certificates" value={resumeData.certificates} onChange={handleInputChange} placeholder="E.g., AWS Certified Developer..." />
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Achievements</Form.Label>
                        <Form.Control as="textarea" rows={2} name="achievements" value={resumeData.achievements} onChange={handleInputChange} placeholder="E.g., Won 1st place in Hackathon 2023..." />
                      </Form.Group>
                      
                      <Button variant="primary" className="custom-btn w-100 position-sticky bottom-0" onClick={handleSaveGeneratedResume}>
                        Save Resume Details
                      </Button>
                    </Form>
                  </div>
                </Col>

                <Col lg={7}>
                  <div className="resume-preview-card h-100" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
                    <div className="resume-header">
                      <h1 className="text-uppercase">{resumeData.name || "Your Name"}</h1>
                      <div className="contact-info">
                        <span>✉ {resumeData.email || "email@example.com"}</span>
                        {resumeData.phone && <span>☎ {resumeData.phone}</span>}
                        {resumeData.location && <span>📍 {resumeData.location}</span>}
                      </div>
                    </div>

                    <div className="resume-body">
                      {/* LEFT COLUMN */}
                      <div className="resume-left-col">
                        <div className="resume-section">
                          <h2 className="resume-section-title">Skills</h2>
                          <div>
                            {resumeData.skills ? resumeData.skills.split(",").map((s, i) => (
                              <span className="resume-skill-tag" key={i}>{s.trim()}</span>
                            )) : (
                              <span className="text-muted fs-6">No skills listed.</span>
                            )}
                          </div>
                        </div>

                        {resumeData.languages && resumeData.languages.length > 0 && resumeData.languages.some(l => l.name) && (
                          <div className="resume-section">
                            <h2 className="resume-section-title">Languages</h2>
                            <div className="d-flex flex-column gap-2 w-100">
                              {resumeData.languages.filter(l => l.name).map((l, i) => (
                                <div key={i} className="d-flex justify-content-between w-100 align-items-center">
                                  <span className="fw-semibold text-dark text-capitalize" style={{ fontSize: '0.95rem' }}>{l.name}</span>
                                  <span className="text-muted fst-italic" style={{ fontSize: '0.85rem' }}>{l.level}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {resumeData.strengths && (
                          <div className="resume-section">
                            <h2 className="resume-section-title">Strengths</h2>
                            <div>
                              {resumeData.strengths.split(",").map((s, i) => (
                                <span className="resume-skill-tag" key={i}>{s.trim()}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {resumeData.certificates && (
                          <div className="resume-section">
                            <h2 className="resume-section-title">Certificates</h2>
                            <div className="resume-item">
                              <p className="fs-6" style={{ whiteSpace: 'pre-wrap' }}>
                                {resumeData.certificates}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* RIGHT COLUMN */}
                      <div className="resume-right-col">
                        <div className="resume-section">
                          <h2 className="resume-section-title">Professional Summary</h2>
                          <p>{resumeData.summary || "Your professional summary will appear here."}</p>
                        </div>

                        <div className="resume-section">
                          <h2 className="resume-section-title">Experience</h2>
                          <div className="resume-item">
                            <p style={{ whiteSpace: 'pre-wrap' }}>
                              {resumeData.experience || "Your work experience details."}
                            </p>
                          </div>
                        </div>

                        {resumeData.projects && (
                          <div className="resume-section">
                            <h2 className="resume-section-title">Projects</h2>
                            <div className="resume-item">
                              <p style={{ whiteSpace: 'pre-wrap' }}>
                                {resumeData.projects}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="resume-section">
                          <h2 className="resume-section-title">Education</h2>
                          <div className="resume-item">
                            <p style={{ whiteSpace: 'pre-wrap' }}>
                              {resumeData.education || "Your educational background."}
                            </p>
                          </div>
                        </div>

                        {resumeData.achievements && (
                          <div className="resume-section">
                            <h2 className="resume-section-title">Achievements</h2>
                            <div className="resume-item">
                              <p style={{ whiteSpace: 'pre-wrap' }}>
                                {resumeData.achievements}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        
      </Container>
    </div>
  );
};

export default Resume;
