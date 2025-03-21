'use client'
import React, { useEffect, useState } from "react";
import { useExpedienteContext } from "../Provider/ProviderExpediente";
import { useUsuarioContext } from "../Provider/ProviderUsuario";
import { Expediente } from "../Models/Expediente";

const ExpedientesUsuario: React.FC = () => {
  const { obtenerExpedientesPorUsuario, expedientes } = useExpedienteContext();
  const { usuarioLogueado } = useUsuarioContext(); // Obtener usuario logueado
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (usuarioLogueado) {
      obtenerExpedientesPorUsuario(usuarioLogueado.id_usuario).then(() =>
        setCargando(false)
      );
    }
  }, [usuarioLogueado]);

  if (cargando) return <p className="text-center mt-4">Cargando expedientes...</p>;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="m-0">Expedientes de {usuarioLogueado?.nombre_completo}</h2>
        </div>
        <div className="card-body">
          <h4 className="mb-3">Historial del Usuario</h4>
          {expedientes.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Número Expediente</th>
                    <th>Nombre Establecimiento</th>
                    <th>Región Sanitaria</th>
                    <th>Departamento</th>
                    <th>Unidad Área</th>
                    <th>Estado</th>
                    <th>Fecha Creación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {expedientes.map((exp, index) => (
                    <tr key={exp.id_expediente}>
                      <td>{index + 1}</td>
                      <td>{exp.numero_expediente}</td>
                      <td>{exp.nombre_establecimiento}</td>
                      <td>{exp.region_sanitaria}</td>
                      <td>{exp.departamento}</td>
                      <td>{exp.unidad_area}</td>
                      <td>{exp.estado ? "Activo" : "Finalizado"}</td>
                      <td>{new Date(exp.fecha_creacion).toLocaleString()}</td>
                      <td>
                        <button className="btn btn-warning btn-sm me-2">
                          Editar
                        </button>
                        <button className="btn btn-success btn-sm">
                          Transferir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center">No hay expedientes asignados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpedientesUsuario;
