import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-copyright">
            <p>© {new Date().getFullYear()} Crypto Market. All rights reserved.</p>
          </div>
          <div className="footer-attribution">
            <p>Powered by</p>
            <a 
              href="https://www.coingecko.com/en/api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="api-link"
            >
              CoinGecko API
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
