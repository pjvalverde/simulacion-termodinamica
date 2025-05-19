import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CarnotPage from './pages/CarnotPage';
import BioreactorPage from './pages/BioreactorPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <div className="container">
            <h1>Simulaciones de Termodinámica</h1>
            <p>Herramientas educativas para la enseñanza de principios termodinámicos</p>
          </div>
        </header>
        
        <main>
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/carnot" element={<CarnotPage />} />
              <Route path="/bioreactor" element={<BioreactorPage />} />
            </Routes>
          </div>
        </main>
        
        <footer>
          <div className="container">
            <p>Desarrollado con fines educativos</p>
            <p className="copyright">© {new Date().getFullYear()} - Simulaciones de Termodinámica</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
