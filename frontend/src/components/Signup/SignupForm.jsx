// src/components/Signup/SignupForm.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // simple validation
    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.password
    ) {
      setMessage("⚠️ Please fill all fields before continuing.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // simulate network delay
      await new Promise((res) => setTimeout(res, 600));

      // get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

      // check if email already exists
      const alreadyExists = existingUsers.some(
        (user) => user.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (alreadyExists) {
        setMessage("⚠️ User already exists! Please use a different email.");
        setLoading(false);
        return;
      }

      // add new user
      const newUsers = [...existingUsers, formData];
      localStorage.setItem("users", JSON.stringify(newUsers));
      localStorage.setItem("isSignedUp", "true");

      setMessage("✅ Account created successfully!");
      setLoading(false);

      // optional auto-close after 1s
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div className="mb-3 text-center">
        <h2 className="text-2xl font-semibold">Create an Account</h2>
        <p className="text-sm text-gray-300">
          Welcome to MultiAgent Smart Scan
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="firstname">First Name</Label>
          <Input
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="bg-white/10 text-white border-white/20"
          />
        </div>
        <div>
          <Label htmlFor="lastname">Last Name</Label>
          <Input
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className="bg-white/10 text-white border-white/20"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="bg-white/10 text-white border-white/20"
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="bg-white/10 text-white border-white/20"
        />
      </div>

      {message && (
        <p className="text-sm text-center text-gray-200 bg-black/30 rounded-md py-2">
          {message}
        </p>
      )}

      <Button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700"
        disabled={loading}
      >
        {loading ? "Creating..." : "Continue"}
      </Button>
    </form>
  );
}
