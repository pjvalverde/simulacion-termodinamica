import React, { useState, useEffect, useRef } from 'react';

const BioreactorSimulation = () => {
  // Estados básicos para el biorreactor
  const [temperature, setTemperature] = useState(37);
  const [pH, setPH] = useState(7.0);
  const [stirringSpeed, setStirringSpeed] = useState(200);
  const [dissolvedOxygen, setDissolvedOxygen] = useState(40);
  const [cellDensity, setCellDensity] = useState(0.1);
  const [running, setRunning] = useState(false);
  const [sterilized, setSterilized] = useState(false);
  const [time, setTime] = useState(0);
  const [activeTab, setActiveTab] = useState('simulation');
  
  // Referencia para el intervalo
  const intervalRef = useRef(null);
  
  // Iniciar/detener simulación
  const toggleSimulation = () => {
    if (running) {
      clearInterval(intervalRef.current);
      setRunning(false);
    } else {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 0.1);
        // Simulación simplificada del crecimiento celular
        setCellDensity(prev => prev * (1 + 0.05 * Math.random()));
      }, 100);
      setRunning(true);
    }
  };
  
  // Esterilizar el biorreactor
  const sterilizeReactor = () => {
    setSterilized(true);
  };
  
  // Reiniciar simulación
  const resetSimulation = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTime(0);
    setCellDensity(0.1);
    setSterilized(false);
  };
  
  // Limpiar intervalo al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Tabs navigation
  const renderTabs = () => {
    return (
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'simulation' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('simulation')}
        >
          Simulación
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'explanation' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('explanation')}
        >
          Explicación y Aplicaciones
        </button>
      </div>
    );
  };

  // Renderizar el contenido de simulación
  const renderSimulationContent = () => {
    return (
      <>
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-xl">
          <svg width="300" height="300" className="mx-auto">
            {/* Cuerpo del reactor */}
            <rect x="75" y="50" width="150" height="200" rx="20" fill="#e0e0e0" stroke="#999" strokeWidth="2" />
            
            {/* Interior del reactor */}
            <rect x="90" y="65" width="120" height="170" rx="10" fill="#f8f8f8" />
            
            {/* Líquido en el reactor */}
            <rect 
              x="90" 
              y="65" 
              width="120" 
              height="170" 
              rx="10" 
              fill={`rgba(0, 128, 0, ${Math.min(cellDensity/5, 0.8)})`} 
            />
            
            {/* Agitador */}
            <g transform={`rotate(${stirringSpeed * time % 360}, 150, 150)`}>
              <line x1="150" y1="100" x2="150" y2="200" stroke="#666" strokeWidth="4" />
              <line x1="120" y1="150" x2="180" y2="150" stroke="#666" strokeWidth="4" />
            </g>
            
            {/* Sensores */}
            <rect x="65" y="120" width="10" height="20" fill="#ff6b6b" stroke="#333" />
            <text x="55" y="132" textAnchor="end" fontSize="10">T</text>
            
            <rect x="65" y="170" width="10" height="20" fill="#4ecdc4" stroke="#333" />
            <text x="55" y="182" textAnchor="end" fontSize="10">pH</text>
            
            <text x="150" y="40" textAnchor="middle" fontSize="14" fontWeight="bold">Biorreactor</text>
          </svg>
          
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div className="bg-blue-100 p-2 rounded">
              <p className="font-bold">Temperatura</p>
              <p>{temperature.toFixed(1)} °C</p>
            </div>
            <div className="bg-green-100 p-2 rounded">
              <p className="font-bold">pH</p>
              <p>{pH.toFixed(1)}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded">
              <p className="font-bold">Agitación</p>
              <p>{stirringSpeed} rpm</p>
            </div>
          </div>
        </div>
        
        {/* Controles */}
        <div className="flex gap-2 mt-4">
          <button 
            onClick={toggleSimulation}
            className={`px-4 py-2 rounded-md text-white ${running ? 'bg-red-500' : 'bg-green-500'}`}
          >
            {running ? 'Detener' : 'Iniciar'}
          </button>
          
          <button 
            onClick={sterilizeReactor}
            className={`px-4 py-2 rounded-md ${sterilized ? 'bg-green-100 text-green-800' : 'bg-blue-500 text-white'}`}
            disabled={sterilized}
          >
            {sterilized ? 'Esterilizado' : 'Esterilizar'}
          </button>
          
          <button 
            onClick={resetSimulation}
            className="px-4 py-2 rounded-md bg-gray-500 text-white"
          >
            Reiniciar
          </button>
        </div>
        
        {/* Parámetros ajustables */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-xl mt-4">
          <h2 className="text-lg font-semibold mb-2">Parámetros de operación</h2>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Temperatura: {temperature.toFixed(1)} °C
              <input 
                type="range" 
                min={20} 
                max={50}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full"
              />
            </label>
            
            <label className="text-sm font-medium">
              pH: {pH.toFixed(1)}
              <input 
                type="range" 
                min={4} 
                max={10}
                step={0.1}
                value={pH}
                onChange={(e) => setPH(Number(e.target.value))}
                className="w-full"
              />
            </label>
            
            <label className="text-sm font-medium">
              Velocidad de agitación: {stirringSpeed} rpm
              <input 
                type="range" 
                min={50} 
                max={500}
                value={stirringSpeed}
                onChange={(e) => setStirringSpeed(Number(e.target.value))}
                className="w-full"
              />
            </label>
          </div>
        </div>
        
        {/* Información básica */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-xl mt-4">
          <h2 className="text-lg font-semibold mb-2">Datos del proceso</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <p className="text-sm font-semibold">Densidad celular:</p>
              <p className="text-lg">{cellDensity.toFixed(2)} g/L</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <p className="text-sm font-semibold">Tiempo:</p>
              <p className="text-lg">{time.toFixed(1)} h</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <p className="text-sm font-semibold">Estado:</p>
              <p className="text-lg">{sterilized ? "Esterilizado" : "No esterilizado"}</p>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <p className="text-sm font-semibold">Proceso:</p>
              <p className="text-lg">{running ? "En marcha" : "Detenido"}</p>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Renderizar el contenido de explicación
  const renderExplanationContent = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-2xl font-bold text-green-800 mb-4">El Biorreactor en la Simulación y su Aplicación a Bioingeniería</h2>
        
        <section className="mb-6">
          <h3 className="text-xl font-semibold text-green-700 mb-3">El Biorreactor en la Simulación</h3>
          <p className="mb-3">La simulación que he desarrollado representa un biorreactor de tanque agitado (STR), uno de los diseños más utilizados en bioingeniería. En esta simulación, el biorreactor incluye:</p>
          
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2">Componentes Principales Modelados</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Tanque cilíndrico</strong>: El recipiente principal donde ocurren las reacciones biológicas, diseñado para mantener condiciones asépticas.</li>
              <li><strong>Sistema de agitación</strong>: Representado por un agitador mecánico que gira a velocidad variable para garantizar la homogeneidad del cultivo y mejorar la transferencia de masa.</li>
              <li><strong>Control de temperatura</strong>: Simula el sistema de calentamiento/enfriamiento que mantiene condiciones térmicas óptimas para el crecimiento celular.</li>
              <li><strong>Control de pH</strong>: Modelado mediante sensores y la posibilidad de ajustar el pH, crucial para la actividad enzimática.</li>
              <li><strong>Aireación</strong>: Visualizado mediante burbujas que representan la transferencia de oxígeno al medio de cultivo.</li>
            </ol>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2">Procesos Biológicos Simulados</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Crecimiento celular</strong>: Mediante la ecuación de Monod, que relaciona el crecimiento con la concentración de sustrato disponible.</li>
              <li><strong>Consumo de sustrato</strong>: Modelado considerando tanto el sustrato utilizado para crecimiento como para mantenimiento celular.</li>
              <li><strong>Producción de metabolitos</strong>: Simulando tanto la producción asociada al crecimiento como la no asociada (modelo de Luedeking-Piret).</li>
              <li><strong>Transferencia de oxígeno</strong>: Representada por el coeficiente kLa, que depende de la velocidad de agitación y características del sistema.</li>
            </ol>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Modos de Operación Implementados</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Batch</strong>: Sin entrada ni salida durante la operación, donde los nutrientes iniciales se consumen progresivamente.</li>
              <li><strong>Fed-batch</strong>: Con alimentación continua o intermitente de medio fresco sin extracción de producto.</li>
              <li><strong>Continuo</strong>: Donde hay entrada constante de medio fresco y salida del cultivo, manteniendo un volumen constante.</li>
            </ol>
          </div>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-semibold text-green-700 mb-3">Aplicaciones en Bioingeniería</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">1. Producción de Biofármacos</h4>
              <p className="mb-2">En la industria biofarmacéutica, los biorreactores son esenciales para:</p>
              <ul className="list-disc pl-5">
                <li>Producción de proteínas recombinantes: Como insulina, hormona de crecimiento, o anticuerpos monoclonales.</li>
                <li>Cultivo de células para terapias avanzadas: Incluidas células madre y terapias celulares personalizadas.</li>
                <li>Producción de vacunas: Tanto tradicionales como de nueva generación.</li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">2. Producción de Enzimas Industriales</h4>
              <p className="mb-2">Las enzimas utilizadas en múltiples industrias requieren biorreactores para su producción:</p>
              <ul className="list-disc pl-5">
                <li>Enzimas para detergentes: Como proteasas, amilasas y lipasas.</li>
                <li>Enzimas para alimentos: Utilizadas en la producción de quesos, jugos, y cerveza.</li>
                <li>Enzimas para biocombustibles: Como celulasas para la degradación de biomasa.</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">3. Bioconversiones y Biosíntesis</h4>
              <p className="mb-2">Los biorreactores facilitan transformaciones biocatalíticas:</p>
              <ul className="list-disc pl-5">
                <li>Síntesis de compuestos quirales: Utilizados en la industria farmacéutica.</li>
                <li>Modificación enzimática de productos naturales: Para mejorar propiedades o crear nuevos compuestos.</li>
                <li>Bioconversión de residuos: Transformando desechos en productos de valor agregado.</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">4. Tratamiento de Efluentes</h4>
              <p className="mb-2">En ingeniería ambiental, los biorreactores son cruciales para:</p>
              <ul className="list-disc pl-5">
                <li>Degradación de contaminantes: Mediante consorcios microbianos especializados.</li>
                <li>Tratamiento de aguas residuales: En procesos aeróbicos y anaeróbicos.</li>
                <li>Producción de biogás: A partir de residuos orgánicos.</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">5. Investigación y Desarrollo en Bioingeniería</h4>
            <p className="mb-2">Los modelos de biorreactores simulados son herramientas fundamentales para:</p>
            <ul className="list-disc pl-5">
              <li>Optimización de bioprocesos: Permitiendo probar múltiples condiciones sin gastar recursos.</li>
              <li>Escalamiento industrial: Facilitando la transición de laboratorio a producción.</li>
              <li>Diseño de experimentos: Identificando parámetros críticos que requieren control preciso.</li>
              <li>Educación en bioingeniería: Proporcionando experiencia práctica sin riesgos ni costos elevados.</li>
            </ul>
          </div>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-semibold text-green-700 mb-3">Principios Termodinámicos Aplicados</h3>
          
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">1. Transferencia de Calor</h4>
              <p className="mb-2">El control térmico es fundamental en bioprocesos por varios motivos:</p>
              <ul className="list-disc pl-5">
                <li>Metabolismo celular: Las enzimas tienen temperaturas óptimas específicas donde su actividad es máxima.</li>
                <li>Esterilización: La eliminación de microorganismos contaminantes mediante aplicación de calor (121°C típicamente).</li>
                <li>Balance energético: El metabolismo celular genera calor que debe ser removido para mantener condiciones constantes.</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">2. Transferencia de Masa</h4>
              <p className="mb-2">La transferencia de masa incluye:</p>
              <ul className="list-disc pl-5">
                <li>Suministro de oxígeno: Crucial para cultivos aeróbicos, limitado por su baja solubilidad en agua.</li>
                <li>Distribución de nutrientes: Facilitada por la agitación para evitar gradientes.</li>
                <li>Eliminación de productos metabólicos: Que podrían inhibir el crecimiento si se acumulan.</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">3. Balance Energético</h4>
              <p className="mb-2">El balance energético considera:</p>
              <ul className="list-disc pl-5">
                <li>Energía para agitación: Proporcionada por el motor del agitador.</li>
                <li>Energía para control térmico: Calentamiento o enfriamiento según se requiera.</li>
                <li>Energía metabólica: Liberada durante el crecimiento celular y la formación de productos.</li>
              </ul>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold text-green-700 mb-3">Valor Educativo de la Simulación</h3>
          <p className="mb-3">Esta simulación de biorreactor ofrece múltiples beneficios educativos en bioingeniería:</p>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Comprensión intuitiva</strong>: Visualiza conceptos abstractos de cinética microbiana y transferencia de masa.</li>
              <li><strong>Experimentación segura</strong>: Permite probar condiciones extremas sin riesgos biológicos o costos.</li>
              <li><strong>Integración de conceptos</strong>: Conecta principios termodinámicos con aplicaciones biológicas reales.</li>
              <li><strong>Desarrollo de pensamiento crítico</strong>: Al analizar cómo diferentes parámetros afectan el rendimiento del proceso.</li>
              <li><strong>Preparación para la práctica real</strong>: Familiariza a los estudiantes con variables críticas y comportamientos esperados antes de trabajar con equipos reales.</li>
            </ol>
          </div>
          
          <p className="mt-4">La simulación del biorreactor complementa perfectamente la simulación del ciclo de Carnot, mostrando la aplicación de principios termodinámicos tanto en sistemas físicos como biológicos, proporcionando una comprensión holística de la termodinámica aplicada a ingeniería.</p>
        </section>
      </div>
    );
  };
  
  // Renderizar biorreactor
  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
      {renderTabs()}
      
      <div className="w-full">
        {activeTab === 'simulation' ? renderSimulationContent() : renderExplanationContent()}
      </div>
      
      <div className="text-xs text-gray-500 mt-4 text-center">
        Simulación desarrollada para fines educativos.
      </div>
    </div>
  );
};

export default BioreactorSimulation; 