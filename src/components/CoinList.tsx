import { useEffect, useState } from 'react';
import { Coin, getTopCoins } from '../services/coingecko';

export const CoinList = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await getTopCoins(20);
        setCoins(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Failed to fetch coin data');
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
    // Refresh data every 60 seconds
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="container">
      <h1>Top Cryptocurrencies</h1>
      <div className="grid">
        {coins.map((coin) => (
          <div key={coin.id} className="coin-card">
            <img src={coin.image} alt={coin.name} className="coin-image" />
            <div className="coin-info">
              <h2>{coin.name} ({coin.symbol.toUpperCase()})</h2>
              <p className="price">${coin.current_price.toLocaleString()}</p>
              <p className={`change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </p>
              <p className="market-cap">Market Cap: ${coin.market_cap.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 