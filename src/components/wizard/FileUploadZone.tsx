import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileArchive, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  className?: string;
}

const FileUploadZone = ({
  onFileSelect,
  accept = ".zip",
  className,
}: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && droppedFile.name.endsWith(".zip")) {
        processFile(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        processFile(selectedFile);
      }
    },
    [onFileSelect]
  );

  const processFile = async (selectedFile: File) => {
    setIsProcessing(true);
    setFile(selectedFile);
    
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    onFileSelect(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.label
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200",
              isDragging
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            <input
              type="file"
              accept={accept}
              onChange={handleFileInput}
              className="hidden"
            />
            <motion.div
              animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
            >
              <Upload className="h-8 w-8 text-primary" />
            </motion.div>
            <p className="text-center font-medium text-foreground">
              {isDragging ? "Drop your file here" : "Drag & drop your ZIP file"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              or click to browse
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <FileArchive className="h-4 w-4" />
              <span>Accepts .zip files up to 100MB</span>
            </div>
          </motion.label>
        ) : (
          <motion.div
            key="file"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                {isProcessing ? (
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                ) : (
                  <FileArchive className="h-6 w-6 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              {isProcessing ? (
                <span className="text-sm text-muted-foreground">
                  Processing...
                </span>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-success">
                    <Check className="h-5 w-5" />
                    <span className="text-sm font-medium">Ready</span>
                  </div>
                  <button
                    onClick={removeFile}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploadZone;
