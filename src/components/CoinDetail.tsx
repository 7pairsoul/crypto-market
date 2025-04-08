import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCoinDetails, getCoinHistory, CoinDetails, PriceHistory } from '../services/coingecko';
import { ChartSelector } from './charts/ChartSelector';
import { Loader } from './Loader';
import { FaArrowLeft } from 'react-icons/fa';


export const CoinDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<CoinDetails | null>(null);
  const [history, setHistory] = useState<PriceHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('Invalid coin ID');
        return;
      }
      
      try {
        setLoading(true);
        const [coinData, historyData] = await Promise.all([
          getCoinDetails(id),
          getCoinHistory(id, '7d') // Default to 7d timeframe
        ]);
        setCoin(coinData);
        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching coin data:', error);
        setError('Failed to fetch coin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatLargeNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(num);
  };

  if (loading) return <Loader />;
  if (error) return <div className="container error-message">{error}</div>;
  if (!coin || !history || !id) return <div className="container error-message">Coin not found</div>;

  return (
    <div className="coin-detail">
      <button className="back-button" onClick={() => navigate('/')}>
        <FaArrowLeft /> Back to List
      </button>
      
      <div className="coin-header">
        <img src={coin.image.small} alt={coin.name} />
        <h1>{coin.name} ({coin.symbol.toUpperCase()})</h1>
      </div>

      <div className="market-stats">
        <div className="stat">
          <h3>Price</h3>
          <p>{formatPrice(coin.market_data.current_price.usd)}</p>
        </div>
        <div className="stat">
          <h3>24h Change</h3>
          <p className={coin.market_data.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
            {coin.market_data.price_change_percentage_24h.toFixed(2)}%
          </p>
        </div>
        <div className="stat">
          <h3>Market Cap</h3>
          <p>{formatLargeNumber(coin.market_data.market_cap.usd)}</p>
        </div>
        <div className="stat">
          <h3>24h Volume</h3>
          <p>{formatLargeNumber(coin.market_data.total_volume.usd)}</p>
        </div>
      </div>

      <div className="chart-section">
        <ChartSelector 
          coinId={id}
          initialData={{
            prices: history.prices,
            total_volumes: history.total_volumes
          }}
          initialTimeframe="7d"
        />
      </div>

      <div className="coin-info">
        <h2 className='mt-2'>About {coin.name}</h2>
        <div>
          <p>{coin.description.en}</p>
        </div>
        
        <h2 className='mt-2'>Links</h2>
        <div className="coin-links">
          {coin.links.homepage[0] && (
            <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer">
              Website
            </a>
          )}
          {coin.links.blockchain_site[0] && (
            <a href={coin.links.blockchain_site[0]} target="_blank" rel="noopener noreferrer">
              Blockchain Explorer
            </a>
          )}
          {coin.links.official_forum_url[0] && (
            <a href={coin.links.official_forum_url[0]} target="_blank" rel="noopener noreferrer">
              Forum
            </a>
          )}
        </div>
      </div>
    </div>
  );
}; 