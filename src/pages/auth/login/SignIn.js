import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../../components/common/LoadingSpinner.js";
import SignInForm from "../../../components/auth/login/SignInForm.js";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://backend-laravel-techstore-4.onrender.com';

export default function SignIn() {
  const API_URL = process.env.REACT_APP_BE_URL;
  const [activeTab, setActiveTab] = useState("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  })

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.password) {
      alert("Please fill in all fields!")
      return
    }

    try {
        setLoading(true);
        await axios.get(`${API_URL}/sanctum/csrf-cookie`, { withCredentials: true})
        const response = await axios.post(`${API_URL}/api/auth/login`, {
        name: formData.name,
        password: formData.password
      }, {
        withCredentials: true
      });

      const { token, role, user, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', userId);
      console.log('Login successful:', response.data);

        setTimeout(() => {
          if (role === 'user') {
            navigate('/');
          } else if (role === 'admin') {
            navigate('/admin/dashboard');
          } 

        }, 1000);
      } 
    catch (error) {
      setLoading(false);
      if (error.response?.data?.errors?.email) {
        toast.error('Login failed. Please check your information again.');
      } else {
        toast.error('Login failed. Please check your information again.');
      }
    }
  };

  const handleForgotPassword = () => {
    navigate("/resetpassword");
  }

  const handleGoogleSignUp = () => {
    window.location.href = "https://backend-laravel-techstore-4.onrender.com/auth/google/redirect";
  };

  return (
    <>
        {loading && <LoadingSpinner />}
        <SignInForm
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleForgotPassword={handleForgotPassword}
            handleGoogleSignIn={handleGoogleSignUp}
        />
        <ToastContainer />
    </>
  )
}
