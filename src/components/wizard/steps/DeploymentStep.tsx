import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ExternalLink,
  Globe,
  Info,
  Rocket,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CodeBlock from "../CodeBlock";
import PlatformCard from "../PlatformCard";
import {
  DEPLOYMENT_HOSTS,
  DEPLOYMENT_HOSTS_BY_ID,
  type DeploymentHostId,
} from "@/lib/deployment-hosts";

interface DeploymentStepProps {
  onBack: () => void;
  selectedPlatform: DeploymentHostId | "";
  onSelectPlatform: (platform: DeploymentHostId) => void;
}

interface VerificationChecks {
  loads: boolean;
  routes: boolean;
  env: boolean;
  core: boolean;
}

function hostIcon(hostId: DeploymentHostId) {
  switch (hostId) {
    case "vercel":
      return <Zap className="h-6 w-6 text-foreground" />;
    case "netlify":
      return <Globe className="h-6 w-6 text-foreground" />;
    case "render":
    case "railway":
      return <Server className="h-6 w-6 text-foreground" />;
    case "github-pages":
    case "cloudflare-pages":
      return <Globe className="h-6 w-6 text-foreground" />;
    default:
      return <Rocket className="h-6 w-6 text-foreground" />;
  }
}

const DeploymentStep = ({
  onBack,
  selectedPlatform,
  onSelectPlatform,
}: DeploymentStepProps) => {
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const [verified, setVerified] = useState<VerificationChecks>({
    loads: false,
    routes: false,
    env: false,
    core: false,
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setIsComplete(false);
  }, [selectedPlatform]);

  const host = selectedPlatform
    ? DEPLOYMENT_HOSTS_BY_ID[selectedPlatform]
    : null;

  const allChecksComplete = useMemo(
    () => Object.values(verified).every(Boolean),
    [verified],
  );

  const canMarkComplete = Boolean(
    host && deploymentUrl.trim() && allChecksComplete,
  );
  const missingVerificationItems = useMemo(() => {
    const items: string[] = [];
    if (!deploymentUrl.trim()) items.push("Add your live deployment URL");
    if (!verified.loads) items.push("Confirm the site opens without errors");
    if (!verified.routes) items.push("Test at least one deep link and refresh");
    if (!verified.env) items.push("Confirm environment variables are working");
    if (!verified.core) items.push("Run one full core user flow");
    return items;
  }, [deploymentUrl, verified]);

  const verificationItems: Array<{
    id: keyof VerificationChecks;
    label: string;
    description: string;
  }> = [
    {
      id: "loads",
      label: "Site loads without runtime errors",
      description: "Open the live URL and check the browser console for red errors.",
    },
    {
      id: "routes",
      label: "Routes work correctly",
      description: "Open an inner page URL directly, then refresh and confirm it still loads.",
    },
    {
      id: "env",
      label: "Environment variables are correctly configured",
      description: "Check login, API calls, and services that depend on env variables.",
    },
    {
      id: "core",
      label: "Core user flow is working",
      description: "Complete one important end-to-end action as a real user would.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">Deploy and Verify</h2>
        <p className="mt-2 text-muted-foreground">
          You will publish your app to a hosting platform, then confirm the live version
          works the same as your local app.
        </p>
      </div>

      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Step flow</p>
            <p>1) Pick a host (Vercel is usually easiest for Vite + React).</p>
            <p>2) Copy the build and output settings exactly.</p>
            <p>3) Add your environment variables in the host dashboard.</p>
            <p>4) Deploy, open the live URL, and finish the verification checks.</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">How to pick quickly</p>
            <p>Choose Vercel or Netlify for frontend-only apps.</p>
            <p>Choose Render or Railway if you also deploy backend services.</p>
            <p>Choose GitHub Pages for simple static sites or docs.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Choose a host</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DEPLOYMENT_HOSTS.map((option) => (
            <PlatformCard
              key={option.id}
              name={option.name}
              icon={hostIcon(option.id)}
              description={option.description}
              features={option.features}
              selected={selectedPlatform === option.id}
              onClick={() => onSelectPlatform(option.id)}
              pricing={option.pricing}
              recommended={option.id === "vercel"}
            />
          ))}
        </div>
      </div>

      {!host && (
        <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          Choose a host above to unlock deployment settings and the verification checklist.
          If you are unsure, start with Vercel.
        </div>
      )}

      {host && (
        <>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border bg-muted/50 p-4">
              <p className="font-medium text-foreground">
                Copy these settings into {host.name}
              </p>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Build Command</p>
                  <p className="mt-1 font-mono text-sm text-foreground">{host.buildCommand}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Output Directory</p>
                  <p className="mt-1 font-mono text-sm text-foreground">{host.outputDirectory}</p>
                </div>
              </div>

              <div className="rounded-lg border border-primary/25 bg-primary/5 p-4 text-sm text-foreground">
                <p className="font-medium">Best for: {host.bestFor}</p>
                <p className="mt-1 text-muted-foreground">{host.envNote}</p>
                <p className="mt-1 text-muted-foreground">
                  If your host auto-fills values, still confirm they match below.
                </p>
              </div>

              <div className="rounded-lg border border-success/25 bg-success/5 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Main checks for this host</p>
                <ul className="mt-2 space-y-1">
                  <li>• Build command matches exactly.</li>
                  <li>• Output directory is set to `dist`.</li>
                  <li>• Required env variables are added in the dashboard.</li>
                  <li>• Live URL opens after deployment completes.</li>
                </ul>
              </div>

              {host.configSnippet && (
                <CodeBlock
                  code={host.configSnippet}
                  language={host.configFile?.endsWith(".json") ? "json" : "yaml"}
                />
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="hero"
                  className="gap-2"
                  onClick={() => window.open(host.deployUrl, "_blank")}
                >
                  Open {host.name}
                  <ExternalLink className="h-4 w-4" />
                </Button>
                {host.configFile && (
                  <span className="text-xs text-muted-foreground">
                    Optional file: <code>{host.configFile}</code>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border bg-muted/50 p-4">
              <p className="font-medium text-foreground">Production verification</p>
              <p className="mt-1 text-xs text-muted-foreground">
                This final checklist helps catch the most common post-deploy issues.
              </p>
            </div>
            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Deployment URL
                </label>
                <p className="mb-2 text-xs text-muted-foreground">
                  Paste your live link from the host dashboard, then open it to test.
                </p>
                <div className="flex gap-2">
                  <Input
                    value={deploymentUrl}
                    onChange={(e) => setDeploymentUrl(e.target.value)}
                    placeholder="https://your-app.vercel.app"
                    className="flex-1"
                  />
                  {deploymentUrl && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(deploymentUrl, "_blank")}
                    >
                      Open
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {verificationItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/40"
                  >
                    <input
                      type="checkbox"
                      checked={verified[item.id]}
                      onChange={(e) =>
                        setVerified((prev) => ({ ...prev, [item.id]: e.target.checked }))
                      }
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              <Button
                variant="hero"
                disabled={!canMarkComplete}
                onClick={() => setIsComplete(true)}
                className="gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                Mark Deployment Complete
              </Button>
            </div>
          </div>

          {!canMarkComplete && (
            <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Still needed before completion</p>
              <ul className="mt-2 space-y-1">
                {missingVerificationItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl border border-success/30 bg-success/10 p-6"
            >
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <div>
                  <h3 className="font-semibold text-foreground">Deployment complete</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Nice work. Your app is live on {host.name} and passed verification.
                  </p>
                  {deploymentUrl && (
                    <a
                      href={deploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Open live app
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </motion.div>
  );
};

export default DeploymentStep;
