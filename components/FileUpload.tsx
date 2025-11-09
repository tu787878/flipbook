'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface FileUploadProps {
  menuId: string;
  onUploadComplete: (pages: any[]) => void;
  onUploadError: (error: string) => void;
}

export default function FileUpload({ menuId, onUploadComplete, onUploadError }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      // Check if it's a single PDF or multiple images
      const isPDF = acceptedFiles[0].type === 'application/pdf';
      
      if (isPDF) {
        // Single PDF upload
        formData.append('file', acceptedFiles[0]);
      } else {
        // Multiple images upload
        acceptedFiles.forEach((file, index) => {
          formData.append('files', file);
        });
      }
      
      formData.append('menuId', menuId);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      onUploadComplete(data.pages);
    } catch (error) {
      onUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [menuId, onUploadComplete, onUploadError]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    multiple: true,
    disabled: uploading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-purple-600 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          {uploading ? (
            <>
              <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
              <p className="text-lg font-semibold text-gray-700">
                Uploading and processing...
              </p>
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">{uploadProgress}%</p>
            </>
          ) : (
            <>
              <Upload className="w-16 h-16 text-gray-400" />
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  {isDragActive ? 'Drop your files here' : 'Drag & drop your files here'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  or click to browse (multiple images supported)
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  PDF (single file)
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ImageIcon className="w-4 h-4" />
                  PNG, JPG (multiple)
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {acceptedFiles.length > 0 && !uploading && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Selected {acceptedFiles.length} file(s):
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {acceptedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                {file.type === 'application/pdf' ? (
                  <FileText className="w-5 h-5 text-purple-600" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                )}
                <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                <span className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {acceptedFiles[0].type === 'application/pdf' 
              ? 'PDF will be converted to pages automatically' 
              : `${acceptedFiles.length} image(s) will be added as pages`}
          </p>
        </div>
      )}
    </div>
  );
}

