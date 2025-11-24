import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StatsPage from './components/StatsPage';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/code/:code" element={<StatsPage />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; 2025 TinyLink. Built with React & Express.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;