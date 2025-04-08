import { CoinList } from './components/CoinList'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Crypto Market</h1>
      </header>
      <main>
        <CoinList />
      </main>
    </div>
  )
}

export default App
