import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Badge, Modal, Collapse, Form, Spinner } from "react-bootstrap";
import { collection, onSnapshot, doc, setDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import roadmapData from "../../roadmapData/roadmapData";
import "./Notes.css";

const Notes = () => {
  const [expandedPath, setExpandedPath] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [notesMap, setNotesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
    link: ""
  });

  useEffect(() => {
    document.title = "SkillForge - Study Notes";
    
    // Listen to the "notes" collection
    const notesCollectionRef = collection(db, "notes");
    const unsubscribe = onSnapshot(notesCollectionRef, (snapshot) => {
      // Let's just fetch all and assume the document ID is the topic.
    }, (error) => {
      console.error("Error fetching notes:", error);
    });

    // Actually, in the migration script, I wrote: 
    // `if (Array.isArray(notesData)) { ... } else { await setDoc(doc(db, 'notes', 'data'), notesData); }`
    // Since notesData is an object: { html: [], css: [] }, it was saved to the 'data' document!
    // Let's fetch that document and listen to changes.
    const fetchNotes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "notes"));
        let fetchedNotes = {};
        querySnapshot.forEach((docSnap) => {
          if (docSnap.id === 'data') {
            fetchedNotes = { ...fetchedNotes, ...docSnap.data() };
          } else {
             // If they added notes later to individual docs? Let's just assume we store all under 'data' or separate docs.
             // Actually, adding a new note should probably just be an update to the 'data' doc for simplicity, or we should change the schema.
             // Let's use the 'data' document as the main storage if it exists.
             fetchedNotes[docSnap.id] = docSnap.data();
          }
        });
        setNotesMap(fetchedNotes.data || fetchedNotes);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();

    return () => unsubscribe && unsubscribe();
  }, []);

  const handlePathClick = (path) => {
    setExpandedPath(expandedPath === path ? null : path);
  };

  const handleTopicClick = (topicId) => {
    if (activeTopic === topicId) return;
    setActiveTopic(topicId);
  };

  const formatTopicId = (topic) => topic.toLowerCase().replace(/[^a-z0-9]/g, '');

  const currentNotes = activeTopic ? ((notesMap.data && notesMap.data[activeTopic]) || notesMap[activeTopic] || []) : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNote(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      const newNoteData = {
        id: "note_" + Date.now(),
        ...newNote
      };
      
      const updatedTopicNotes = [...currentNotes, newNoteData];
      
      // We will save this back to the 'data' document in the 'notes' collection, 
      // or to a specific document named after the activeTopic. Let's do the latter for better scalability.
      await setDoc(doc(db, "notes", activeTopic), {
        notes: updatedTopicNotes
      }, { merge: true });

      // Update local state to reflect immediately
      setNotesMap(prev => ({
        ...prev,
        [activeTopic]: updatedTopicNotes
      }));

      setShowAddModal(false);
      setNewNote({ title: "", description: "", link: "" });
    } catch (error) {
      console.error("Error adding note: ", error);
      alert("Failed to add note.");
    }
  };

  return (
    <div className="page-content bg-light-subtle min-vh-100 py-5">
      <Container>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5">
          <div className="text-center text-md-start mb-3 mb-md-0">
             <span className="hero-badge glass-panel mb-2">Knowledge Base</span>
             <h2 className="display-5 fw-bold mb-0">
              Study <span className="text-gradient">Notes</span>
            </h2>
            <p className="text-muted mt-2">Browse technical notes organized by career path.</p>
          </div>

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

          {/* Right Panel - Notes Area */}
          <Col lg={9}>
            <div className="notes-container">
              
              {!activeTopic ? (
                <div className="text-center p-5 glass-panel d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                  <div className="mb-4 text-primary" style={{ fontSize: '4rem' }}>
                    📚
                  </div>
                  <h3 className="fw-bold text-main mb-3">Select a Topic to View Notes</h3>
                  <p className="text-muted fs-5" style={{ maxWidth: '500px' }}>
                    Choose a career path from the sidebar and select a specific topic to explore your study notes, save important resources, and track your learning progress.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <h3 className="fw-bold text-main text-capitalize d-flex align-items-center gap-2">
                      {activeTopic} Notes
                    </h3>
                  </div>

                  <Row className="g-4">
                    {loading ? (
                      <Col xs={12}>
                        <div className="text-center py-5">
                          <Spinner animation="border" variant="primary" />
                        </div>
                      </Col>
                    ) : currentNotes.length === 0 ? (
                      <Col xs={12}>
                        <div className="text-center p-5 glass-panel">
                          <h4 className="text-muted">No notes available yet for this topic.</h4>
                          <p>Click "+ Add New Note" to add one!</p>
                        </div>
                      </Col>
                    ) : (
                      currentNotes.map((note) => (
                        <Col lg={6} key={note.id}>
                          <div className="note-card glass-panel hover-lift h-100 p-4 d-flex flex-column position-relative overflow-hidden shadow-sm">
                            
                            <div className="note-decoration"></div>
                            
                            <div className="d-flex justify-content-between align-items-start mb-3 position-relative z-1">
                              <h4 className="fw-bold mb-0 pe-2 text-dark">{note.title}</h4>
                            </div>
            
                            <p className="text-muted flex-grow-1 position-relative z-1 line-clamp-3">
                              {note.description}
                            </p>
            
                            <div className="d-flex justify-content-end mt-3 pt-3 border-top border-light position-relative z-1">
                              {note.link ? (
                                <Button 
                                  as="a"
                                  href={note.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="hover-lift px-4"
                                >
                                  Read Official Docs
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="hover-lift px-4"
                                  onClick={() => setSelectedNote(note)}
                                >
                                  Read Full Note
                                </Button>
                              )}
                            </div>
            
                          </div>
                        </Col>
                      ))
                    )}
                  </Row>
                </>
              )}
            </div>
          </Col>

        </Row>
      </Container>

      {/* Read Note Modal */}
      <Modal show={!!selectedNote} onHide={() => setSelectedNote(null)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-primary">
            {selectedNote?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <Badge bg="primary" pill className="mb-3 text-capitalize px-3 py-2">
            {activeTopic}
          </Badge>
          <p className="text-muted lh-lg fs-5">
            {selectedNote?.description}
          </p>
          <div className="mt-4 p-3 bg-light rounded text-dark text-sm border-start border-4 border-primary">
            <em>This is a preview of the full note content. In a complete application, this would contain detailed markdown, code snippets, and study material.</em>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="secondary" onClick={() => setSelectedNote(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add New Note Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Note to <span className="text-capitalize text-primary">{activeTopic}</span></Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddNote}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Note Title</Form.Label>
              <Form.Control type="text" name="title" value={newNote.title} onChange={handleInputChange} required />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={4} name="description" value={newNote.description} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reference Link (Optional)</Form.Label>
              <Form.Control type="url" name="link" placeholder="https://..." value={newNote.link} onChange={handleInputChange} />
              <Form.Text className="text-muted">Link to official documentation or a helpful resource.</Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Note</Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </div>
  );
};

export default Notes;