import React from "react";
import { CpuArchitecture } from "../svg/svg";
import { Card } from "../ui/card";
import { Network, Zap, Shield, Brain } from "lucide-react";

const Architecture = () => {
  return (
    <section id="architecture" className=" py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-foreground max-w-3xl mx-auto text-balance text-4xl font-semibold mb-4">
            Multi-Agent Architecture
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our intelligent agents work together seamlessly, processing documents through
            specialized stages to deliver accurate, verified results.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* SVG Visualization */}
          <div className="order-2 lg:order-1">
            <Card variant="soft" className="p-8 bg-white/50 backdrop-blur-sm">
              <div className="aspect-video w-full">
                <CpuArchitecture
                  text="AI"
                  width="100%"
                  height="100%"
                  showCpuConnections={true}
                  animateText={true}
                  animateLines={true}
                  animateMarkers={true}
                  className="text-gray-800"
                />
              </div>
            </Card>
          </div>

          {/* Agent Flow Description */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white border border-gray-200  flex items-center justify-center">
                  <Network className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-foreground text-lg font-semibold mb-2">
                    OCR Agent
                  </h3>
                  <p className="text-muted-foreground">
                    Extracts raw text and structure from documents, handling various formats
                    and image qualities with advanced optical character recognition.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white border border-gray-200  flex items-center justify-center">
                  <Brain className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-foreground text-lg font-semibold mb-2">
                    NLP Agent
                  </h3>
                  <p className="text-muted-foreground">
                    Understands context, relationships, and financial terminology to
                    interpret extracted data intelligently.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white border border-gray-200  flex items-center justify-center">
                  <Zap className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-foreground text-lg font-semibold mb-2">
                    Field Extraction Agent
                  </h3>
                  <p className="text-muted-foreground">
                    Locates and extracts specific financial fields like amounts, dates,
                    tax information, and vendor details.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card variant="soft" className="p-6 text-center">
            <div className="text-3xl font-bold text-foreground mb-2">4+</div>
            <div className="text-muted-foreground">Specialized Agents</div>
          </Card>
          <Card variant="soft" className="p-6 text-center">
            <div className="text-3xl font-bold text-foreground mb-2">99%+</div>
            <div className="text-muted-foreground">Accuracy Rate</div>
          </Card>
          <Card variant="soft" className="p-6 text-center">
            <div className="text-3xl font-bold text-foreground mb-2">&lt;5s</div>
            <div className="text-muted-foreground">Processing Time</div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Architecture;

