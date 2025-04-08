# Crypto Market Dashboard

A real-time cryptocurrency market dashboard built with React, TypeScript, and Vite. This project provides live cryptocurrency price tracking and market data visualization.

## Features

### Current Features
- 📊 Real-time cryptocurrency price tracking
- 💰 Top 20 cryptocurrencies by market cap
- 📈 24-hour price change indicators
- 💎 Market cap and volume information
- 🌙 Dark theme optimized for crypto trading
- 📱 Responsive design for all devices
- 🔄 Auto-refresh data every 60 seconds

### Planned Features
- 📈 Detailed price charts (Line/Candlestick)
  - Historical price data
  - Multiple timeframe options
  - Technical indicators
- 💡 Individual coin pages with:
  - Detailed market statistics
  - Trading volume analysis
  - Price history
  - Market sentiment indicators
- 🔍 Search functionality
- 📊 Additional market metrics
- 🌓 Light/Dark theme toggle

## Tech Stack

- ⚡️ [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- ⚛️ [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- 📘 [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- 🎨 CSS Modules for styling
- 📡 [CoinGecko API](https://www.coingecko.com/en/api) - Cryptocurrency data

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/crypto-market.git
cd crypto-market
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## Project Structure

```
crypto-market/
├── src/
│   ├── components/     # React components
│   ├── services/       # API services
│   ├── assets/         # Static assets
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── public/             # Public assets
└── package.json        # Project dependencies
```

## API Usage

This project uses the free CoinGecko API. Please note the following rate limits:
- 10-30 calls/minute for the free tier
- No API key required for basic endpoints

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [CoinGecko](https://www.coingecko.com/) for providing the cryptocurrency data API
- [Vite](https://vitejs.dev/) for the amazing build tool
- [React](https://reactjs.org/) for the frontend framework
