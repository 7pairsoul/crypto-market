import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  TooltipItem,
  Scale,
  CoreScaleOptions,
  TimeScale,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import 'chartjs-adapter-date-fns';
// import { PriceHistory } from '../../services/coingecko';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

interface ChartJSChartProps {
  data: {
    prices: [number, number][];
    total_volumes: [number, number][];
  };
  timeframe: '1d' | '7d' | '30d' | '1y';
}

const ChartJSChart: React.FC<ChartJSChartProps> = ({ data, timeframe }) => {
  const chartData: ChartData<'line'> = {
    labels: data.prices.map(([timestamp]) => timestamp),
    datasets: [
      {
        label: 'Price',
        data: data.prices.map(([, price]) => price),
        borderColor: '#646cff',
        backgroundColor: 'rgba(100, 108, 255, 0.1)',
        fill: true,
        tension: 0.4,
      },
      // {
      //   label: 'Volume',
      //   data: data.total_volumes.map(([, volume]) => volume),
      //   borderColor: '#26a69a',
      //   backgroundColor: 'rgba(38, 166, 154, 0.1)',
      //   fill: true,
      //   tension: 0.4,
      //   yAxisID: 'volume',
      // },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeframe === '1d' ? 'hour' : 'day',
        },
        ticks: {
          callback: function(this: Scale<CoreScaleOptions>, tickValue: number | string) {
            return format(Number(tickValue), timeframe === '1d' ? 'HH:mm' : 'MMM dd');
          },
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Price (USD)',
        },
      },
      // volume: {
      //   type: 'linear' as const,
      //   display: true,
      //   position: 'right' as const,
      //   title: {
      //     display: true,
      //     text: 'Volume',
      //   },
      //   grid: {
      //     drawOnChartArea: false,
      //   },
      // },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: $${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ChartJSChart; 