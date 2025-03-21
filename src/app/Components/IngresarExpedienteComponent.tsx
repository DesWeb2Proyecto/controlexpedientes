'use client'
import React, { useState, useEffect } from 'react';
import { useExpedienteContext } from '../Provider/ProviderExpediente';
import { useUsuarioContext } from '../Provider/ProviderUsuario';
import { useRouter } from 'next/navigation';

interface IngresarExpedienteProps {
  onExpedienteCreado: () => void;
}

const IngresarExpedienteComponent: React.FC<IngresarExpedienteProps> = ({ onExpedienteCreado }) => {
  const { crearExpediente } = useExpedienteContext();
  const { usuarioLogueado } = useUsuarioContext();
  const router = useRouter();

  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    numero_expediente: '',
    nombre_establecimiento: '',
    region_sanitaria: '',
    departamento: '',
    unidad_area: '',
    estado: true, // Siempre activo
    id_usuario: '',
  });

  // Autocompletar unidad_area e id_usuario con los datos del usuario logueado
  useEffect(() => {
    if (usuarioLogueado) {
      setFormData((prev) => ({
        ...prev,
        unidad_area: usuarioLogueado.unidad_area,
        id_usuario: usuarioLogueado.id_usuario.toString(),
      }));
    }
  }, [usuarioLogueado]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén completos
    if (
      !formData.numero_expediente ||
      !formData.nombre_establecimiento ||
      !formData.region_sanitaria ||
      !formData.departamento ||
      !formData.unidad_area ||
      !formData.id_usuario
    ) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    // Crear el objeto expediente
    const nuevoExpediente = {
      numero_expediente: formData.numero_expediente,
      nombre_establecimiento: formData.nombre_establecimiento,
      region_sanitaria: parseInt(formData.region_sanitaria, 10),
      departamento: formData.departamento,
      unidad_area: formData.unidad_area,
      estado: formData.estado,
      id_usuario: parseInt(formData.id_usuario, 10),
    };

    console.log('Datos a enviar:', nuevoExpediente);

    try {
      // Crear el expediente
      await crearExpediente(nuevoExpediente);
      alert('Expediente creado con éxito.');

      // Limpiar el formulario (manteniendo la unidad e id del usuario logueado)
      setFormData({
        numero_expediente: '',
        nombre_establecimiento: '',
        region_sanitaria: '',
        departamento: '',
        unidad_area: usuarioLogueado?.unidad_area ?? '',
        estado: true,
        id_usuario: usuarioLogueado?.id_usuario.toString() ?? '',
      });

      // Llamar al callback para notificar que se creó un expediente
      onExpedienteCreado();

      // Forzar el remount de la página actual (refrescando la página)
      router.refresh();
    } catch (error) {
      console.error('Error al crear expediente:', error);
      alert('Ocurrió un error, inténtelo de nuevo.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="card-title">Crear Nuevo Expediente</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Número de Expediente:</label>
              <input
                type="text"
                name="numero_expediente"
                value={formData.numero_expediente}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nombre del Establecimiento:</label>
              <input
                type="text"
                name="nombre_establecimiento"
                value={formData.nombre_establecimiento}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Región Sanitaria:</label>
              <input
                type="number"
                name="region_sanitaria"
                value={formData.region_sanitaria}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Departamento:</label>
              <input
                type="text"
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Unidad/Área:</label>
              <input
                type="text"
                name="unidad_area"
                value={formData.unidad_area}
                onChange={handleChange}
                className="form-control"
                required
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">ID del Usuario:</label>
              <input
                type="number"
                name="id_usuario"
                value={formData.id_usuario}
                onChange={handleChange}
                className="form-control"
                required
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Estado:</label>
              <input
                type="text"
                name="estado"
                value="Activo"
                className="form-control"
                disabled
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Crear Expediente
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IngresarExpedienteComponent;
