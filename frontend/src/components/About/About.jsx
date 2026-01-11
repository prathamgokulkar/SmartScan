import React from "react";
import { Eye, Brain, Target, CheckCircle2 } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const About = () => {
  return (
    <section id="about" className="bg-white pb-24 md:pb-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">

        <div className="">
          
          <BentoGrid className="lg:grid-rows-3">
            <BentoCard
              name="The OCR Agent"
              className="lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3"
              description="Utilizes advanced OCR engines to read and digitize any document with high accuracy, from a perfect scan to a quick smartphone photo."
              href="#features"
              cta="Learn more"
              Icon={Eye}
              background={
                <img className="absolute -right-20 -top-20 opacity-60" />
              }
            />
            <BentoCard
              name="The NLP Agent"
              className="lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3"
              description="Understands the context and intent of your requests, not just keywords."
              href="#features"
              cta="Learn more"
              Icon={Brain}
              background={
                <img className="absolute -right-20 -top-20 opacity-60" />
              }
            />
            <BentoCard
              name="The Field Extraction Agent"
              className="lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4"
              description="Intelligently locates the specific financial data you've asked for, no matter the document's layout."
              href="#features"
              cta="Learn more"
              Icon={Target}
              background={
                <img className="absolute -right-20 -top-20 opacity-60" />
              }
            />
            <BentoCard
              name="The Validation Agent"
              className="lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-4"
              description="This is our critical fact-checker. It automatically cross-references data against finance-specific rules, catching errors and reducing false positives."
              href="#features"
              cta="Learn more"
              Icon={CheckCircle2}
              background={
                <img className="absolute -right-20 -top-20 opacity-60" />
              }
            />
          </BentoGrid>
        </div>
      </div>
    </section>
  );
};

export default About;
