import React from 'react';
import { Link } from 'react-router-dom';
import CarnotCycleSimulation from '../components/CarnotCycle/CarnotCycleSimulation';

function CarnotPage() {
  return (
    <div>
      <Link to="/" className="text-blue-600 mb-4" style={{ display: 'inline-block' }}>
        &larr; Volver al inicio
      </Link>
      
      <h1 className="text-center mb-4">Simulación del Ciclo de Carnot</h1>
      
      <CarnotCycleSimulation />
      
      <div className="bg-blue-50 p-4 rounded-lg mt-8">
        <h2 className="mb-2">Sobre esta simulación</h2>
        <p>
          Esta simulación permite a los estudiantes visualizar el ciclo termodinámico ideal 
          de Carnot, modificar sus parámetros y comprender cómo afectan al rendimiento del 
          sistema. Es útil para cursos de termodinámica y física.
        </p>
      </div>
    </div>
  );
}

export default CarnotPage; 