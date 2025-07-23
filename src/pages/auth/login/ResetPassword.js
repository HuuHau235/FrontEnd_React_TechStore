import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../../components/common/LoadingSpinner.js";
import ResetPasswordForm from "../../../components/auth/login/ResetPasswordForm.js";
import "./ResetPassword.css";
import { Await, useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://backend-laravel-techstore-4.onrender.com';

export default function ResetPasswordPage() {
    const API_URL = process.env.REACT_APP_BE_URL;
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        confirmPassword: "",
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
        e.preventDefault();

        if (!formData.password || !formData.confirmPassword) {
            alert("Please fill in all fields!");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (formData.password.length < 6) {
            alert("Password must be at least 6 characters long!");
            return;
        }

        try {
            setLoading(true);
            await axios.get(`${API_URL}/sanctum/csrf-cookie`, { withCredentials: true });

            await axios.post(`${API_URL}/api/auth/reset-password`, {
                name: formData.name,
                password: formData.password,
                password_confirmation: formData.confirmPassword
            }, { withCredentials: true });

            toast.success("Your password has been reset successfully!");

            setTimeout(() => {
            navigate('/signin');
            }, 1000);
        } catch (error) {
            setLoading(false);
            if (error.response?.data?.errors) {
            const messages = Object.values(error.response.data.errors).flat();
            messages.forEach(msg => toast.error(msg));
            } else {
            toast.error("Reset password failed!");
            }
        }
    };


    return (
        <>
            {loading && <LoadingSpinner />}
            <ResetPasswordForm
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />
            <ToastContainer />
        </> 
    )
}
