import { z } from 'zod';
import { carBrandsApiResponseSchema, type CarBrand } from '../types/appointment';

const API_BASE_URL = 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model';

// Cache for car brands to avoid repeated API calls
let carBrandsCache: CarBrand[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const fetchCarBrands = async (): Promise<CarBrand[]> => {
  // Return cached data if it's still valid
  if (
    carBrandsCache && 
    cacheTimestamp && 
    Date.now() - cacheTimestamp < CACHE_DURATION
  ) {
    return carBrandsCache;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/records?group_by=make&limit=100`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const validatedData = carBrandsApiResponseSchema.parse(data);
    
    // Sort brands alphabetically
    const sortedBrands = validatedData.results
      .sort((a, b) => a.make.localeCompare(b.make));

    // Update cache
    carBrandsCache = sortedBrands;
    cacheTimestamp = Date.now();

    return sortedBrands;
  } catch (error) {
    console.error('Error fetching car brands:', error);
    
    // Return fallback data if API fails
    return [{ make: 'Other' }];
  }
};

// Clear cache (useful for testing or manual refresh)
export const clearCarBrandsCache = (): void => {
  carBrandsCache = null;
  cacheTimestamp = null;
};