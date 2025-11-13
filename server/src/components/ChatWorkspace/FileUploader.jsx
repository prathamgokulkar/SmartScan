import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload, IconTrash, IconFileAnalytics } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

export const FileUpload = ({ onChange }) => {
  const [files, setFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const fileInputRef = useRef(null);

  const handleFileChange = (newFiles) => {
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    setAnalysisStatus(null); // Clear previous analysis status when new file is uploaded
    if (onChange) onChange(updatedFiles);
  };

  const handleClearFiles = (e) => {
    e.stopPropagation(); // Prevent event from bubbling to parent
    e.preventDefault(); // Prevent default behavior
    setFiles([]);
    setAnalysisStatus(null); // Clear analysis status
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
    if (onChange) onChange([]);
  };

  const handleAnalyzePDF = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (files.length === 0) {
      setAnalysisStatus({ type: 'error', message: 'Please upload a PDF file first' });
      return;
    }

    const file = files[0];
    if (file.type !== 'application/pdf') {
      setAnalysisStatus({ type: 'error', message: 'Please upload a valid PDF file' });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/api/process-invoice', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Failed to analyze PDF');
      }

      const data = await response.json();
      if (data.success) {
        setAnalysisStatus({ type: 'success', message: data.message || 'PDF analyzed and indexed successfully!' });
      } else {
        throw new Error(data.message || 'Analysis failed');
      }
    } catch (err) {
      setAnalysisStatus({ type: 'error', message: err.message || 'Error analyzing PDF' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClick = (e) => {
    // Don't open file picker if files are already uploaded
    if (files.length > 0) {
      e.stopPropagation();
      return;
    }
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => console.log(error),
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover={files.length === 0 ? "animate" : undefined}
        className={`p-10 group/file block rounded-lg w-full relative overflow-hidden ${
          files.length === 0 ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />

        {/* Background pattern */}
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none">
          <GridPattern />
        </div>

        {/* Upload Instructions */}
        <div 
          className="flex flex-col items-center justify-center"
          onClick={(e) => {
            // Don't stop propagation for button clicks
            if (files.length > 0 && !e.target.closest('button')) {
              e.stopPropagation();
            }
          }}
        >
          <p className="relative z-20 font-sans font-bold text-foreground text-base">
            Upload File
          </p>
          <p className="relative z-20 font-sans font-normal text-muted-foreground text-base mt-2">
            Drag or drop your files here or click to upload
          </p>

          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {/* Uploaded Files List */}
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={`file-${idx}`}
                  layoutId={idx === 0 ? "file-upload" : `file-upload-${idx}`}
                  onClick={(e) => e.stopPropagation()}
                  className="relative overflow-hidden z-40 bg-white border border-gray-200 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md shadow-sm"
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-base text-foreground truncate max-w-xs"
                    >
                      {file.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-foreground bg-white border border-gray-200 shadow-sm"
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>

                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-muted-foreground">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-1 py-0.5 rounded-md bg-gray-100 border border-gray-200"
                    >
                      {file.type || "Unknown Type"}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Modified {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </motion.div>
              ))}

            {/* Empty upload area */}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="relative group-hover/file:shadow-2xl z-40 bg-white border border-gray-200 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-foreground flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-foreground" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-foreground" />
                )}
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          {files.length > 0 && (
            <div className="flex flex-col items-center gap-3 mt-6">
              {/* Analyse PDF Button */}
              <button
                type="button"
                onClick={handleAnalyzePDF}
                disabled={isAnalyzing}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                className="relative z-50 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-md flex items-center gap-2 transition-all duration-200 shadow-sm cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <IconFileAnalytics className="w-4 h-4" />
                    Analyse PDF
                  </>
                )}
              </button>

              {/* Status Message */}
              {analysisStatus && (
                <div
                  className={`relative z-50 px-4 py-2 rounded-md text-sm ${
                    analysisStatus.type === 'success'
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {analysisStatus.message}
                </div>
              )}

              {/* Clear Button */}
              <button
                type="button"
                onClick={handleClearFiles}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                className="relative z-50 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center gap-2 transition-all duration-200 shadow-sm cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                <IconTrash className="w-4 h-4" />
                Clear Documents
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ✅ Grid pattern helper
export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50"
                  : "bg-gray-50 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}

export default FileUpload;
