/* eslint-disable @typescript-eslint/no-explicit-any */
'use client' // Ensure this is at the top of the file to enable client-side rendering

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { API_BASE_URL } from "@/utils/api";

export default function CtaSection() {
  const router = useRouter(); // Ensure useRouter is used at the top level of the component
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    phoneNumber: "",
    goal: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "age" ? (parseInt(value, 10) || "") : value, // Parse age as an integer
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
  
    // Validate age
    if (!isLoginMode && parseInt(formData.age, 10) <= 13) {
      setErrorMessage("Age must be greater than 13.");
      showToast.error("Age must be greater than 13.");
      return;
    }
  
    const url = isLoginMode ? `${API_BASE_URL}/auth/login` : `${API_BASE_URL}/auth/signup`;
    const payload = isLoginMode
      ? { email: formData.email, password: formData.password }
      : { ...formData, age: parseInt(formData.age, 10) };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response) {
        showToast.error("No response received from the server");
        setErrorMessage("No response received from the server");
        return;
      }
      
      const contentType = response.headers.get("Content-Type");
      
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          const errorMsg = errorData.message || "Something went wrong";
          
          if (isLoginMode && response.status === 401) {
            showToast.error("Invalid email or password");
            setErrorMessage("Invalid email or password");
          } else {
            showToast.error(errorMsg);
            setErrorMessage(errorMsg);
          }
        } else {
          showToast.error("Unexpected response from the server");
          setErrorMessage("Unexpected response from the server");
        }
        return; // Stop execution after showing error
      }
  
      const data = await response.json();
      
      if (isLoginMode) {
        console.log("Login response data:", data);
        // User is logging in - store token and redirect
        if (data && data.accessToken) {
          sessionStorage.setItem("token", data.accessToken);
          console.log("Token stored in session storage");
          
          showToast.success('Login Successful!');
          setSuccessMessage('Login Successful!');
          
          // Redirect to progress page after login
          setTimeout(() => {
            setIsPopupOpen(false);
            router.push("/progress");
          }, 15);
        } else {
          showToast.error("Login failed. No access token received.");
          setErrorMessage("Login failed. Please try again.");
        }
      } else {
        // User just signed up - show login form
        showToast.success('Signup Successful! Please login with your credentials.');
        setSuccessMessage('Signup Successful! Please login with your credentials.');
        
        // Clear password field for security
        setFormData(prev => ({
          ...prev,
          password: ""
        }));
        
        // Switch to login mode after signup
        setTimeout(() => {
          setIsLoginMode(true);
        }, 1000);
      }
      
    } catch (error: any) {
      const errorMsg = error.message || "An unexpected error occurred";
      showToast.error(errorMsg);
      setErrorMessage(errorMsg);
    }
  };

  return (
    <section id="get-started" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary">
          {/* Background pattern */}
          <div className="absolute inset-0 w-full h-full opacity-10">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/20 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/20 blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center space-y-4 text-center p-8 md:p-12 lg:p-16">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-foreground">
                Start Your Health Transformation Today
              </h2>
              <p className="max-w-[700px] text-primary-foreground/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of users who have improved their health with personalized AI nutrition plans
              </p>
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="mt-4 rounded-full text-primary hover:text-primary"
              onClick={togglePopup}
            >
              Create Your Account <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {isLoginMode ? "Login" : "Signup"}
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLoginMode && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="Enter your age"
                    />
                  </div>
                </>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
              {!isLoginMode && (
                <>
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
                      Goal
                    </label>
                    <input
                      type="text"
                      id="goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="Enter your goal (e.g., weight loss)"
                    />
                  </div>
                </>
              )}
              <Button type="submit" size="lg" variant="default" className="w-full">
                {isLoginMode ? "Login" : "Signup"}
              </Button>
            </form>
            {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
            {successMessage && <p className="mt-2 text-sm text-green-600">{successMessage}</p>}
            <div className="mt-4 text-sm text-center">
              {isLoginMode ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={toggleMode}
                    className="text-primary hover:underline"
                  >
                    Signup
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={toggleMode}
                    className="text-primary hover:underline"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
            <button
              onClick={togglePopup}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
