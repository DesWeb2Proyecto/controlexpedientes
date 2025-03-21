'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useExpedienteContext } from '../Provider/ProviderExpediente';
import { Expediente } from '../Models/Expediente';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficaExpedientesComponent: React.FC = () => {
  const { expedientes, obtenerExpedientes } = useExpedienteContext();
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [chartData, setChartData] = useState<any>(null);

  // Cargar expedientes al montar el componente
  useEffect(() => {
    obtenerExpedientes();
  }, [obtenerExpedientes]);

  // Memorizar la lista de años únicos
  const years = useMemo(() => {
    return Array.from(
      new Set((expedientes as Expediente[]).map(exp => new Date(exp.fecha_creacion).getFullYear()))
    ).sort();
  }, [expedientes]);

  // Función para filtrar duplicados: agrupa por "numero_expediente" y conserva el expediente con la fecha más reciente.
  const getUniqueExpedientes = (exps: Expediente[]): Expediente[] => {
    const grouped = exps.reduce((acc, exp) => {
      const key = exp.numero_expediente;
      if (!acc[key] || new Date(exp.fecha_creacion) > new Date(acc[key].fecha_creacion)) {
        acc[key] = exp;
      }
      return acc;
    }, {} as Record<string, Expediente>);
    return Object.values(grouped);
  };

  // Memorizar los expedientes únicos
  const uniqueExpedientes = useMemo(() => getUniqueExpedientes(expedientes as Expediente[]), [expedientes]);

  // Cada vez que se selecciona un año o cambian los expedientes, recalcular la gráfica
  useEffect(() => {
    if (selectedYear) {
      // Filtrar por el año seleccionado
      const filtered = uniqueExpedientes.filter((exp: Expediente) =>
        new Date(exp.fecha_creacion).getFullYear().toString() === selectedYear
      );
      const activos = filtered.filter(exp => exp.estado === true).length;
      const finalizados = filtered.filter(exp => exp.estado === false).length;
      const total = activos + finalizados;
      const porcentajeActivos = total > 0 ? Math.round((activos / total) * 100) : 0;
      const porcentajeFinalizados = total > 0 ? Math.round((finalizados / total) * 100) : 0;

      setChartData({
        labels: [`Activo (${porcentajeActivos}%)`, `Finalizado (${porcentajeFinalizados}%)`],
        datasets: [
          {
            label: 'Expedientes',
            data: [porcentajeActivos, porcentajeFinalizados],
            backgroundColor: ['#28a745', '#dc3545'],
            borderColor: ['#28a745', '#dc3545'],
            borderWidth: 1,
          }
        ]
      });
    } else {
      setChartData(null);
    }
  }, [selectedYear, uniqueExpedientes]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div className="container mt-4 mb-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="card-title text-center fw-bold">Gráfica de Expedientes por Año</h2>
        </div>
        <div className="card-body" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          <div className="row justify-content-center mb-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Seleccione el Año:</label>
              <select className="form-select" value={selectedYear} onChange={handleYearChange}>
                <option value="">-- Seleccione un Año --</option>
                {years.map(year => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {chartData ? (
            // Contenedor para la gráfica con altura fija y scroll, que se adapta al ancho del contenedor
            <div
              className="d-flex justify-content-center"
              style={{ height: '400px', overflowY: 'auto', marginTop: '20px', marginBottom: '20px' }}
            >
              <div style={{ width: '100%' }}>
                <Pie data={chartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          ) : (
            <p className="text-center">Seleccione un año para ver la gráfica.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraficaExpedientesComponent;
