
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, X, CheckCircle } from "lucide-react";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
}

const FileUpload = ({ onFilesSelected }: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      file.type === 'application/pdf' ||
      file.type === 'text/plain' ||
      file.type.includes('word') ||
      file.type.includes('openxmlformats')
    );

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      onFilesSelected([...files, ...validFiles]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
      onFilesSelected([...files, ...selectedFiles]);
    }
  };

  const removeFile = (fileToRemove: File) => {
    const updatedFiles = files.filter(file => file !== fileToRemove);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-xl p-8 transition-all ${
          isDragging
            ? "border-studyBuddy-primary bg-studyBuddy-primary/5"
            : "border-border"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-studyBuddy-primary/10' : 'bg-muted'}`}>
            <Upload
              className={`h-10 w-10 ${
                isDragging ? "text-studyBuddy-primary" : "text-muted-foreground"
              }`}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Upload your study materials</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Drag and drop your files here, or click to browse. We support PDF, Word, and text files.
            </p>
          </div>
          <div className="flex gap-4">
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <label htmlFor="file-upload">
              <Button 
                variant="outline" 
                className="cursor-pointer rounded-full"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Select Files
              </Button>
            </label>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-medium flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-studyBuddy-success" />
            Files ready for processing
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-border shadow-sm animate-fade-in"
              >
                <div className="flex items-center">
                  <File className="h-5 w-5 text-studyBuddy-primary mr-3" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-sm">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(file)}
                  className="p-1 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-studyBuddy-error" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
