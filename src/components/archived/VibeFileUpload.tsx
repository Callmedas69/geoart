"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useVibeAuth } from '@/hooks/useVibeAuth';

interface UploadedFile {
  file: File;
  rarity: string;
  uploadedUrl?: string;
}

interface VibeFileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
}

const RARITIES = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];

export const VibeFileUpload: React.FC<VibeFileUploadProps> = ({ onFilesUploaded }) => {
  const vibeAuth = useVibeAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    if (selectedFiles.length === 0) return;

    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not an image file`);
        continue;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        errors.push(`${file.name} is too large (max 10MB)`);
        continue;
      }

      validFiles.push(file);
    }

    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    // Add files with default rarities
    const newFiles: UploadedFile[] = validFiles.map((file, index) => ({
      file,
      rarity: RARITIES[index % RARITIES.length] // Distribute rarities evenly
    }));

    setFiles(prev => [...prev, ...newFiles]);
    setError(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRarityChange = (index: number, rarity: string) => {
    setFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, rarity } : file
    ));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadToVibeMarket = async () => {
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      setError(null);

      const authToken = vibeAuth.getToken();
      if (!authToken) {
        throw new Error('No authentication token available');
      }

      const uploadedFiles: UploadedFile[] = [];

      // Upload each file directly to Vibe.Market
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        setUploadProgress(prev => ({ ...prev, [fileData.file.name]: 0 }));

        const formData = new FormData();
        formData.append('image', fileData.file);
        formData.append('rarity', fileData.rarity);

        try {
          // TODO: Replace with actual Vibe.Market upload endpoint
          const response = await fetch('/api/vibe-image-upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken}`
            },
            body: formData
          });

          if (!response.ok) {
            throw new Error(`Upload failed for ${fileData.file.name}`);
          }

          const result = await response.json();
          
          if (!result.imageUrl) {
            throw new Error(`No image URL returned from server for ${fileData.file.name}`);
          }
          
          uploadedFiles.push({
            ...fileData,
            uploadedUrl: result.imageUrl
          });

          setUploadProgress(prev => ({ ...prev, [fileData.file.name]: 100 }));

        } catch (err) {
          console.error(`❌ UPLOAD FAILED for ${fileData.file.name}:`, err);
          console.error(`❌ UPLOAD ERROR DETAILS:`, {
            fileName: fileData.file.name,
            fileSize: fileData.file.size,
            fileType: fileData.file.type,
            error: err instanceof Error ? err.message : err
          });
          
          // Stop the upload process and show the error instead of masking it
          setError(`Upload failed for ${fileData.file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          return; // Don't continue with more uploads
        }

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      onFilesUploaded(uploadedFiles);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const hasValidRarityDistribution = () => {
    const rarities = files.map(f => f.rarity);
    const requiredRarities = ['Common', 'Rare', 'Epic', 'Legendary'];
    return requiredRarities.every(rarity => rarities.includes(rarity));
  };

  return (
    <Card className="bg-white border-black">
      <CardHeader>
        <CardTitle className="text-black flex items-center gap-2">
          <Upload size={20} />
          Upload Images to Vibe.Market
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-black/30 rounded-lg p-8 text-center cursor-pointer hover:border-black/50 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelection}
            className="hidden"
          />
          <ImageIcon size={48} className="mx-auto text-black/40 mb-4" />
          <p className="text-black/80 mb-2">Click to select images</p>
          <p className="text-sm text-black/60">PNG, JPG, WEBP up to 10MB each</p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-black font-medium">Selected Files ({files.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {files.map((fileData, index) => (
                <div key={index} className="bg-gray-50 border border-black/20 rounded-lg p-4 flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={URL.createObjectURL(fileData.file)}
                      alt={fileData.file.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-black text-sm truncate">{fileData.file.name}</p>
                    <p className="text-black/60 text-xs">{(fileData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <div className="mt-2">
                      <Select
                        value={fileData.rarity}
                        onValueChange={(value) => handleRarityChange(index, value)}
                      >
                        <SelectTrigger className="w-full h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RARITIES.map(rarity => (
                            <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {uploadProgress[fileData.file.name] !== undefined && (
                      <div className="mt-2">
                        <div className="bg-black/20 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress[fileData.file.name]}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
                    className="flex-shrink-0 text-black/40 hover:text-red-500"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validation Info */}
        {files.length > 0 && (
          <div className="bg-gray-50 border border-black/20 rounded-lg p-4">
            <h4 className="text-black font-medium mb-2">Collection Requirements</h4>
            <div className="space-y-1 text-sm">
              <div className={`flex items-center gap-2 ${files.length >= 4 ? 'text-green-600' : 'text-orange-600'}`}>
                <span>{files.length >= 4 ? '✓' : '⚠'}</span>
                <span>At least 4 images ({files.length}/4)</span>
              </div>
              <div className={`flex items-center gap-2 ${hasValidRarityDistribution() ? 'text-green-600' : 'text-orange-600'}`}>
                <span>{hasValidRarityDistribution() ? '✓' : '⚠'}</span>
                <span>Has Common, Rare, Epic, Legendary rarities</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert className="border-red-500 bg-red-50">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Button */}
        <Button
          onClick={uploadToVibeMarket}
          disabled={files.length === 0 || !hasValidRarityDistribution() || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading to Vibe.Market...
            </>
          ) : (
            'Upload to Vibe.Market'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};