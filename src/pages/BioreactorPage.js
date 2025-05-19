import React from 'react';
import { Link } from 'react-router-dom';
import BioreactorSimulation from '../components/Bioreactor/BioreactorSimulation';

function BioreactorPage() {
  return (
    <div>
      <Link to="/" className="text-blue-600 mb-4" style={{ display: 'inline-block' }}>
        &larr; Volver al inicio
      </Link>
      
      <h1 className="text-center mb-4">Simulación de Biorreactor</h1>
      
      <BioreactorSimulation />
      
      <div className="bg-green-50 p-4 rounded-lg mt-8">
        <h2 className="mb-2">Sobre esta simulación</h2>
        <p>
          Esta simulación permite a estudiantes y profesionales de bioingeniería comprender el 
          funcionamiento básico de un biorreactor, modificar sus parámetros de operación y observar 
          cómo estos cambios afectan al crecimiento celular y la eficiencia del proceso.
        </p>
      </div>
    </div>
  );
}

export default BioreactorPage; 