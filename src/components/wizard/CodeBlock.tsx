import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

const CodeBlock = ({ code, language = "bash", className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group rounded-lg overflow-hidden", className)}>
      <div className="flex items-center justify-between bg-foreground/5 px-4 py-2 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground uppercase">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1 text-success"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
      <pre className="overflow-x-auto bg-foreground/[0.03] p-4">
        <code className="text-sm font-mono text-foreground/80">{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
