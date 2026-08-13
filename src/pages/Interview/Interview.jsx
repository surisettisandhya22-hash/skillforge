import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Badge, Collapse, Spinner } from "react-bootstrap";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import roadmapData from "../../roadmapData/roadmapData";
import "./Interview.css";

const Interview = () => {
  const [expandedPath, setExpandedPath] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!activeTopic) {
        setCurrentQuestions([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const docRef = doc(db, 'mcqs', activeTopic);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentQuestions(docSnap.data().questions || []);
        } else {
          setCurrentQuestions([]);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [activeTopic]);

  useEffect(() => {
    document.title = "SkillForge - Interview Assignments";
  }, []);

  const handlePathClick = (path) => {
    setExpandedPath(expandedPath === path ? null : path);
  };

  const handleTopicClick = (topicId) => {
    if (activeTopic === topicId) return;
    setActiveTopic(topicId);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setShowValidation(false);
    setScore(0);
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
    if (showValidation) {
      setShowValidation(false);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < currentQuestions.length) {
      setShowValidation(true);
      const firstUnansweredIndex = currentQuestions.findIndex(q => selectedAnswers[q.id] === undefined);
      if (firstUnansweredIndex !== -1) {
        document.getElementById(`question-${firstUnansweredIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    let currentScore = 0;
    currentQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);

    // Save score to Firebase
    if (auth.currentUser) {
      try {
        await setDoc(
          doc(db, "users", auth.currentUser.uid, "interviewScores", activeTopic),
          {
            score: currentScore,
            total: currentQuestions.length,
            completedAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error saving score:", error);
      }
    }
    
    // Scroll to top to see the score
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to format topic names to match JSON keys
  const formatTopicId = (topic) => topic.toLowerCase().replace(/[^a-z0-9]/g, '');

  return (
    <div className="page-content bg-light-subtle min-vh-100 py-5">
      <Container>
        
        <div className="text-center mb-5">
          <span className="hero-badge glass-panel mb-2">Practice Assignments</span>
          <h2 className="display-5 fw-bold mb-3">
            Interview <span className="text-gradient">Assignments</span>
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Test your knowledge! Select a career path to view its modules, then complete the topic-specific assignments.
          </p>
        </div>

        <Row className="g-4">
          
          {/* Left Sidebar - Nested Topics */}
          <Col lg={3}>
            <div className="assignments-sidebar glass-panel p-3 sticky-top" style={{ top: '100px', maxHeight: '80vh', overflowY: 'auto' }}>
              <h5 className="fw-bold mb-4 px-2">Career Paths</h5>
              <div className="d-flex flex-column gap-2">
                {roadmapData.map(path => {
                  const subtopics = path.description.split(",").map(t => t.trim());
                  
                  return (
                    <div key={path.id} className="mb-2">
                      <button
                        className={`btn w-100 text-start p-3 fw-bold d-flex align-items-center justify-content-between sidebar-path-btn ${expandedPath === path.path ? 'bg-primary text-white shadow-sm' : 'bg-light text-dark'}`}
                        onClick={() => handlePathClick(path.path)}
                        style={{ borderRadius: '10px' }}
                      >
                        <span className="d-flex align-items-center gap-2">
                          <span className="fs-5">{path.icon}</span>
                          {path.title}
                        </span>
                        <span>{expandedPath === path.path ? '▼' : '▶'}</span>
                      </button>
                      
                      <Collapse in={expandedPath === path.path}>
                        <div className="pt-2 ps-3 pe-2">
                          <div className="d-flex flex-column gap-1 border-start border-2 border-primary border-opacity-25 ps-2">
                            {subtopics.map(topic => {
                              const topicId = formatTopicId(topic);
                              return (
                                <button
                                  key={topicId}
                                  className={`btn text-start py-2 px-3 fw-semibold sidebar-subtopic-btn ${activeTopic === topicId ? 'text-primary bg-primary bg-opacity-10' : 'text-muted'}`}
                                  onClick={() => handleTopicClick(topicId)}
                                  style={{ borderRadius: '8px' }}
                                >
                                  {topic}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </Collapse>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>

          {/* Right Panel - Quiz Area */}
          <Col lg={9}>
            <div className="quiz-container">
              
              {!activeTopic ? (
                <div className="text-center p-5 glass-panel d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                  <div className="mb-4 text-primary" style={{ fontSize: '4rem' }}>
                    📝
                  </div>
                  <h3 className="fw-bold text-main mb-3">Select a Topic to Start Assignment</h3>
                  <p className="text-muted fs-5" style={{ maxWidth: '500px' }}>
                    Choose a career path from the sidebar and select a specific topic to take an interactive multiple-choice assessment and test your knowledge.
                  </p>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold text-main text-capitalize d-flex align-items-center gap-2">
                      {activeTopic} Assessment
                    </h3>
                    
                    {isSubmitted && currentQuestions.length > 0 && (
                      <Badge bg={score === currentQuestions.length ? "success" : "primary"} className="fs-5 px-3 py-2 rounded-pill shadow-sm">
                        Score: {score} / {currentQuestions.length}
                      </Badge>
                    )}
                  </div>
    
                  {loading ? (
                    <div className="text-center p-5 glass-panel">
                      <Spinner animation="border" variant="primary" />
                      <h5 className="mt-3 text-muted">Loading questions...</h5>
                    </div>
                  ) : currentQuestions.length === 0 ? (
                    <div className="text-center p-5 glass-panel">
                      <h4 className="text-muted">No questions available yet for this topic.</h4>
                      <p>Select another topic from the sidebar.</p>
                    </div>
                  ) : (
                    currentQuestions.map((q, index) => {
                      const isUnanswered = showValidation && selectedAnswers[q.id] === undefined;
                      return (
                        <Card 
                          id={`question-${index}`}
                          className={`glass-panel mb-4 hover-lift ${isUnanswered ? 'border border-danger border-2' : 'border-0 shadow-sm'}`} 
                          key={q.id}
                        >
                          <Card.Body className="p-4">
                            <h5 className="fw-bold mb-4 d-flex align-items-center justify-content-between">
                              <span><span className={isUnanswered ? "text-danger me-2" : "text-primary me-2"}>Q{index + 1}.</span> {q.question}</span>
                              {isUnanswered && <Badge bg="danger">Required</Badge>}
                            </h5>
                          
                          <div className="options-list d-flex flex-column gap-3">
                            {q.options.map((opt, optIndex) => {
                              let optionClass = "option-card border rounded p-3 cursor-pointer transition-all";
                              
                              if (isSubmitted) {
                                if (optIndex === q.correctAnswer) {
                                  optionClass += " bg-success bg-opacity-10 border-success text-success fw-bold";
                                } else if (selectedAnswers[q.id] === optIndex) {
                                  optionClass += " bg-danger bg-opacity-10 border-danger text-danger text-decoration-line-through";
                                } else {
                                  optionClass += " bg-light text-muted opacity-50";
                                }
                              } else {
                                if (selectedAnswers[q.id] === optIndex) {
                                  optionClass += " bg-primary bg-opacity-10 border-primary text-primary fw-bold";
                                } else {
                                  optionClass += " bg-white border-light-subtle hover-bg-light";
                                }
                              }
    
                              return (
                                <div 
                                  key={optIndex} 
                                  className={optionClass}
                                  onClick={() => handleOptionSelect(q.id, optIndex)}
                                >
                                  <Form.Check 
                                    type="radio"
                                    id={`${q.id}-opt-${optIndex}`}
                                    label={opt}
                                    checked={selectedAnswers[q.id] === optIndex}
                                    onChange={() => handleOptionSelect(q.id, optIndex)}
                                    disabled={isSubmitted}
                                    className="m-0 pointer-events-none"
                                  />
                                </div>
                              );
                            })}
                          </div>
    
                          {isSubmitted && (
                            <div className="mt-4 p-3 bg-light rounded border-start border-4 border-info">
                              <span className="fw-bold text-info">Explanation: </span>
                              <span className="text-muted">{q.explanation}</span>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    )
                  })
                  )}
    
                  {currentQuestions.length > 0 && (
                    <div className="d-flex justify-content-end mt-4 mb-5">
                      {!isSubmitted ? (
                        <Button 
                          size="lg" 
                          variant="primary" 
                          className="custom-btn px-5 shadow"
                          onClick={handleSubmit}
                        >
                          Submit Assignment
                        </Button>
                      ) : (
                        <Button 
                          size="lg" 
                          variant="outline-secondary" 
                          className="hover-lift px-5 shadow-sm"
                          onClick={() => {
                            setSelectedAnswers({});
                            setIsSubmitted(false);
                            setScore(0);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          Retry Assignment
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default Interview;