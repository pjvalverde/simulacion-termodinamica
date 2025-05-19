import React, { useState, useEffect } from 'react';

const CarnotCycleSimulation = () => {
  // Estado para los parámetros del ciclo
  const [tempCaliente, setTempCaliente] = useState(600); // K
  const [tempFria, setTempFria] = useState(300); // K
  const [volMin, setVolMin] = useState(1); // m³
  const [volMax, setVolMax] = useState(3); // m³
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [running, setRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [time, setTime] = useState(0);
  
  // Constantes
  const R = 8.314; // Constante de los gases ideales en J/(mol·K)
  const n = 1; // Moles de gas
  
  // Calculamos el rendimiento teórico
  const rendimientoTeorico = 1 - (tempFria / tempCaliente);
  
  // Cálculos para los puntos del ciclo
  const puntos = [
    { 
      nombre: "A", 
      volumen: volMin, 
      temperatura: tempFria,
      presion: n * R * tempFria / volMin,
      descripcion: "Compresión isotérmica: El gas se comprime a temperatura constante (fría), transfiriendo calor al foco frío."
    },
    { 
      nombre: "B", 
      volumen: volMin, 
      temperatura: tempCaliente,
      presion: n * R * tempCaliente / volMin,
      descripcion: "Expansión adiabática: El gas se expande sin intercambio de calor, aumentando su temperatura."
    },
    { 
      nombre: "C", 
      volumen: volMax, 
      temperatura: tempCaliente,
      presion: n * R * tempCaliente / volMax,
      descripcion: "Expansión isotérmica: El gas se expande a temperatura constante (caliente), absorbiendo calor del foco caliente."
    },
    { 
      nombre: "D", 
      volumen: volMax, 
      temperatura: tempFria,
      presion: n * R * tempFria / volMax,
      descripcion: "Compresión adiabática: El gas se comprime sin intercambio de calor, disminuyendo su temperatura."
    }
  ];
  
  // Calculamos el trabajo y calor en cada etapa
  const calcularParametrosTermodinamicos = () => {
    // Calor absorbido del foco caliente (Proceso C → D, expansión isotérmica)
    const QH = n * R * tempCaliente * Math.log(volMax / volMin);
    
    // Calor cedido al foco frío (Proceso A → B, compresión isotérmica)
    const QL = n * R * tempFria * Math.log(volMin / volMax);
    
    // Trabajo neto realizado
    const W = QH + QL; // QL es negativo
    
    // Rendimiento real
    const rendimientoReal = W / QH;
    
    return { QH, QL, W, rendimientoReal };
  };
  
  const { QH, QL, W, rendimientoReal } = calcularParametrosTermodinamicos();
  
  // Función para generar puntos interpolados para la animación
  const generarPuntosInterpolados = () => {
    const puntosInterpolados = [];
    const numPuntosPorTramo = 30;
    
    // Función para generar puntos de una isoterma
    const generarIsotermaPuntos = (v1, v2, T, numPuntos) => {
      const puntos = [];
      for (let i = 0; i < numPuntos; i++) {
        const v = v1 + (v2 - v1) * (i / (numPuntos - 1));
        const p = n * R * T / v;
        puntos.push({ volumen: v, presion: p });
      }
      return puntos;
    };
    
    // Función para generar puntos de una adiabática (PV^γ = constante)
    const generarAdiabaticaPuntos = (v1, v2, p1, numPuntos) => {
      const gamma = 1.4; // Relación de calores específicos para un gas diatómico
      const constante = p1 * Math.pow(v1, gamma);
      const puntos = [];
      for (let i = 0; i < numPuntos; i++) {
        const v = v1 + (v2 - v1) * (i / (numPuntos - 1));
        const p = constante / Math.pow(v, gamma);
        puntos.push({ volumen: v, presion: p });
      }
      return puntos;
    };
    
    // Tramo A → B (compresión isotérmica)
    puntosInterpolados.push(...generarIsotermaPuntos(volMax, volMin, tempFria, numPuntosPorTramo));
    
    // Tramo B → C (expansión adiabática)
    puntosInterpolados.push(...generarAdiabaticaPuntos(volMin, volMin, puntos[1].presion, numPuntosPorTramo));
    
    // Tramo C → D (expansión isotérmica)
    puntosInterpolados.push(...generarIsotermaPuntos(volMin, volMax, tempCaliente, numPuntosPorTramo));
    
    // Tramo D → A (compresión adiabática)
    puntosInterpolados.push(...generarAdiabaticaPuntos(volMax, volMax, puntos[3].presion, numPuntosPorTramo));
    
    return puntosInterpolados;
  };
  
  // Animación
  useEffect(() => {
    let intervalId;
    
    if (running) {
      intervalId = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          const totalPoints = generarPuntosInterpolados().length;
          const newPhase = Math.floor((newTime % totalPoints) / (totalPoints / 4));
          setCurrentPhase(newPhase);
          return newTime;
        });
      }, animationSpeed);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [running, animationSpeed, volMin, volMax, tempFria, tempCaliente]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Cálculo de la posición actual para la animación
  const puntosInterpolados = generarPuntosInterpolados();
  const currentPointIndex = time % puntosInterpolados.length;
  const currentPoint = puntosInterpolados[currentPointIndex];
  
  // Dimensiones para el gráfico
  const width = 600;
  const height = 400;
  const padding = 50;
  
  // Escalas para el gráfico
  const maxPresion = Math.max(...puntos.map(p => p.presion)) * 1.1;
  const xScale = (v) => padding + (width - 2 * padding) * ((v - volMin) / (volMax - volMin));
  const yScale = (p) => height - padding - (height - 2 * padding) * (p / maxPresion);
  
  // Funciones para dibujar isotermas e isocoras
  const isotermaPath = (temp) => {
    let path = "";
    const numPoints = 50;
    for (let i = 0; i < numPoints; i++) {
      const vol = volMin + (i / (numPoints - 1)) * (volMax - volMin);
      const pre = n * R * temp / vol;
      const x = xScale(vol);
      const y = yScale(pre);
      path += (i === 0 ? "M" : "L") + `${x},${y}`;
    }
    return path;
  };
  
  // Trazamos las curvas del ciclo
  const cicloPath = 
    `M${xScale(puntos[0].volumen)},${yScale(puntos[0].presion)} ` +
    `L${xScale(puntos[1].volumen)},${yScale(puntos[1].presion)} ` +
    `L${xScale(puntos[2].volumen)},${yScale(puntos[2].presion)} ` +
    `L${xScale(puntos[3].volumen)},${yScale(puntos[3].presion)} ` +
    `Z`;
  
  return (
    <div className="flex flex-col items-center gap-6 p-4 bg-gray-50 rounded-lg">
      
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Panel de control */}
        <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-md w-full md:w-1/3">
          <h2 className="text-lg font-semibold">Parámetros</h2>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Temperatura foco caliente: {tempCaliente} K
              <input 
                type="range" 
                min={400} 
                max={1000}
                value={tempCaliente}
                onChange={(e) => setTempCaliente(Number(e.target.value))}
                className="w-full"
              />
            </label>
            
            <label className="text-sm font-medium">
              Temperatura foco frío: {tempFria} K
              <input 
                type="range" 
                min={200} 
                max={tempCaliente - 100}
                value={tempFria}
                onChange={(e) => setTempFria(Number(e.target.value))}
                className="w-full"
              />
            </label>
            
            <label className="text-sm font-medium">
              Volumen mínimo: {volMin.toFixed(1)} m³
              <input 
                type="range" 
                min={0.5} 
                max={2.5}
                step={0.1}
                value={volMin}
                onChange={(e) => setVolMin(Number(e.target.value))}
                className="w-full"
              />
            </label>
            
            <label className="text-sm font-medium">
              Volumen máximo: {volMax.toFixed(1)} m³
              <input 
                type="range" 
                min={volMin + 0.5} 
                max={5}
                step={0.1}
                value={volMax}
                onChange={(e) => setVolMax(Number(e.target.value))}
                className="w-full"
              />
            </label>
            
            <label className="text-sm font-medium">
              Velocidad de animación:
              <input 
                type="range" 
                min={10} 
                max={200}
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(200 - Number(e.target.value))}
                className="w-full"
              />
            </label>
            
            <button 
              onClick={() => setRunning(!running)}
              className={`mt-2 px-4 py-2 rounded-md font-medium ${running ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
            >
              {running ? 'Detener' : 'Iniciar'} Animación
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h3 className="text-md font-semibold">Rendimiento</h3>
            <p className="text-sm">Teórico: {(rendimientoTeorico * 100).toFixed(2)}%</p>
            <p className="text-sm">Real (calculado): {(rendimientoReal * 100).toFixed(2)}%</p>
          </div>
          
          <div className="mt-2 p-3 bg-green-50 rounded-lg">
            <h3 className="text-md font-semibold">Trabajo y Calor</h3>
            <p className="text-sm">Q<sub>H</sub> (absorbido): {QH.toFixed(2)} J</p>
            <p className="text-sm">Q<sub>L</sub> (cedido): {Math.abs(QL).toFixed(2)} J</p>
            <p className="text-sm">W (trabajo): {W.toFixed(2)} J</p>
          </div>
        </div>
        
        {/* Diagrama PV */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-2/3">
          <svg width={width} height={height} className="mx-auto">
            {/* Ejes */}
            <line 
              x1={padding} y1={height - padding} 
              x2={width - padding} y2={height - padding} 
              stroke="black" strokeWidth="2"
            />
            <line 
              x1={padding} y1={height - padding} 
              x2={padding} y2={padding} 
              stroke="black" strokeWidth="2"
            />
            
            {/* Etiquetas de los ejes */}
            <text x={width/2} y={height - 10} textAnchor="middle" fontSize="12">Volumen (m³)</text>
            <text x={15} y={height/2} textAnchor="middle" fontSize="12" transform={`rotate(-90, 15, ${height/2})`}>Presión (Pa)</text>
            
            {/* Ciclo de Carnot */}
            <path d={cicloPath} fill="rgba(135, 206, 250, 0.3)" stroke="blue" strokeWidth="2" />
            
            {/* Isotermas (líneas de temperatura constante) */}
            <path d={isotermaPath(tempCaliente)} stroke="red" strokeWidth="1" strokeDasharray="5,5" fill="none" />
            <path d={isotermaPath(tempFria)} stroke="blue" strokeWidth="1" strokeDasharray="5,5" fill="none" />
            
            {/* Puntos del ciclo */}
            {puntos.map((punto, i) => (
              <g key={i}>
                <circle 
                  cx={xScale(punto.volumen)} 
                  cy={yScale(punto.presion)} 
                  r="5" 
                  fill={currentPhase === i ? "red" : "white"} 
                  stroke="black" 
                  strokeWidth="1.5"
                />
                <text 
                  x={xScale(punto.volumen) + 8} 
                  y={yScale(punto.presion) - 8} 
                  fontSize="12" 
                  fontWeight="bold"
                >
                  {punto.nombre}
                </text>
              </g>
            ))}
            
            {/* Punto de animación */}
            {running && currentPoint && (
              <circle 
                cx={xScale(currentPoint.volumen)} 
                cy={yScale(currentPoint.presion)} 
                r="4" 
                fill="red"
              />
            )}
            
            {/* Etiquetas en los ejes */}
            <text x={xScale(volMin)} y={height - padding + 20} textAnchor="middle" fontSize="10">{volMin.toFixed(1)}</text>
            <text x={xScale(volMax)} y={height - padding + 20} textAnchor="middle" fontSize="10">{volMax.toFixed(1)}</text>
            <text x={padding - 25} y={yScale(0)} textAnchor="middle" fontSize="10">0</text>
            <text x={padding - 25} y={yScale(maxPresion)} textAnchor="middle" fontSize="10">{Math.round(maxPresion)}</text>
          </svg>
          
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <h3 className="text-md font-semibold">Etapa actual:</h3>
            <p className="text-sm">{puntos[currentPhase].descripcion}</p>
          </div>
        </div>
      </div>
      
      <div className="w-full bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Aplicaciones del Ciclo de Carnot</h2>
        <p className="text-sm mb-2">El ciclo de Carnot representa el límite teórico máximo de eficiencia para cualquier máquina térmica. Aunque no puede implementarse de forma exacta en la práctica, establece el estándar contra el cual se comparan todos los ciclos termodinámicos reales.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h3 className="text-md font-semibold">Aplicaciones Prácticas</h3>
            <ul className="text-sm list-disc pl-5">
              <li>Motores de combustión interna (aproximación)</li>
              <li>Centrales térmicas de generación eléctrica</li>
              <li>Refrigeradores y bombas de calor</li>
              <li>Turbinas de vapor y gas</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="text-md font-semibold">Limitaciones Prácticas</h3>
            <ul className="text-sm list-disc pl-5">
              <li>Imposibilidad de procesos completamente reversibles</li>
              <li>Fricción y pérdidas de calor</li>
              <li>Dificultad para mantener temperaturas constantes</li>
              <li>Velocidad limitada de los procesos reales</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <h3 className="text-md font-semibold">Aplicaciones en Bioingeniería</h3>
            <ul className="text-sm list-disc pl-5">
              <li>Diseño de dispositivos de refrigeración para conservación de tejidos biológicos</li>
              <li>Sistemas de control térmico para biorreactores y fermentadores</li>
              <li>Optimización energética en equipos de esterilización médica</li>
              <li>Modelado del metabolismo celular como sistema termodinámico</li>
              <li>Desarrollo de prótesis con sistemas de refrigeración interna</li>
              <li>Máquinas de perfusión para preservación de órganos para trasplantes</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <h3 className="text-md font-semibold">Investigación en Bioingeniería</h3>
            <ul className="text-sm list-disc pl-5">
              <li>Estudio de la eficiencia energética en procesos biológicos</li>
              <li>Modelado termodinámico de sistemas enzimáticos</li>
              <li>Diseño de dispositivos para criogenia de pequeña escala</li>
              <li>Optimización térmica en microfluidica para aplicaciones biomédicas</li>
              <li>Análisis energético de biosensores y dispositivos implantables</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-2">
        Simulación desarrollada para fines educativos. Los valores son aproximados y basados en el modelo de gas ideal.
      </div>
    </div>
  );
};

export default CarnotCycleSimulation; 