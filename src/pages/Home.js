import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-6">Simulaciones de Termodinámica</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Ciclo de Carnot</h2>
          <p className="text-gray-700 mb-4">
            Simulación interactiva del ciclo ideal de Carnot. Visualiza el diagrama PV, 
            calcula rendimientos y comprende las etapas del ciclo.
          </p>
          <Link 
            to="/carnot" 
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Ver simulación
          </Link>
        </div>
        
        <div className="bg-gray-100 rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Próximamente</h2>
          <p className="text-gray-600 italic">
            Nuevas simulaciones termodinámicas serán agregadas próximamente...
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home; 