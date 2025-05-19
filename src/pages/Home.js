import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <h1 className="text-center mb-6">Simulaciones de Termodinámica</h1>
      
      <div className="grid grid-cols-2">
        <div className="card transition-shadow hover-shadow-lg">
          <h2 className="text-blue-800 mb-2">Ciclo de Carnot</h2>
          <p className="text-gray-700 mb-4">
            Simulación interactiva del ciclo ideal de Carnot. Visualiza el diagrama PV, 
            calcula rendimientos y comprende las etapas del ciclo.
          </p>
          <Link 
            to="/carnot" 
            className="btn"
          >
            Ver simulación
          </Link>
        </div>
        
        <div className="card transition-shadow hover-shadow-lg">
          <h2 className="text-green-800 mb-2">Biorreactor</h2>
          <p className="text-gray-700 mb-4">
            Simula el funcionamiento de un biorreactor para bioprocesos. Controla parámetros de operación,
            visualiza el crecimiento celular y la producción de metabolitos.
          </p>
          <Link 
            to="/bioreactor" 
            className="btn"
          >
            Ver simulación
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home; 