/**
 * Image Upload Component
 * Allows users to upload multiple images with preview
 */

'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  maxImages?: number;
  maxSizeMB?: number;
  onImagesChange: (files: File[]) => void;
  disabled?: boolean;
  label?: string;
  helperText?: string;
}

export function ImageUpload({
  maxImages = 5,
  maxSizeMB = 5,
  onImagesChange,
  disabled = false,
  label = 'Property Images (Optional)',
  helperText = 'Upload up to 5 images of your property (Max 5MB each)',
}: ImageUploadProps) {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError('');

    // Check if adding these files would exceed max images
    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    // Validate each file
    const validFiles: { file: File; preview: string }[] = [];
    for (const file of files) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image file`);
        continue;
      }

      // Check file size
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        setError(`${file.name} is too large. Max size is ${maxSizeMB}MB`);
        continue;
      }

      // Create preview
      const preview = URL.createObjectURL(file);
      validFiles.push({ file, preview });
    }

    if (validFiles.length > 0) {
      const newImages = [...images, ...validFiles];
      setImages(newImages);
      onImagesChange(newImages.map((img) => img.file));
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages.map((img) => img.file));
    setError('');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (fileInputRef.current) {
      // Create a new FileList-like object
      const dataTransfer = new DataTransfer();
      files.forEach((file) => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
      
      // Trigger change event
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="space-y-4">
      {/* Label */}
      <label className="block text-sm font-bold text-[#1a1a1a] mb-2">
        {label}
      </label>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          border-2 border-dashed rounded-sm p-8 text-center transition-colors
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-[#c1a478] cursor-pointer'}
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
        `}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
          aria-label="Upload property images"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-[#c1a478]/10 rounded-full flex items-center justify-center">
            <Upload size={24} className="text-[#c1a478]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#1a1a1a] mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-[#7C7A70]">{helperText}</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center gap-2"
        >
          <X size={16} />
          {error}
        </motion.p>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image.preview}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square rounded-sm overflow-hidden border-2 border-gray-200"
              >
                <img
                  src={image.preview}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  disabled={disabled}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 flex items-center gap-1">
                  <ImageIcon size={12} />
                  <span className="truncate">{image.file.name}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Image Counter */}
      {images.length > 0 && (
        <p className="text-sm text-[#7C7A70]">
          {images.length} of {maxImages} images uploaded
        </p>
      )}
    </div>
  );
}
