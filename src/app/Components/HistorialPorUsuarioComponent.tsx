import React, { useState, useEffect } from "react";
import { useHistorialContext } from "../Provider/ProviderHistorial";
import { useUsuarioContext } from "../Provider/ProviderUsuario";
import { Historial } from "../Models/Historial";

const HistorialPorUsuarioComponent = () => {
  const { usuarioLogueado } = useUsuarioContext();
  const { obtenerHistorialDeUsuario, historial } = useHistorialContext();

  // Efecto para obtener el historial del usuario logueado al cargar el componente
  useEffect(() => {
    if (usuarioLogueado?.id_usuario) {
      obtenerHistorialDeUsuario(usuarioLogueado.id_usuario);
    }
  }, [usuarioLogueado, obtenerHistorialDeUsuario]);

  return (
    <div className="container mt-4" style={{ paddingBottom: "30px" }}> {/* Margen inferior */}
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="card-title">Historial de {usuarioLogueado?.nombre_completo}</h2>
        </div>
        <div className="card-body" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
          {historial.length > 0 ? (
            <div className="mt-4">
              <div style={{ height: '400px', overflowY: 'auto', marginBottom: '20px' }}> {/* Contenedor con scroll y margen */}
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Número Expediente</th>
                      <th>Nombre Establecimiento</th>
                      <th>Región Sanitaria</th>
                      <th>Departamento</th>
                      <th>Unidad Área</th>
                      <th>Fecha de Transferencia</th>
                      <th>Comentario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((item: Historial) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.Expediente?.numero_expediente || "N/A"}</td>
                        <td>{item.Expediente?.nombre_establecimiento || "N/A"}</td>
                        <td>{item.Expediente?.region_sanitaria || "N/A"}</td>
                        <td>{item.Expediente?.departamento || "N/A"}</td>
                        <td>{item.Expediente?.unidad_area || "N/A"}</td>
                        <td>{new Date(item.fecha_transferencia).toLocaleString()}</td>
                        <td>{item.comentario || "Sin comentario"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p>No hay historial disponible para este usuario.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialPorUsuarioComponent;
