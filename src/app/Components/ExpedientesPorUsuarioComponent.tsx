'use client'
import React, { useEffect, useState } from "react";
import { useExpedienteContext } from "../Provider/ProviderExpediente";
import { useUsuarioContext } from "../Provider/ProviderUsuario";
import { Expediente } from "../Models/Expediente";
import { Usuario } from "../Models/Usuario";

const ExpedientesUsuario: React.FC = () => {
  const { obtenerExpedientesPorUsuario, expedientes, editarExpediente, transferirExpediente } = useExpedienteContext();
  const { usuarioLogueado } = useUsuarioContext(); 
  const [cargando, setCargando] = useState(true);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [expedienteTransferencia, setExpedienteTransferencia] = useState<Expediente | null>(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [expedienteEditando, setExpedienteEditando] = useState<Expediente | null>(null);
  const [formExpediente, setFormExpediente] = useState<Partial<Expediente>>({});
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
    if (usuarioLogueado) {
      obtenerExpedientesPorUsuario(usuarioLogueado.id_usuario).then(() => setCargando(false));
    }
  }, [usuarioLogueado]);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:5000/users");
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const abrirModalEdicion = (exp: Expediente) => {
    setExpedienteEditando(exp);
    setFormExpediente({
      ...exp,
      unidad_area: undefined, // Evita que se edite la unidad
    });
  };

  const abrirModalTransferencia = async (exp: Expediente) => {
    setExpedienteTransferencia(exp);
    await cargarUsuarios();
  };

  const cerrarModalTransferencia = () => {
    setExpedienteTransferencia(null);
    setUsuarioSeleccionado(null);
  };

  const cerrarModal = () => {
    setExpedienteEditando(null);
    setFormExpediente({});
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormExpediente({
      ...formExpediente,
      [e.target.name]: e.target.name === "estado" ? e.target.value === "true" : e.target.value,
    });
  };

  const guardarEdicion = async () => {
    if (expedienteEditando) {
      await editarExpediente(expedienteEditando.id_expediente, formExpediente);
      cerrarModal();
      setMensajeExito("Expediente editado con éxito.");
      setTimeout(() => setMensajeExito(null), 5000);
    }
  };

  const manejarSeleccionUsuario = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idSeleccionado = Number(e.target.value);
    const usuarioEncontrado = usuarios.find((user) => user.id_usuario === idSeleccionado);
    setUsuarioSeleccionado(usuarioEncontrado || null);
  };

  const ejecutarTransferencia = async () => {
    if (expedienteTransferencia && usuarioSeleccionado) {
      try {
        // Aquí se llama al método del provider usando el ID del expediente,
        // la unidad del usuario destino y el ID del usuario destino.
        await transferirExpediente(
          expedienteTransferencia.id_expediente,
          usuarioSeleccionado.unidad_area,
          usuarioSeleccionado.id_usuario
        );
        await obtenerExpedientesPorUsuario(usuarioLogueado?.id_usuario || 0);
        cerrarModalTransferencia();
        setMensajeExito("Expediente transferido con éxito.");
        setTimeout(() => setMensajeExito(null), 5000);
      } catch (error) {
        console.error("Error al ejecutar la transferencia:", error);
      }
    }
  };

  if (cargando) return <p className="text-center mt-4">Cargando expedientes...</p>;

  return (
    <div className="container mt-4">
      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {mensajeExito}
          <button type="button" className="btn-close" onClick={() => setMensajeExito(null)}></button>
        </div>
      )}

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
                        <button className="btn btn-warning btn-sm me-2" onClick={() => abrirModalEdicion(exp)}>
                          Editar
                        </button>
                        <button className="btn btn-success btn-sm" onClick={() => abrirModalTransferencia(exp)}>
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

      {/* Modal de edición */}
      {expedienteEditando && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Editar Expediente</h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Número Expediente</label>
                  <input type="text" className="form-control" name="numero_expediente" value={formExpediente.numero_expediente || ''} onChange={manejarCambio} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre Establecimiento</label>
                  <input type="text" className="form-control" name="nombre_establecimiento" value={formExpediente.nombre_establecimiento || ''} onChange={manejarCambio} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Región Sanitaria</label>
                  <input type="number" className="form-control" name="region_sanitaria" value={formExpediente.region_sanitaria || ''} onChange={manejarCambio} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Departamento</label>
                  <input type="text" className="form-control" name="departamento" value={formExpediente.departamento || ''} onChange={manejarCambio} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select className="form-select" name="estado" value={formExpediente.estado ? "true" : "false"} onChange={manejarCambio}>
                    <option value="true">Activo</option>
                    <option value="false">Finalizado</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>
                <button className="btn btn-primary" onClick={guardarEdicion}>Guardar Cambios</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de transferencia */}
      {expedienteTransferencia && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Transferir Expediente</h5>
                <button type="button" className="btn-close" onClick={cerrarModalTransferencia}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Usuario Actual</label>
                  <input type="text" className="form-control" value={usuarioLogueado?.nombre_completo} disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label">Unidad Actual</label>
                  <input type="text" className="form-control" value={usuarioLogueado?.unidad_area} disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label">Seleccionar Usuario Destino</label>
                  <select className="form-select" onChange={manejarSeleccionUsuario} value={usuarioSeleccionado?.id_usuario || ""}>
                    <option value="">Seleccione un usuario</option>
                    {usuarios.map((user) => (
                      <option key={user.id_usuario} value={user.id_usuario}>
                        {user.nombre_completo} - {user.unidad_area}
                      </option>
                    ))}
                  </select>
                </div>
                {usuarioSeleccionado && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Usuario Destino</label>
                      <input type="text" className="form-control" value={usuarioSeleccionado.nombre_completo} disabled />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Unidad del Usuario</label>
                      <input type="text" className="form-control" value={usuarioSeleccionado.unidad_area} disabled />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModalTransferencia}>Cancelar</button>
                <button className="btn btn-success" onClick={ejecutarTransferencia}>Transferir</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpedientesUsuario;
