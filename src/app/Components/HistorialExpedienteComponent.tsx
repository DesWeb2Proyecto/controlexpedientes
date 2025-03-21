'use client'
import React, { useState } from 'react';
import { useHistorialContext } from '../Provider/ProviderHistorial';

export default function HistorialExpedienteComponent() {
  const { obtenerHistorialExpediente, historial } = useHistorialContext();
  const [numeroExpediente, setNumeroExpediente] = useState('');
  const [expediente, setExpediente] = useState<any>(null);

  const handleBuscar = async () => {
    if (numeroExpediente.trim() === '') {
      alert('Por favor, ingrese un número de expediente');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/historial/expediente/${numeroExpediente}`);
      const data = await res.json();

      // Guardar los datos del expediente
      setExpediente(data.expediente);

      // Obtener historial desde el contexto
      obtenerHistorialExpediente(numeroExpediente);

    } catch (error) {
      alert('Error al obtener el historial del expediente: ' + error);
    }
  };

  return (
    <div className="container mt-4" style={{ paddingBottom: '30px' }}>
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="card-title">Historial de Expedientes</h2>
        </div>

        <div className="card-body" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          {/* Barra de búsqueda */}
          <div className="row justify-content-center mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingrese el número de expediente"
                  value={numeroExpediente}
                  onChange={(e) => setNumeroExpediente(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleBuscar}>
                  Buscar
                </button>
              </div>
            </div>
          </div>

          {/* Mostrar la tabla sólo si existe un expediente y hay historial */}
          {expediente ? (
            <div className="mt-4">
              <div style={{ height: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                <table className="table table-striped text-center align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Expediente</th>
                      <th>Establecimiento</th>
                      <th>Usuario</th>
                      <th>Unidad Área Usuario</th>
                      <th>Fecha Transferencia</th>
                      <th>Comentario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.length > 0 ? (
                      historial.map((item: any, index: number) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td><strong>{expediente.numero_expediente}</strong></td>
                          <td>{expediente.nombre}</td>
                          <td className="text-success fw-bold">
                            {item.Usuario?.nombre_completo || 'Desconocido'}
                          </td>
                          <td>{item.Usuario?.unidad_area || 'No asignado'}</td>
                          <td>
                            {item.fecha_transferencia
                              ? new Date(item.fecha_transferencia).toLocaleString()
                              : 'N/A'}
                          </td>
                          <td>{item.comentario || 'Sin comentario'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center text-danger">
                          No hay registros disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-center">No hay historial disponible para este expediente.</p>
          )}
        </div>
      </div>
    </div>
  );
}
