import React, { useState, useEffect, useCallback } from 'react';
import { getCoins, searchCoins, Coin } from '../services/coingecko';
import { useNavigate } from 'react-router-dom';
import { Loader } from './Loader';
import { FaSearch } from 'react-icons/fa';
import debounce from 'lodash/debounce';

export const CoinList: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const coinsPerPage = 20;
  const navigate = useNavigate();

  const fetchCoins = async (page: number) => {
    try {
      setLoading(true);
      const data = await getCoins(page, coinsPerPage);
      setCoins(data);
      setTotalPages(5); // Assuming there are at least 100 coins total (5 pages)
      setError(null);
    } catch (err) {
      setError('Failed to fetch coins. Please try again later.');
      console.error('Error fetching coins:', err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term) {
        setIsSearching(false);
        fetchCoins(currentPage);
        return;
      }

      try {
        setLoading(true);
        const results = await searchCoins(term);
        setCoins(results);
        setIsSearching(true);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to search coins. Please try again later.';
        setError(errorMessage);
        console.error('Error searching coins:', err);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (!searchTerm) {
      fetchCoins(currentPage);
    } else {
      debouncedSearch(searchTerm);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [currentPage, searchTerm, debouncedSearch]);

  const handlePageChange = (page: number) => {
    if (!isSearching) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  const handleCoinClick = (coinId: string) => {
    navigate(`/coin/${coinId}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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

  return (
    <div className="content-container">
      <h2 className="text-2xl font-bold mb-6">Top Cryptocurrencies</h2>
      
      <div className="search-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <>
          <div className="grid">
            {coins.map((coin) => (
              <div
                key={coin.id}
                className="coin-card"
                onClick={() => handleCoinClick(coin.id)}
                role="button"
                tabIndex={0}
              >
                <img src={coin.image} alt={coin.name} className="coin-image" />
                <div className="coin-info">
                  <h2>{coin.name} ({coin.symbol.toUpperCase()})</h2>
                  <p className="price">{formatPrice(coin.current_price)}</p>
                  <p className={`change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </p>
                  <p className="market-cap">{formatLargeNumber(coin.market_cap)}</p>
                </div>
              </div>
            ))}
          </div>
          
          {!isSearching && (
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
          )}
        </>
      )}
    </div>
  );
}; 