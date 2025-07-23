import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../../components/common/LoadingSpinner.js";
import SignUpForm from "../../../components/auth/register/SignUpForm.js";
import OtpVerification from "../../../components/auth/register/OTP_Verification.js";
import "./SignUp.css";
import axios from "axios";

export default function SignUpPage() {
  const [ activeTab, setActiveTab ] = useState("signup");
  const [ showPassword, setShowPassword ] = useState(false);
  const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
  const [ formData, setFormData ] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    agreeToTerms: false 
  });

  const [ loading, setLoading ] = useState(false);
  const [ isVerifying, setIsVerifying ] = useState(false);
  const [ generatedEmail, setGeneratedEmail ] = useState(null);
  //  Hiển thị form OTP nếu isVerifying = true

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!formData.agreeToTerms) {
      toast.error("Please agree to Terms and Conditions!");
      return;
    }
    if (!formData.email) {
      toast.error("Email is required!");
      return;
    }
    if (!formData.name) {
      toast.error("Full name is required!");
      return;
    }
    if (!formData.password) {
      toast.error("Password is required!");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      toast.error("Invalid email format!");
      return;
    }
  
    // try {
    //   setLoading(true);
    //   await axios.post("https://backendlaraveltechstore-production.up.railway.app/api/auth/register", formData);
    //   toast.success("Registration successful! Please check your email for OTP.");
    //   setGeneratedEmail(formData.email);
    //   setIsVerifying(true);
    // } catch (error) {
    //   console.error("Registration Error:", error);
    //   toast.error(error?.response?.data?.message || "Registration failed.");
    // } finally {
    //   setLoading(false);
    // }

    try {
      setLoading(true);
      const response = await axios.post("https://backend-laravel-techstore-4.onrender.com/api/auth/register", formData);

      if (response.data.status) {
        toast.success(response.data.message || "Registration successful! Please check your email for OTP.");
        setGeneratedEmail(formData.email);
        setIsVerifying(true);
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignUp = () => {
    window.location.href = "https://backend-laravel-techstore-4.onrender.com/auth/google/redirect";
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!isVerifying ? (
        <SignUpForm
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleGoogleSignUp={handleGoogleSignUp}
        />
      ) : (
        <OtpVerification
          email={generatedEmail}
          onSuccess={() => {
            toast.success("Your account has been successfully verified!");
          }}
        />
      )}

      <ToastContainer />
    </>
  )
}


