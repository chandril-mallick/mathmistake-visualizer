import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,") for Gemini API if needed, 
      // but the service handles it by splitting or using the full string if configured right. 
      // The GenAI SDK usually expects the raw base64 data without the prefix in `inlineData`.
      
      // Let's pass the raw base64 data to the parent
      const base64Data = base64String.split(',')[1]; 
      setPreview(base64String);
      onImageSelected(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (preview) {
    return (
      <div className="relative w-full h-64 md:h-full bg-slate-900 rounded-xl overflow-hidden shadow-lg group">
        <img 
          src={preview} 
          alt="Uploaded math problem" 
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             {!isLoading && (
                <button 
                onClick={clearImage}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
                >
                <X className="w-6 h-6" />
                </button>
             )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full h-64 md:h-96 flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer
        ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        accept="image/*"
        onChange={handleChange}
        disabled={isLoading}
      />
      
      <div className="flex flex-col items-center p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className={`p-4 rounded-full mb-4 ${dragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
          {dragActive ? <Upload className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">
          {dragActive ? 'Drop image here' : 'Upload your math problem'}
        </h3>
        <p className="text-sm text-slate-500 max-w-xs">
          Drag & drop a handwritten note or click to browse
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;
