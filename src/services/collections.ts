// Simple collection service for OpenGraph sharing
// This is a basic implementation - in production, this would connect to your database

interface Collection {
  name: string;
  description?: string;
  packImage?: string;
  slug: string;
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  try {
    // Fetch real collection data from contract-info API using slug
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://geoart.studio';
    const response = await fetch(`${baseUrl}/api/contract-info?contractAddress=${slug}`);
    
    if (response.ok) {
      const data = await response.json();
      const contractInfo = data.contractInfo;
      
      // Transform API response to Collection interface
      const collectionName = contractInfo?.nftName || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return {
        name: collectionName,
        description: contractInfo?.description || `Open ${collectionName} booster packs on VibeChain`,
        packImage: contractInfo?.packImage,
        slug: slug
      };
    }
    
    // Fallback to generated collection if API fails
    const collectionName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      name: collectionName,
      description: `Open ${collectionName} booster packs on VibeMarket`,
      slug: slug
    };
    
  } catch (error) {
    console.error('Error fetching collection:', error);
    
    // Return fallback collection on error
    const collectionName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      name: collectionName,
      description: `Open ${collectionName} booster packs on VibeMarket`,
      slug: slug
    };
  }
}