import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Server, Globe, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlatformCard from "../PlatformCard";

interface PlatformSelectionStepProps {
  onNext: () => void;
  onBack: () => void;
  onSelectPlatform: (platform: string) => void;
}

const platforms = [
  {
    id: "vercel",
    name: "Vercel",
    icon: <Zap className="h-6 w-6 text-foreground" />,
    description: "Best for React/Next.js apps with automatic deployments and edge functions.",
    pricing: "Free tier available",
    recommended: true,
    features: [
      { name: "Zero-config deployment", included: true },
      { name: "Edge Functions", included: true },
      { name: "Preview deployments", included: true },
      { name: "Custom domains", included: true },
      { name: "Built-in analytics", included: true },
      { name: "Serverless functions", included: true },
    ],
  },
  {
    id: "netlify",
    name: "Netlify",
    icon: <Globe className="h-6 w-6 text-foreground" />,
    description: "Great for static sites and JAMstack applications with forms support.",
    pricing: "Free tier available",
    recommended: false,
    features: [
      { name: "Zero-config deployment", included: true },
      { name: "Edge Functions", included: true },
      { name: "Preview deployments", included: true },
      { name: "Custom domains", included: true },
      { name: "Built-in forms", included: true },
      { name: "Serverless functions", included: true },
    ],
  },
  {
    id: "render",
    name: "Render",
    icon: <Server className="h-6 w-6 text-foreground" />,
    description: "Full-stack platform with databases, cron jobs, and background workers.",
    pricing: "Free tier available",
    recommended: false,
    features: [
      { name: "Zero-config deployment", included: true },
      { name: "Managed databases", included: true },
      { name: "Preview deployments", included: true },
      { name: "Custom domains", included: true },
      { name: "Background workers", included: true },
      { name: "Cron jobs", included: true },
    ],
  },
  {
    id: "github-pages",
    name: "GitHub Pages",
    icon: <Code2 className="h-6 w-6 text-foreground" />,
    description: "Free hosting for static sites directly from your GitHub repository.",
    pricing: "Always free",
    recommended: false,
    features: [
      { name: "Zero-config deployment", included: true },
      { name: "Edge Functions", included: false },
      { name: "Preview deployments", included: false },
      { name: "Custom domains", included: true },
      { name: "Built-in analytics", included: false },
      { name: "HTTPS included", included: true },
    ],
  },
];

const PlatformSelectionStep = ({
  onNext,
  onBack,
  onSelectPlatform,
}: PlatformSelectionStepProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const handleSelect = (platformId: string) => {
    setSelectedPlatform(platformId);
    onSelectPlatform(platformId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Choose Your Platform</h2>
        <p className="mt-2 text-muted-foreground">
          Select where you want to deploy your migrated application.
        </p>
      </div>

      {/* Platform grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PlatformCard
              name={platform.name}
              icon={platform.icon}
              description={platform.description}
              features={platform.features}
              recommended={platform.recommended}
              selected={selectedPlatform === platform.id}
              onClick={() => handleSelect(platform.id)}
              pricing={platform.pricing}
            />
          </motion.div>
        ))}
      </div>

      {/* Platform comparison note */}
      {selectedPlatform && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl bg-primary/5 border border-primary/20 p-4"
        >
          <p className="text-sm text-foreground">
            <strong>
              {platforms.find((p) => p.id === selectedPlatform)?.name}
            </strong>{" "}
            is a great choice!{" "}
            {selectedPlatform === "vercel" &&
              "Vercel offers the fastest deployment experience for React applications with automatic optimizations."}
            {selectedPlatform === "netlify" &&
              "Netlify excels at static sites and provides built-in form handling out of the box."}
            {selectedPlatform === "render" &&
              "Render is perfect if you need databases and background jobs alongside your frontend."}
            {selectedPlatform === "github-pages" &&
              "GitHub Pages is ideal for simple static sites with no backend requirements."}
          </p>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="hero"
          size="lg"
          onClick={onNext}
          disabled={!selectedPlatform}
        >
          Continue to Deployment
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PlatformSelectionStep;
