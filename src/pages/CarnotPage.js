import React from 'react';
import { Link } from 'react-router-dom';
import CarnotCycleSimulation from '../components/CarnotCycle/CarnotCycleSimulation';

function CarnotPage() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Volver al inicio
      </Link>
      
      <h1 className="text-2xl font-bold text-center my-4">Simulación del Ciclo de Carnot</h1>
      
      <CarnotCycleSimulation />
      
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Sobre esta simulación</h2>
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