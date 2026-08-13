import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  const calculatePasswordStrength = (pass) => {
    if (!pass) return "";
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 1;

    if (score <= 1) return "Weak";
    if (score === 2 || score === 3) return "Medium";
    if (score >= 4) return "Strong";
    return "";
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordStrength(calculatePasswordStrength(val));
  };

  const validateForm = () => {
    // Name Validation
    // ^[A-Za-z]+(?: [A-Za-z]+)*$ ensures only letters, single spaces between words, no leading/trailing space
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (name.length < 2) {
      const msg = "Name must contain at least 2 characters.";
      alert(msg);
      return false;
    }
    if (!nameRegex.test(name)) {
      const msg = "Name must contain only alphabetic letters. No numbers, special characters, leading/trailing spaces, or multiple consecutive spaces.";
      alert(msg);
      return false;
    }

    // Email Validation
    // Standard strict email regex ensuring no spaces, one @, domain, and extension
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const msg = "Invalid Email! Must contain one @ symbol, a username, a domain name, a valid extension, and NO spaces.";
      alert(msg);
      return false;
    }

    // Password Validation
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return false;
    }

    const hasNumber = /\d/;
    if (!hasNumber.test(password)) {
      alert("Password must contain at least one number.");
      return false;
    }

    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (!hasSpecialChar.test(password)) {
      alert("Password must contain at least one special character.");
      return false;
    }

    const hasCapitalLetter = /[A-Z]/;
    if (!hasCapitalLetter.test(password)) {
      alert("Password must contain at least one capital letter.");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user details in Firestore with empty default profile data
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        role: "",
        about: "",
        skills: [],
        education: "",
        github: "",
        linkedin: "",
        projectsCount: 0,
        profilePic: "",
        createdAt: new Date().toISOString()
      });

      alert("Successfully registered!");
      
      setTimeout(() => {
        navigate("/login");
      }, 500);

    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        const msg = "User with this email already exists";
        alert(msg);
      } else if (err.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
        const msg = "Firebase Error: Your API keys are invalid. Please paste your real keys in src/firebase.js";
        alert(msg);
      } else {
        const msg = "Failed to register: " + err.message;
        alert(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        <h2>Join SkillForge</h2>
        <p className="auth-subtitle">Create an account to get started</p>
        
        <form onSubmit={handleRegister} className="auth-form">
          <div className="register-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className={passwordStrength ? `strength-input-${passwordStrength.toLowerCase()}` : ""}
                  required
                />
                <span 
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {passwordStrength && (
                <div className={`password-strength-indicator ${passwordStrength.toLowerCase()}`}>
                  {passwordStrength === "Weak" && "🔴 Weak"}
                  {passwordStrength === "Medium" && "🟡 Medium"}
                  {passwordStrength === "Strong" && "🟢 Strong"}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                />
                <span 
                  className="password-toggle-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
