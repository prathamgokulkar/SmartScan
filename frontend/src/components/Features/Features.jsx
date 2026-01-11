import React from "react";
import { 
  ScanLine, 
  Network, 
  FileText, 
  ShieldCheck, 
  Search, 
  Plug,
  Database,
  CheckCircle2,
  ArrowUp,
  Plus,
  Globe,
  Sparkles,
  FileCheck,
  MessageSquare
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Data Extraction",
      description:
        "Automatically extract structured information from invoices, receipts, and financial statements with precision.",
      icon: ScanLine,
      illustration: <DataExtractionIllustration />,
    },
    {
      title: "Multi-Agent Architecture",
      description:
        "Specialized agents for OCR, NLP, validation, and summarization collaborate seamlessly for accurate results.",
      icon: Network,
      illustration: <MultiAgentIllustration />,
    },
    {
      title: "Context-Aware Understanding",
      description:
        "Finance-tuned LLMs interpret numbers, context, and relationships intelligently — beyond raw text extraction.",
      icon: FileText,
      illustration: <ContextAwareIllustration />,
    },
    {
      title: "Automated Validation",
      description:
        "Extracted data is verified against financial rules, minimizing false positives and ensuring compliance.",
      icon: ShieldCheck,
      illustration: <ValidationIllustration />,
    },
    {
      title: "Real-Time Querying",
      description:
        "Ask natural language questions like 'What was the total tax?' and get fact-checked answers instantly.",
      icon: Search,
      illustration: <QueryingIllustration />,
    },
    {
      title: "Modular Scalability",
      description:
        "Each agent is independently upgradable — adapt to new document formats or financial regulations easily.",
      icon: Plug,
      illustration: <ScalabilityIllustration />,
    },
  ];

  return (
    <section id="features">
      <div className="py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div>
            <h2 className="text-foreground max-w-2xl text-balance text-4xl font-semibold">
              Why Choose MultiAgent Smart Scan
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              A next-generation AI architecture designed to make financial document
              analysis faster, smarter, and more reliable.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="soft"
                className="group overflow-hidden px-6 pt-6"
              >
                <feature.icon className="text-primary size-5" />
                <h3 className="text-foreground mt-5 text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mt-3 text-balance">
                  {feature.description}
                </p>
                {feature.illustration}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const DataExtractionIllustration = () => {
  return (
    <Card
      aria-hidden
      className="mt-9 aspect-video p-4"
    >
      <div className="mb-0.5 text-sm font-semibold">Invoice #INV-2024-001</div>
      <div className="mb-4 flex gap-2 text-sm">
        <span className="text-muted-foreground">Extracted: $1,234.56</span>
      </div>
      <div className="mb-2 space-y-2">
        <div className="bg-foreground/10 h-2 w-full rounded-full"></div>
        <div className="bg-foreground/10 h-2 w-4/5 rounded-full"></div>
        <div className="bg-foreground/10 h-2 w-3/5 rounded-full"></div>
      </div>
      <div className="text-muted-foreground text-sm font-medium flex items-center gap-2 mt-3">
        <FileCheck className="size-4" />
        <span>Data Extraction Complete</span>
      </div>
    </Card>
  );
};

const MultiAgentIllustration = () => {
  return (
    <div
      aria-hidden
      className="relative mt-6"
    >
      <Card className="aspect-video w-4/5 translate-y-4 p-3 transition-transform duration-200 ease-in-out group-hover:-rotate-3">
        <div className="mb-3 flex items-center gap-2">
          <div className="bg-background size-6 rounded-full border border-gray-200 p-0.5 shadow shadow-zinc-950/5 flex items-center justify-center">
            <Network className="size-3" />
          </div>
          <span className="text-muted-foreground text-sm font-medium">OCR Agent</span>
          <span className="text-muted-foreground/75 text-xs">Active</span>
        </div>
        <div className="ml-8 space-y-2">
          <div className="bg-foreground/10 h-2 rounded-full"></div>
          <div className="bg-foreground/10 h-2 w-3/5 rounded-full"></div>
          <div className="bg-foreground/10 h-2 w-1/2 rounded-full"></div>
        </div>
      </Card>
      <Card className="aspect-3/5 absolute -top-4 right-0 flex w-2/5 translate-y-4 p-2 transition-transform duration-200 ease-in-out group-hover:rotate-3">
        <div className="bg-foreground/5 m-auto flex size-10 rounded-full items-center justify-center">
          <Sparkles className="fill-foreground/50 stroke-foreground/50 m-auto size-4" />
        </div>
      </Card>
    </div>
  );
};

const ContextAwareIllustration = () => {
  return (
    <Card
      aria-hidden
      className="mt-6 aspect-video  translate-y-4 p-4 pb-6 transition-transform duration-200 group-hover:translate-y-0"
    >
      <div className="w-fit">
        <FileText className="size-3.5 fill-blue-300 stroke-blue-300" />
        <p className="mt-2 line-clamp-2 text-sm">
          Understanding financial context: Tax calculations, totals, and line items
        </p>
      </div>
      <div className="bg-foreground/5 -mx-3 -mb-3 mt-3 space-y-3 rounded-lg p-3">
        <div className="text-muted-foreground text-sm">Context Analysis</div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-7 rounded-2xl bg-transparent shadow-none"
            >
              <Plus />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-7 rounded-2xl bg-transparent shadow-none"
            >
              <Globe />
            </Button>
          </div>
          <Button
            size="icon"
            className="size-7 rounded-2xl bg-black"
          >
            <ArrowUp strokeWidth={3} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const ValidationIllustration = () => {
  return (
    <Card
      aria-hidden
      className="mt-9 aspect-video p-4"
    >
      <div className="mb-0.5 text-sm font-semibold flex items-center gap-2">
        <ShieldCheck className="size-4 text-green-500" />
        Validation Passed
      </div>
      <div className="mb-4 flex gap-2 text-sm">
        <span className="text-muted-foreground">All checks verified</span>
      </div>
      <div className="mb-2 space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-3 text-green-500" />
          <div className="bg-green-500/20 h-2 w-full rounded-full"></div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-3 text-green-500" />
          <div className="bg-green-500/20 h-2 w-4/5 rounded-full"></div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-3 text-green-500" />
          <div className="bg-green-500/20 h-2 w-3/5 rounded-full"></div>
        </div>
      </div>
    </Card>
  );
};

const QueryingIllustration = () => {
  return (
    <Card
      aria-hidden
      className="mt-6 aspect-video translate-y-4 p-4 pb-6 transition-transform duration-200 group-hover:translate-y-0"
    >
      <div className="w-fit">
        <MessageSquare className="size-3.5 fill-purple-300 stroke-purple-300" />
        <p className="mt-2 line-clamp-2 text-sm">
          What was the total tax amount?
        </p>
      </div>
      <div className="bg-foreground/5 -mx-3 -mb-3 mt-3 space-y-3 rounded-lg p-3">
        <div className="text-muted-foreground text-sm">Ask Question</div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-7 rounded-2xl bg-transparent shadow-none"
            >
              <Plus />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-7 rounded-2xl bg-transparent shadow-none"
            >
              <Search className="size-4" />
            </Button>
          </div>
          <Button
            size="icon"
            className="size-7 rounded-2xl bg-black"
          >
            <ArrowUp strokeWidth={3} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const ScalabilityIllustration = () => {
  return (
    <Card
      aria-hidden
      className="mt-9 aspect-video p-4"
    >
      <div className="mb-0.5 text-sm font-semibold">Modular System</div>
      <div className="mb-4 flex gap-2 text-sm">
        <span className="text-muted-foreground">3 Active Agents</span>
      </div>
      <div className="mb-2 space-y-2">
        <div className="flex items-center gap-2">
          <Plug className="size-3" />
          <div className="bg-foreground/10 h-2 w-full rounded-full"></div>
        </div>
        <div className="flex items-center gap-2">
          <Plug className="size-3" />
          <div className="bg-foreground/10 h-2 w-4/5 rounded-full"></div>
        </div>
        <div className="flex items-center gap-2">
          <Plug className="size-3" />
          <div className="bg-foreground/10 h-2 w-3/5 rounded-full"></div>
        </div>
      </div>
      <div className="text-muted-foreground text-sm font-medium">Ready to Scale</div>
    </Card>
  );
};

export default FeaturesSection;
