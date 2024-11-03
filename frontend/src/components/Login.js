import React, { useRef, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS styles

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/signin", {
        method: "POST",
        body: JSON.stringify({
          email: emailRef.current.value,
          password: passwordRef.current.value
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to sign in");
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      {loading ? (
        <div className="loading-spinner">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <h2 className="text-center login-title">Welcome Back</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-container">
            <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email" className="form-group row">
              <Form.Label className="col-sm-3 col-form-label">Email</Form.Label>
              <div className="col-sm-9">
                <Form.Control
                  type="email"
                  ref={emailRef}
                  required
                  placeholder="Enter your email"
                  className="mb-3" // Add margin-bottom class
                />
              </div>
            </Form.Group>

            <Form.Group controlId="password" className="form-group row">
              <Form.Label className="col-sm-3 col-form-label">Password</Form.Label>
              <div className="col-sm-9">
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  required
                  placeholder="Enter your password"
                  className="mb-3" // Add margin-bottom class
                />
              </div>
            </Form.Group>

              <Button disabled={loading} className="login-button" type="submit">
                Log In
              </Button>
            </Form>
          </div>

          <div className="register-link">
            Don't have an account?{" "}
            <Link to="/signup" className="register-button">
              Register
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
