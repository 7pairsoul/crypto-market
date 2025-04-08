const BASE_URL = 'https://api.coingecko.com/api/v3';

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

export const getTopCoins = async (perPage: number = 20): Promise<Coin[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch coins');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching coins:', error);
    throw error;
  }
}; 