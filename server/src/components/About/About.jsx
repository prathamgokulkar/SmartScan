import React from "react";

const About = () => {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          {/* Left Column: Text Content */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  About
                </h1>
                <p className="mt-6 text-xl leading-8 text-gray-700">
                  In today’s fast-paced financial world, your team's time is
                  your most valuable asset. Yet, how much of it is spent on the
                  slow, error-prone, and resource-intensive task of manually
                  extracting data from scanned invoices, receipts, and
                  statements?
                </p>
                <p className="mt-4 text-gray-600">
                  We built <b>Multi-Agent Smart Scan</b> to solve this exact
                  problem. This isn't just another OCR tool; it's an
                  intelligent, automated system designed to set a new benchmark
                  for financial document processing.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              className="w-full max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
              src="https://placehold.co/800x600/1E293B/94A3B8?text=Your+App+Screenshot"
              alt="Screenshot of the Multi-Agent Smart Scan dashboard"
            />
          </div>

          {/* Left Column: Features/Details */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Our Approach: A Team of AI Specialists
                </h2>
                <p className="mt-6">
                  Unlike traditional, single-pipeline systems, we use a modular{" "}
                  <b>multi-agent architecture</b>. Think of it as a dedicated
                  team of AI specialists, each mastering a specific part of the
                  workflow:
                </p>
                <ul role="list" className="mt-8 space-y-8 text-gray-600">
                  <li className="flex gap-x-3">
                    <span className="flex-none text-xl text-sky-600">👀</span>
                    <span>
                      <strong className="font-semibold text-gray-900">
                        The OCR Agent:
                      </strong>{" "}
                      Utilizes advanced OCR engines to read and digitize any
                      document with high accuracy, from a perfect scan to a
                      quick smartphone photo.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span className="flex-none text-xl text-sky-600">🧠</span>
                    <span>
                      <strong className="font-semibold text-gray-900">
                        The NLP Agent:
                      </strong>{" "}
                      Understands the <b>context</b> and <b>intent</b> of your
                      requests, not just keywords.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span className="flex-none text-xl text-sky-600">🎯</span>
                    <span>
                      <strong className="font-semibold text-gray-900">
                        The Field Extraction Agent:
                      </strong>{" "}
                      Intelligently locates the specific financial data you've
                      asked for, no matter the document's layout.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span className="flex-none text-xl text-sky-600">✅</span>
                    <span>
                      <strong className="font-semibold text-gray-900">
                        The Validation Agent:
                      </strong>{" "}
                      This is our critical fact-checker. It automatically
                      cross-references data against finance-specific rules,
                      catching errors and reducing false positives.
                    </span>
                  </li>
                </ul>
                <h3 className="mt-12 text-2xl font-bold tracking-tight text-gray-900">
                  Data You Can Trust, Instantly
                </h3>
                <p className="mt-6">
                  Our system allows you to upload any financial document and get
                  the structured data you need, validated and secured. By
                  integrating high-accuracy text recognition with context-aware
                  interpretation, Multi-Agent Smart Scan streamlines your
                  decision-making, minimizes manual effort, and transforms your
                  financial data from a burden into an asset.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
