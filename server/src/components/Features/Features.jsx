import React from "react";
import {
  IconFileText,
  IconBrain,
  IconSearch,
  IconShieldCheck,
  IconZoomScan,
  IconDatabase,
  IconCheck,
  IconPlugConnected,
} from "@tabler/icons-react";
import { cn } from "../../lib/utils";

export function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Data Extraction",
      description:
        "Automatically extract structured information from invoices, receipts, and financial statements with precision.",
      icon: <IconZoomScan />,
    },
    {
      title: "Multi-Agent Architecture",
      description:
        "Specialized agents for OCR, NLP, validation, and summarization collaborate seamlessly for accurate results.",
      icon: <IconBrain />,
    },
    {
      title: "Context-Aware Understanding",
      description:
        "Finance-tuned LLMs interpret numbers, context, and relationships intelligently — beyond raw text extraction.",
      icon: <IconFileText />,
    },
    {
      title: "Automated Validation",
      description:
        "Extracted data is verified against financial rules, minimizing false positives and ensuring compliance.",
      icon: <IconShieldCheck />,
    },
    {
      title: "Real-Time Querying",
      description:
        "Ask natural language questions like 'What was the total tax?' and get fact-checked answers instantly.",
      icon: <IconSearch />,
    },
    {
      title: "Modular Scalability",
      description:
        "Each agent is independently upgradable — adapt to new document formats or financial regulations easily.",
      icon: <IconPlugConnected />,
    },
    {
      title: "Secure Data Handling",
      description:
        "All document data is processed locally or securely stored with encryption — privacy first.",
      icon: <IconDatabase />,
    },
    {
      title: "High Accuracy Assurance",
      description:
        "Cross-agent consistency checks ensure data integrity, delivering reliable, enterprise-grade outputs.",
      icon: <IconCheck />,
    },
  ];

  return (
    <div className="relative z-10 py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto text-center mb-12 px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Why Choose MultiAgent Smart Scan
        </h2>
        <p className="text-lg text-gray-300">
          A next-generation AI architecture designed to make financial document
          analysis faster, smarter, and more reliable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-indigo-700/40">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
}

const Feature = ({ title, description, icon, index }) => {
  return (
    <div
      className={cn(
        "flex flex-col border-b border-r border-indigo-700/40 py-10 relative group/feature overflow-hidden"
      )}
    >
      <div className="absolute inset-0 opacity-0 group-hover/feature:opacity-100 bg-gradient-to-t from-indigo-800/40 to-transparent transition-all duration-300" />
      <div className="mb-4 relative z-10 px-8 text-indigo-400 text-3xl">
        {icon}
      </div>
      <div className="text-lg font-semibold mb-2 relative z-10 px-8">
        <div className="absolute left-0 inset-y-0 h-6 w-1 rounded-tr-full rounded-br-full bg-indigo-500 group-hover/feature:h-8 transition-all duration-300" />
        <span className="ml-3 group-hover/feature:translate-x-1 transition duration-200 inline-block">
          {title}
        </span>
      </div>
      <p className="text-sm text-gray-300 max-w-xs relative z-10 px-8">
        {description}
      </p>
    </div>
  );
};

export default FeaturesSection;
