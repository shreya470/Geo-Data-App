import React, { useRef, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css"; // Import the CSS styles

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const phoneref = useRef();
  const nameref = useRef();

  function handleSubmit(e) {
    setError("");
    setLoading(true);
    e.preventDefault();
    if (passwordRef.current.value.length < 6) {
      setLoading(false);
      return setError("Password too short, at least 6 characters are required.");
    }
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setLoading(false);
      return setError("Passwords do not match");
    }

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const phone = phoneref.current.value;
    const name = nameref.current.value;

    axios
      .post("http://localhost:3001/signup", {
        name,
        email,
        password,
        phone,
      })
      .then(() => {
        axios
          .post("http://localhost:3001/signin", {
            email,
            password,
          })
          .then((response) => {
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
          })
          .catch((err) => {
            setLoading(false);
            setError("Failed to update data in the database.");
          });
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.data && err.response.data.msg) {
          setError(err.response.data.msg);
        } else {
          setError("Error signing up.");
        }
      });
  }

  return (
    <div className="signup-container">
      {loading ? (
        <div className="loading-spinner">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <h2 className="text-center signup-title">Create Account</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-container">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email" className="form-group">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group controlId="name" className="form-group">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" ref={nameref} required />
              </Form.Group>
              <Form.Group controlId="phone" className="form-group">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control type="tel" ref={phoneref} required />
              </Form.Group>
              <Form.Group controlId="password" className="form-group">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Form.Group controlId="password-confirm" className="form-group">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordConfirmRef}
                  required
                />
              </Form.Group>
              <Button disabled={loading} className="login-button" type="submit">
                Sign Up
              </Button>
            </Form>
          </div>
          <div className="register-link">
            Already registered?{" "}
            <Link to="/" className="register-button">
              Login
            </Link>
          </div>
        </>
      )}
    </div>
  );
}