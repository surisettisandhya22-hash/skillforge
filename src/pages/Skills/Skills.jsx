import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase";
import SkillForm from "../../components/SkillForm/SkillForm";
import SkillList from "../../components/SkillList/SkillList";
import "./Skills.css";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "SkillForge - My Skills";

    // IMPORTANT: Make sure you have added your Firebase config in src/firebase.js
    // Real-time subscription to the "skills" collection
    try {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      
      const skillsCollectionRef = collection(db, "skills");
      const q = query(skillsCollectionRef, where("userId", "==", auth.currentUser.uid));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const skillsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSkills(skillsData);
        setLoading(false);
      }, (err) => {
        console.error("Firebase Error: ", err);
        setError("Could not load skills. Please check your Firebase configuration.");
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Setup Error: ", err);
      setError("Firebase is not configured correctly. Please check src/firebase.js");
      setLoading(false);
    }

  }, []);

  const addSkill = async (newSkill) => {
    try {
      // Removing local ID generation since Firestore creates unique document IDs
      const { id, ...skillData } = newSkill; 
      const skillsCollectionRef = collection(db, "skills");
      await addDoc(skillsCollectionRef, {
        ...skillData,
        userId: auth.currentUser ? auth.currentUser.uid : null
      });
    } catch (err) {
      console.error("Error adding skill: ", err);
      alert("Failed to add skill. Please ensure your Firestore database is set up and permissions allow writes.");
    }
  };

  const deleteSkill = async (id) => {
    try {
      const skillDocRef = doc(db, "skills", id);
      await deleteDoc(skillDocRef);
    } catch (err) {
      console.error("Error deleting skill: ", err);
      alert("Failed to delete skill.");
    }
  };

  return (
    <div className="page-content bg-light-subtle min-vh-100 py-5">
      <Container>
        <div className="text-center mb-5">
           <span className="hero-badge glass-panel mb-2">Track Progress (Firestore)</span>
           <h2 className="display-5 fw-bold mb-3">
            My <span className="text-gradient">Skills</span>
          </h2>
          <p className="text-muted">Manage your technical arsenal securely in the cloud.</p>
        </div>

        {error && (
          <Alert variant="danger" className="text-center mb-4">
            {error}
          </Alert>
        )}

        <Row className="g-5">
          <Col lg={4}>
            <SkillForm addSkill={addSkill} />
          </Col>
          <Col lg={8}>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center h-100 min-vh-50">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <SkillList skills={skills} deleteSkill={deleteSkill} />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Skills;