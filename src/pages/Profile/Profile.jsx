import React, { useState, useEffect } from "react";
import { Container, Row, Col, Badge, Button, Modal, Form, Spinner } from "react-bootstrap";
import "./Profile.css";
import { FaGithub, FaLinkedin, FaGraduationCap, FaEdit } from "react-icons/fa";
import { auth, db, storage } from "../../firebase";
import { doc, getDoc, updateDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [projectsCount, setProjectsCount] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    let unsubscribeProjects;

    const fetchProfile = async () => {
      if (auth.currentUser) {
        try {
          const docRef = doc(db, "users", auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          } else {
            console.log("No such document!");
          }

          const projectsQ = query(collection(db, "projects"), where("userId", "==", auth.currentUser.uid));
          unsubscribeProjects = onSnapshot(projectsQ, (snapshot) => {
            setProjectsCount(snapshot.size);
          });
          
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
      setLoading(false);
    };

    fetchProfile();

    return () => {
      if (unsubscribeProjects) unsubscribeProjects();
    };
  }, []);

  useEffect(() => {
    if (profileData) {
      document.title = `SkillForge - ${profileData.name || 'User'}'s Profile`;
    }
  }, [profileData]);

  const handleEditClick = () => {
    setEditFormData({
      ...profileData,
      skills: profileData?.skills && Array.isArray(profileData.skills) 
        ? profileData.skills.join(', ') 
        : profileData?.skills || ""
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(blob);
          }, "image/jpeg", 0.8);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleDirectImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !auth.currentUser) return;

    setUploadingImage(true);
    
    try {
      const compressedBlob = await compressImage(file);
      const base64Image = await blobToBase64(compressedBlob);

      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, { profilePic: base64Image });
      
      setProfileData((prev) => ({ ...prev, profilePic: base64Image }));
      
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to update profile picture: " + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const dataToSave = {
        ...editFormData,
        skills: typeof editFormData.skills === 'string'
          ? editFormData.skills.split(',').map(s => s.trim()).filter(s => s !== "")
          : editFormData.skills || []
      };
      await updateDoc(docRef, dataToSave);
      setProfileData(dataToSave);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content bg-light-subtle min-vh-100 py-5 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="page-content bg-light-subtle min-vh-100 py-5 d-flex justify-content-center align-items-center">
        <h4 className="text-muted">Profile not found. Please log in again.</h4>
      </div>
    );
  }

  return (
    <div className="page-content bg-light-subtle min-vh-100 py-5">
      <Container>

        <div className="profile-header glass-panel position-relative mb-5 p-5">
          <div className="profile-cover"></div>
          
          <Row className="position-relative z-1 align-items-center mt-md-0">
            <Col lg={3} className="text-center text-lg-start mb-4 mb-lg-0">
              <div className="profile-image-container position-relative mx-auto mx-lg-0 shadow-lg d-inline-block">
                <img
                  src={profileData.profilePic || "https://placehold.co/200x200?text=Profile"}
                  alt={profileData.name}
                  className="profile-image"
                  style={{ opacity: uploadingImage ? 0.5 : 1 }}
                />
                <label 
                  htmlFor="mainProfilePicUpload" 
                  className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex justify-content-center align-items-center shadow"
                  style={{ width: '45px', height: '45px', cursor: 'pointer', border: '3px solid white', fontSize: '1.8rem', fontWeight: 'bold', transform: 'translate(5px, 5px)' }}
                  title="Change Profile Picture"
                >
                  {uploadingImage ? <Spinner animation="border" size="sm" /> : "+"}
                </label>
                <input 
                  id="mainProfilePicUpload"
                  type="file" 
                  accept="image/*" 
                  onChange={handleDirectImageUpload} 
                  className="d-none"
                  disabled={uploadingImage}
                />
              </div>
            </Col>
            
            <Col lg={6} className="text-center text-lg-start">
              <h2 className="display-6 fw-bold mb-1">{profileData.name}</h2>
              <p className="text-primary fs-5 fw-semibold mb-3">{profileData.role || "No Role Set"}</p>
              
              <div className="d-flex justify-content-center justify-content-lg-start gap-3">
                {profileData.github && (
                  <a
                    href={profileData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn custom-btn d-flex align-items-center gap-2 px-4 hover-lift text-decoration-none"
                  >
                    <FaGithub /> View on GitHub
                  </a>
                )}
                {profileData.linkedin && (
                  <a
                    href={profileData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn custom-btn-outline d-flex align-items-center gap-2 px-4 hover-lift glass-panel text-decoration-none"
                  >
                    <FaLinkedin /> View on LinkedIn
                  </a>
                )}
              </div>
            </Col>

            <Col lg={3} className="d-flex justify-content-center justify-content-lg-end mt-4 mt-lg-0">
               <div className="d-flex flex-row flex-lg-column gap-3 text-center text-lg-end">
                  <Button variant="outline-primary" onClick={handleEditClick} className="glass-panel hover-lift px-4 py-2 d-flex align-items-center gap-2 fw-semibold border-2 rounded-pill">
                    <FaEdit /> Edit Profile
                  </Button>
                  <div className="stat-block glass-panel px-4 py-2 hover-lift mt-lg-3 rounded-4 border">
                    <h3 className="fw-bold text-main mb-0">{projectsCount}</h3>
                    <p className="text-muted small text-uppercase tracking-wider mb-0">Projects</p>
                  </div>
               </div>
            </Col>
          </Row>
        </div>

        <Row className="g-4">
          <Col lg={8}>
            <div className="glass-panel p-4 p-md-5 h-100 mb-4 mb-lg-0">
              <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <span className="text-primary">👤</span> About Me
              </h4>
              <p className="text-muted lh-lg mb-0">{profileData.about || "Write something about yourself..."}</p>
              
              <hr className="my-5 text-muted opacity-25" />

              <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <FaGraduationCap className="text-primary" /> Education
              </h4>
              <div className="education-card p-3 bg-light rounded border border-light-subtle">
                <p className="fw-semibold mb-0">{profileData.education || "No education details provided."}</p>
              </div>
            </div>
          </Col>

          <Col lg={4}>
            <div className="glass-panel p-4 p-md-5 h-100">
              <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <span className="text-primary">🚀</span> Top Skills
              </h4>
              <div className="d-flex flex-wrap gap-2">
                {profileData.skills && profileData.skills.length > 0 ? (
                  profileData.skills.map((skill, index) => (
                    <Badge
                      bg="transparent"
                      text="dark"
                      className="border border-primary text-primary px-3 py-2 fw-semibold tracking-wider hover-lift"
                      key={index}
                      style={{ fontSize: '0.85rem' }}
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted">No skills added yet.</p>
                )}
              </div>
            </div>
          </Col>
        </Row>

      </Container>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-bold text-primary">Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Name</Form.Label>
                  <Form.Control type="text" name="name" value={editFormData.name || ""} onChange={handleEditChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Role</Form.Label>
                  <Form.Control type="text" name="role" value={editFormData.role || ""} onChange={handleEditChange} placeholder="e.g. Frontend Developer" />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">About Me</Form.Label>
              <Form.Control as="textarea" rows={3} name="about" value={editFormData.about || ""} onChange={handleEditChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Education</Form.Label>
              <Form.Control type="text" name="education" value={editFormData.education || ""} onChange={handleEditChange} placeholder="e.g. B.Tech in Computer Science" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Skills (comma separated)</Form.Label>
              <Form.Control type="text" name="skills" value={editFormData.skills || ""} onChange={handleEditChange} placeholder="React, Node.js, Python" />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">GitHub Profile URL</Form.Label>
                  <Form.Control type="url" name="github" value={editFormData.github || ""} onChange={handleEditChange} placeholder="https://github.com/yourusername" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">LinkedIn Profile URL</Form.Label>
                  <Form.Control type="url" name="linkedin" value={editFormData.linkedin || ""} onChange={handleEditChange} placeholder="https://linkedin.com/in/yourusername" />
                </Form.Group>
              </Col>
            </Row>

            {/* Profile Picture is handled directly on the main profile page */}

          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top-0 pt-0">
          <Button variant="secondary" onClick={() => setShowEditModal(false)} className="rounded-pill px-4">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveProfile} disabled={saving} className="rounded-pill px-4">
            {saving ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Profile;