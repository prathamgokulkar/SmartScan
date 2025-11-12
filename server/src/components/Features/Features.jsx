// src/components/Features/Features.jsx
import React from "react";

const features = [
  {
    title: "Fast & Responsive",
    description:
      "Optimized frontend and backend systems for smooth, lightning-fast performance.",
  },
  {
    title: "AI-Powered",
    description:
      "Integrating modern machine learning models and automation into products.",
  },
  {
    title: "Scalable Architecture",
    description:
      "Designed to grow with your user base using modular and maintainable design.",
  },
];

const Features = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12 text-gray-800">
          Our Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 border rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-2xl font-semibold text-blue-600 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
