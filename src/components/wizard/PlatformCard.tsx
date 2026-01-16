import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  name: string;
  included: boolean;
}

interface PlatformCardProps {
  name: string;
  icon: React.ReactNode;
  description: string;
  features: Feature[];
  recommended?: boolean;
  selected?: boolean;
  onClick: () => void;
  pricing: string;
}

const PlatformCard = ({
  name,
  icon,
  description,
  features,
  recommended,
  selected,
  onClick,
  pricing,
}: PlatformCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative cursor-pointer rounded-xl border-2 bg-card p-6 transition-all duration-200",
        selected
          ? "border-primary shadow-lg shadow-primary/10"
          : "border-border hover:border-primary/50 hover:shadow-md",
        recommended && "ring-2 ring-accent ring-offset-2"
      )}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full gradient-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            <Star className="h-3 w-3" />
            Recommended
          </span>
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{pricing}</p>
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{description}</p>

      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <div
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full",
                feature.included
                  ? "bg-success/20 text-success"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {feature.included ? (
                <Check className="h-3 w-3" />
              ) : (
                <span className="text-[10px]">—</span>
              )}
            </div>
            <span
              className={cn(
                feature.included ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {feature.name}
            </span>
          </li>
        ))}
      </ul>

      {selected && (
        <motion.div
          layoutId="platform-check"
          className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Check className="h-4 w-4 text-primary-foreground" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default PlatformCard;
