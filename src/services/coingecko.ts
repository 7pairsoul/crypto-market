import { fetchWithCache } from '../utils/api';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

export interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  description: {
    en: string;
  };
  image: {
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    price_change_percentage_24h: number;
    circulating_supply: number;
    max_supply: number | null;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
  };
}

export interface PriceHistory {
  prices: [number, number][];
  total_volumes: [number, number][];
}

export interface CoinPrice {
  prices: [number, number][];
  total_volumes: [number, number][];
}

export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: {
      [key: string]: number;
    };
    market_cap: {
      [key: string]: number;
    };
    total_volume: {
      [key: string]: number;
    };
    high_24h: {
      [key: string]: number;
    };
    low_24h: {
      [key: string]: number;
    };
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
  };
}

export const getCoins = async (page: number = 1, perPage: number = 20): Promise<Coin[]> => {
  const url = `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`;
  const cacheKey = `coins_list_page_${page}`;
  
  return fetchWithCache<Coin[]>(url, cacheKey);
};

export const getCoinDetails = async (id: string): Promise<CoinDetails> => {
  const url = `${API_BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
  const cacheKey = `coin_details_${id}`;
  
  return fetchWithCache<CoinDetails>(url, cacheKey);
};

export const getCoinHistory = async (id: string, days: '1d' | '7d' | '30d'): Promise<PriceHistory> => {
  const url = `${API_BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
  const cacheKey = `coin_history_${id}_${days}`;
  
  return fetchWithCache<PriceHistory>(url, cacheKey);
};

export const getCoinPriceHistory = async (
  coinId: string,
  days: number = 1,
  vsCurrency: string = 'usd'
): Promise<CoinPrice> => {
  const url = `${API_BASE_URL}/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}`;
  const cacheKey = `price_${coinId}_${vsCurrency}_${days}`;
  
  return fetchWithCache<CoinPrice>(url, cacheKey);
};

export const getCoinMarketData = async (
  coinId: string,
  vsCurrency: string = 'usd'
): Promise<CoinMarketData> => {
  const url = `${API_BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
  const cacheKey = `market_${coinId}_${vsCurrency}`;
  
  return fetchWithCache<CoinMarketData>(url, cacheKey);
};

// Add more API methods as needed... 