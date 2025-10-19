import Replicate from 'replicate';

if (!process.env.REPLICATE_API_TOKEN) {
  console.warn('REPLICATE_API_TOKEN is not set');
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

export interface ImageEnhancementOptions {
  scale?: number; // Upscaling factor (2-4x)
  face_enhance?: boolean; // Enhance faces
  background_enhance?: boolean; // Enhance background
  denoise?: boolean; // Remove noise
}

// Enhance food photo using AI
export async function enhanceFoodPhoto(
  imageUrl: string,
  options: ImageEnhancementOptions = {}
): Promise<string> {
  try {
    const {
      scale = 2,
      face_enhance = false,
      background_enhance = true,
      denoise = true,
    } = options;

    // Using Real-ESRGAN for image upscaling and enhancement
    // This is great for food photography
    const output = await replicate.run(
      'nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b',
      {
        input: {
          image: imageUrl,
          scale,
          face_enhance,
        },
      }
    );

    // The output is a URL to the enhanced image
    return output as string;
  } catch (error) {
    console.error('Image enhancement error:', error);
    throw new Error('Failed to enhance image');
  }
}

// Remove background from food photo
export async function removeBackground(imageUrl: string): Promise<string> {
  try {
    const output = await replicate.run(
      'cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003',
      {
        input: {
          image: imageUrl,
        },
      }
    );

    return output as string;
  } catch (error) {
    console.error('Background removal error:', error);
    throw new Error('Failed to remove background');
  }
}

// Improve lighting and colors for food photos
export async function enhanceColors(imageUrl: string): Promise<string> {
  try {
    // Using stable-diffusion for color and lighting enhancement
    const output = await replicate.run(
      'tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3',
      {
        input: {
          img: imageUrl,
          version: '1.4',
          scale: 2,
        },
      }
    );

    return output as string;
  } catch (error) {
    console.error('Color enhancement error:', error);
    throw new Error('Failed to enhance colors');
  }
}

// Auto-crop and frame food photo
export async function autoCropFoodPhoto(
  imageUrl: string,
  aspectRatio: '1:1' | '4:3' | '16:9' = '1:1'
): Promise<string> {
  try {
    // This is a placeholder - implement custom cropping logic
    // or use a specialized food photo cropping model
    
    // For now, return the enhanced version
    return await enhanceFoodPhoto(imageUrl);
  } catch (error) {
    console.error('Auto-crop error:', error);
    throw new Error('Failed to crop image');
  }
}

// Generate food photo variations for A/B testing
export async function generatePhotoVariations(
  imageUrl: string,
  count: number = 3
): Promise<string[]> {
  try {
    const variations: string[] = [];

    // Generate multiple enhanced versions with different settings
    const configs = [
      { scale: 2, background_enhance: true, denoise: true },
      { scale: 2, background_enhance: true, denoise: false },
      { scale: 2, background_enhance: false, denoise: true },
    ];

    for (let i = 0; i < Math.min(count, configs.length); i++) {
      const enhanced = await enhanceFoodPhoto(imageUrl, configs[i]);
      variations.push(enhanced);
    }

    return variations;
  } catch (error) {
    console.error('Photo variations error:', error);
    throw new Error('Failed to generate variations');
  }
}

// Analyze photo quality and provide suggestions
export async function analyzePhotoQuality(imageUrl: string): Promise<{
  score: number;
  suggestions: string[];
  needsEnhancement: boolean;
}> {
  // This would use a custom ML model to analyze food photos
  // For now, return a mock implementation
  
  return {
    score: 0.75,
    suggestions: [
      'Consider enhancing the image for better quality',
      'Lighting could be improved',
      'Background is slightly busy',
    ],
    needsEnhancement: true,
  };
}

// Batch enhance multiple images
export async function batchEnhanceImages(
  imageUrls: string[],
  options: ImageEnhancementOptions = {}
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  // Process images in batches to avoid rate limits
  const batchSize = 3;
  
  for (let i = 0; i < imageUrls.length; i += batchSize) {
    const batch = imageUrls.slice(i, i + batchSize);
    
    const promises = batch.map(async (url) => {
      try {
        const enhanced = await enhanceFoodPhoto(url, options);
        results.set(url, enhanced);
      } catch (error) {
        console.error(`Failed to enhance ${url}:`, error);
        results.set(url, url); // Keep original if enhancement fails
      }
    });

    await Promise.all(promises);
  }

  return results;
}
