import { generateSlug } from '@/utils/slugGenerator';

interface UploadedFile {
  file: File;
  rarity: string;
  uploadedUrl?: string;
}

interface CollectionData {
  name: string;
  symbol: string;
  description: string;
  featuredIndex: number;
  enableFoil: boolean;
  enableWear: boolean;
  isNSFW: boolean;
  twitterUsername: string;
  websiteUrl: string;
  customFeaturedImage?: File;
  packAmount: number; // Number of packs to purchase on deployment
  owner?: string; // Optional custom owner address
}

interface DirectUploadResult {
  success: boolean;
  contractAddress?: string;
  tokenContract?: string;
  collectionUrl?: string;
  gameId?: string;
  draftId?: string;
  slug?: string;
  needsDeployment?: boolean;
  metadata?: any;
  txHash?: string;
  error?: string;
}

type ProgressStep = 'preparing' | 'uploading' | 'creating' | 'deploying' | 'complete' | 'error';

interface ProgressCallback {
  (step: ProgressStep, progress: number, details: string): void;
}

/**
 * Direct Upload Service for Vibe.Market
 * 
 * This service handles the complete collection creation flow directly through Vibe.Market's APIs,
 * following their exact platform workflow instead of trying to reverse-engineer the process.
 */
export class VibeDirectUploadService {
  private authToken: string;
  private onProgress?: ProgressCallback;
  
  constructor(authToken: string, onProgress?: ProgressCallback) {
    this.authToken = authToken;
    this.onProgress = onProgress;
  }

  private updateProgress(step: ProgressStep, progress: number, details: string) {
    if (this.onProgress) {
      this.onProgress(step, progress, details);
    }
  }

  private generateCollectionSlug(collectionName: string): string {
    // This is used for the initial draft creation - simple slug is fine
    // Unique slug will be generated after draft creation using draft ID
    return collectionName
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Upload files directly to Vibe.Market
   */
  async uploadImages(files: UploadedFile[]): Promise<UploadedFile[]> {
    console.log('🖼️ VibeDirectUpload: Starting direct image upload to Vibe.Market');
    this.updateProgress('uploading', 0, 'Starting image upload...');
    
    const uploadedFiles: UploadedFile[] = [];
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const fileData = files[i];
      try {
        const progress = Math.round((i / totalFiles) * 100);
        this.updateProgress('uploading', progress, `Uploading ${fileData.file.name} (${i + 1}/${totalFiles})`);
        
        console.log(`📤 VibeDirectUpload: Uploading ${fileData.file.name} with rarity ${fileData.rarity}`);
        
        const formData = new FormData();
        formData.append('image', fileData.file);
        formData.append('rarity', fileData.rarity);

        const response = await fetch('/api/vibe-image-upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.authToken}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Upload failed for ${fileData.file.name}: ${response.statusText}`);
        }

        const result = await response.json();
        
        // 🔍 IMAGE UPLOAD RESPONSE - Full API Response in Browser Console
        console.log('📤 ========== VIBE IMAGE UPLOAD RESPONSE START ==========');
        console.log('🗂️ FULL RESPONSE OBJECT:', result);
        console.log('📋 RESPONSE KEYS:', Object.keys(result));
        console.log('🖼️ FILE NAME:', fileData.file.name);
        console.log('📋 RESPONSE TYPE:', typeof result);
        console.log('📋 SUCCESS:', result.success);
        console.log('📋 IMAGE URL:', result.imageUrl);
        console.log('📋 ORIGINAL RESPONSE:', result.originalResponse);
        console.log('📤 ========== VIBE IMAGE UPLOAD RESPONSE END ==========');
        
        uploadedFiles.push({
          ...fileData,
          uploadedUrl: result.imageUrl
        });

        console.log(`✅ VibeDirectUpload: Successfully uploaded ${fileData.file.name}`);
        
      } catch (error) {
        console.error(`❌ VibeDirectUpload: Failed to upload ${fileData.file.name}:`, error);
        this.updateProgress('error', 0, `Failed to upload ${fileData.file.name}`);
        throw error;
      }
    }

    this.updateProgress('uploading', 100, `All ${totalFiles} images uploaded successfully`);
    return uploadedFiles;
  }

  /**
   * Upload custom featured image if provided
   */
  async uploadCustomFeaturedImage(customImage: File): Promise<string> {
    console.log('🖼️ VibeDirectUpload: Uploading custom featured image');
    
    const formData = new FormData();
    formData.append('image', customImage);

    const response = await fetch('/api/vibe-image-upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Custom featured image upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ VibeDirectUpload: Custom featured image uploaded successfully');
    
    return result.imageUrl;
  }

  // DEPRECATED: createCollectionDraft method removed
  // Now using direct API calls in VibeDeploymentFlow for KISS approach

  // DEPRECATED: confirmDeployment method removed  
  // Now using direct API calls in VibeDeploymentFlow for KISS approach

  /**
   * Complete direct upload flow
   */
  async uploadAndCreateCollection(
    collectionData: CollectionData,
    files: UploadedFile[],
    walletAddress?: string
  ): Promise<DirectUploadResult> {
    try {
      console.log('🚀 VibeDirectUpload: Starting complete upload and creation flow');
      this.updateProgress('preparing', 0, 'Initializing upload process...');
      
      // Small delay to show preparing step
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 1: Upload all images to Vibe.Market
      this.updateProgress('preparing', 100, 'Preparation complete, starting upload...');
      const uploadedFiles = await this.uploadImages(files);
      
      // Step 2: Images uploaded successfully - draft creation now handled in VibeDeploymentFlow
      this.updateProgress('complete', 100, 'Images uploaded successfully! Ready for deployment...');
      
      return {
        success: true,
        needsDeployment: true,
        metadata: {
          collectionData,
          uploadedFiles
        }
      };
      
    } catch (error) {
      console.error('❌ VibeDirectUpload: Complete flow failed:', error);
      this.updateProgress('error', 0, error instanceof Error ? error.message : 'Upload and creation failed');
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload and creation failed'
      };
    }
  }
}