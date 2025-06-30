import { useState, useEffect } from 'react';
import { fetchCarBrands } from '../services/vehicleApi';
import type { CarBrand } from '../types/appointment';

export const useCarBrands = () => {
  const [brands, setBrands] = useState<CarBrand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBrands = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const fetchedBrands = await fetchCarBrands();
        setBrands(fetchedBrands);
      } catch (err) {
        setError('Failed to load car brands');
        console.error('Error loading car brands:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  return { brands, loading, error };
};