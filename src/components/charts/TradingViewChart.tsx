import { 
  createChart, 
  ColorType, 
  IChartApi, 
  ISeriesApi,
  CandlestickData,
  Time,
  CandlestickSeries
} from 'lightweight-charts';
import { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  data: {
    prices: [number, number][];
  };
  timeframe: '1d' | '7d' | '30d' | '1y';
}

export const TradingViewChart = ({ data, timeframe }: TradingViewChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#DDD',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Create candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      wickVisible: true,
      borderColor: '#378658',
      borderUpColor: '#26a69a',
      borderDownColor: '#ef5350',
      wickColor: '#737375'
    });

    // Format data for candlestick chart
    const candleData: CandlestickData<Time>[] = data.prices.map((price, index) => {
      const nextPrice = data.prices[index + 1];
      return {
        time: price[0] / 1000 as Time, // Convert to seconds
        open: price[1],
        high: nextPrice ? Math.max(price[1], nextPrice[1]) : price[1],
        low: nextPrice ? Math.min(price[1], nextPrice[1]) : price[1],
        close: nextPrice ? nextPrice[1] : price[1],
      };
    });

    candlestickSeries.setData(candleData);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Store references
    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, timeframe]);

  return (
    <div className="chart-container">
      <div ref={chartContainerRef} />
    </div>
  );
}; 