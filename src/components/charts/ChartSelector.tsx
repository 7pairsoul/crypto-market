import { useState } from 'react';
import ChartJSChart from './ChartJSChart';
import { TradingViewChart } from './TradingViewChart';
import { getCoinHistory } from '../../services/coingecko';
import { Loader } from '../Loader';

interface ChartSelectorProps {
  coinId: string;
  initialData: {
    prices: [number, number][];
    total_volumes: [number, number][];
  };
  initialTimeframe: '1d' | '7d' | '30d';
}

type ChartType = 'chartjs' | 'tradingview';

export const ChartSelector = ({ coinId, initialData, initialTimeframe }: ChartSelectorProps) => {
  const [chartType, setChartType] = useState<ChartType>('tradingview');
  const [timeframe, setTimeframe] = useState(initialTimeframe);
  const [chartData, setChartData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleTimeframeChange = async (newTimeframe: '1d' | '7d' | '30d') => {
    if (newTimeframe === timeframe) return;
    
    setLoading(true);
    try {
      const newData = await getCoinHistory(coinId, newTimeframe);
      setChartData(newData);
      setTimeframe(newTimeframe);
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chart-selector">
      <div className="chart-controls">
        <div className="chart-type-buttons">
          <button
            className={chartType === 'chartjs' ? 'active' : ''}
            onClick={() => setChartType('chartjs')}
          >
            Line Chart
          </button>
          <button
            className={chartType === 'tradingview' ? 'active' : ''}
            onClick={() => setChartType('tradingview')}
          >
            Candlestick Chart
          </button>
        </div>

        <div className="timeframe-buttons">
          <button 
            className={timeframe === '1d' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('1d')}
            disabled={loading}
          >
            24H
          </button>
          <button 
            className={timeframe === '7d' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('7d')}
            disabled={loading}
          >
            7D
          </button>
          <button 
            className={timeframe === '30d' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('30d')}
            disabled={loading}
          >
            30D
          </button>
        </div>
      </div>
      
      {loading ? (
        <Loader />
      ) : (
        chartType === 'chartjs' ? (
          <ChartJSChart data={chartData} timeframe={timeframe} />
        ) : (
          <TradingViewChart data={chartData} timeframe={timeframe} />
        )
      )}
    </div>
  );
}; 