import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CarnotPage from './pages/CarnotPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App bg-gray-50 min-h-screen">
        <header className="bg-blue-800 text-white p-4 shadow-md">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold">Simulaciones de Termodinámica</h1>
            <p className="text-sm">Herramientas educativas para la enseñanza de principios termodinámicos</p>
          </div>
        </header>
        
        <main className="py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/carnot" element={<CarnotPage />} />
          </Routes>
        </main>
        
        <footer className="bg-gray-800 text-white p-4 mt-8">
          <div className="max-w-6xl mx-auto text-center">
            <p>Desarrollado con fines educativos</p>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} - Simulaciones de Termodinámica</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
