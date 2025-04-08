import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CoinList } from './components/CoinList';
import { CoinDetail } from './components/CoinDetail';
import { Footer } from './components/Footer';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <div className="container">
            <div className="header-content">
              <Link to="/" className="header-title">
                <img src="/btc.svg" alt="Bitcoin" width={30} height={30} />
                <h1>Crypto Market</h1>
              </Link>
            </div>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<CoinList />} />
            <Route path="/coin/:id" element={<CoinDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
