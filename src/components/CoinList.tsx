import React, { useState, useEffect } from 'react';
import { getCoins, Coin } from '../services/coingecko';
import { useNavigate } from 'react-router-dom';
import { Loader } from './Loader';

export const CoinList: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const coinsPerPage = 20;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const data = await getCoins(currentPage, coinsPerPage);
        setCoins(data);
        // Assuming there are at least 100 coins total (5 pages)
        setTotalPages(5);
        setError(null);
      } catch (err) {
        setError('Failed to fetch coins. Please try again later.');
        console.error('Error fetching coins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Top Cryptocurrencies</h2>
      
      <div className="grid">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="coin-card"
            onClick={() => navigate(`/coin/${coin.id}`)}
            role="button"
            tabIndex={0}
          >
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
      
      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-buttons">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`pagination-button ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}; 