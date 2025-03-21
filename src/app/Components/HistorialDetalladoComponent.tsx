'use client'
import React, { useEffect } from 'react'
import { useHistorialContext } from '../Provider/ProviderHistorial'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function HistorialDetalladoComponent() {
  const { historial, obtenerHistorialDetallado } = useHistorialContext();

  useEffect(() => {
    obtenerHistorialDetallado();
  }, [obtenerHistorialDetallado]);

  return (
    <div className="container mt-4" style={{ paddingBottom: '30px' }}>
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="card-title text-center fw-bold">Historial de Expedientes</h2>
        </div>
        <div className="card-body" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          <div style={{ height: '400px', overflowY: 'auto', marginBottom: '20px' }}>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Expediente</th>
                  <th>Establecimiento</th>
                  <th>Región Sanitaria</th>
                  <th>Departamento</th>
                  <th>Unidad Área</th>
                  <th>Estado</th>
                  <th>Fecha Creación</th>
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
                      <td className="fw-bold">{item.Expediente?.numero_expediente || "N/A"}</td>
                      <td>{item.Expediente?.nombre_establecimiento || "N/A"}</td>
                      <td>{item.Expediente?.region_sanitaria || "N/A"}</td>
                      <td>{item.Expediente?.departamento || "N/A"}</td>
                      <td>{item.Expediente?.unidad_area || "N/A"}</td>
                      <td className={item.Expediente?.estado ? "text-success" : "text-danger"}>
                        {item.Expediente?.estado ? "Activo" : "Finalizado"}
                      </td>
                      <td>
                        {item.Expediente?.fecha_creacion
                          ? new Date(item.Expediente.fecha_creacion).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="text-success">
                        {item.Usuario?.nombre_completo || "Desconocido"}
                      </td>
                      <td>{item.Usuario?.unidad_area || "N/A"}</td>
                      <td>
                        {item.fecha_transferencia
                          ? new Date(item.fecha_transferencia).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="text-muted">
                        {item.comentario || "Sin comentario"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="text-center text-danger">
                      No hay registros disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
