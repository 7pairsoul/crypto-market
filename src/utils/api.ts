interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = {
  PRICE: 5 * 60 * 1000, // 5 minutes for price data
  MARKET: 5 * 60 * 1000, // 5 minutes for market data
  STATIC: 24 * 60 * 60 * 1000, // 24 hours for static data
};

export const getCachedData = <T>(key: string): T | null => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const { data, timestamp }: CacheItem<T> = JSON.parse(cached);
  const now = Date.now();
  const cacheAge = now - timestamp;

  // Check if cache is still valid based on the key type
  let isValid = false;
  if (key.includes('price') || key.includes('market')) {
    isValid = cacheAge < CACHE_DURATION.PRICE;
  } else if (key.includes('static')) {
    isValid = cacheAge < CACHE_DURATION.STATIC;
  }

  return isValid ? data : null;
};

export const setCachedData = <T>(key: string, data: T): void => {
  const cacheItem: CacheItem<T> = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(cacheItem));
};

// Utility function to add delay between requests
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Example usage with fetch:
export const fetchWithCache = async <T>(
  url: string,
  cacheKey: string,
  options?: RequestInit
): Promise<T> => {
  // Try to get cached data first
  const cachedData = getCachedData<T>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Add a small delay to prevent rate limiting
  await delay(1000);

  // Add API key to headers if available
  const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
  const headers = {
    ...options?.headers,
    ...(apiKey ? { 'x-cg-demo-api-key': apiKey } : {}),
  };

  // Fetch fresh data
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Cache the new data
  setCachedData(cacheKey, data);
  
  return data;
}; 