import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function CarnotCycleSimulation() {
  const [temperature1, setTemperature1] = useState(400); // K
  const [temperature2, setTemperature2] = useState(300); // K
  const [volume1, setVolume1] = useState(1); // m³
  const [volume2, setVolume2] = useState(2); // m³

  // Calculate points for the Carnot cycle
  const calculateCyclePoints = () => {
    const points = [];
    const R = 8.314; // Gas constant in J/(mol·K)
    const n = 1; // Number of moles

    // Process 1-2: Isothermal expansion at T1
    for (let v = volume1; v <= volume2; v += (volume2 - volume1) / 10) {
      points.push({
        volume: v,
        pressure: (n * R * temperature1) / v
      });
    }

    // Process 2-3: Adiabatic expansion
    const gamma = 1.4; // Heat capacity ratio for diatomic gas
    const p2 = (n * R * temperature1) / volume2;
    const v3 = volume2 * Math.pow(temperature2 / temperature1, 1 / (1 - gamma));
    for (let v = volume2; v <= v3; v += (v3 - volume2) / 10) {
      points.push({
        volume: v,
        pressure: p2 * Math.pow(volume2 / v, gamma)
      });
    }

    // Process 3-4: Isothermal compression at T2
    for (let v = v3; v >= volume1; v -= (v3 - volume1) / 10) {
      points.push({
        volume: v,
        pressure: (n * R * temperature2) / v
      });
    }

    // Process 4-1: Adiabatic compression
    const p4 = (n * R * temperature2) / volume1;
    for (let v = volume1; v >= volume1; v -= 0.1) {
      points.push({
        volume: v,
        pressure: p4 * Math.pow(volume1 / v, gamma)
      });
    }

    return points;
  };

  const efficiency = ((temperature1 - temperature2) / temperature1 * 100).toFixed(1);
  const cycleData = calculateCyclePoints();

  return (
    <div className="p-4">
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Parámetros del Ciclo</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temperatura Alta (T₁) [K]
              </label>
              <input
                type="number"
                value={temperature1}
                onChange={(e) => setTemperature1(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temperatura Baja (T₂) [K]
              </label>
              <input
                type="number"
                value={temperature2}
                onChange={(e) => setTemperature2(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Volumen Inicial (V₁) [m³]
              </label>
              <input
                type="number"
                value={volume1}
                onChange={(e) => setVolume1(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Volumen Final (V₂) [m³]
              </label>
              <input
                type="number"
                value={volume2}
                onChange={(e) => setVolume2(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Resultados</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Eficiencia del Ciclo: <span className="font-semibold">{efficiency}%</span>
            </p>
            <p className="text-sm text-gray-600">
              Esta es la máxima eficiencia teórica posible para un motor térmico
              operando entre estas temperaturas.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Diagrama P-V del Ciclo de Carnot</h3>
        <LineChart
          width={600}
          height={400}
          data={cycleData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="volume"
            label={{ value: 'Volumen (m³)', position: 'bottom' }}
          />
          <YAxis
            label={{ value: 'Presión (Pa)', angle: -90, position: 'left' }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pressure"
            stroke="#8884d8"
            name="Ciclo de Carnot"
          />
        </LineChart>
      </div>
    </div>
  );
}

export default CarnotCycleSimulation; 