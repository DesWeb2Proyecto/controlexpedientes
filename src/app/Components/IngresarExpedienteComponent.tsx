import React, { useState, useEffect } from 'react';
import { useExpedienteContext } from '../Provider/ProviderExpediente';
import { useUsuarioContext } from '../Provider/ProviderUsuario';

const IngresarExpediente = () => {
  const { crearExpediente } = useExpedienteContext();
  const { usuarioLogueado } = useUsuarioContext();

  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    numero_expediente: '',
    nombre_establecimiento: '',
    region_sanitaria: '', // Cambiado a string para manejar el input
    departamento: '',
    unidad_area: '',
    estado: true, // Siempre activo
    id_usuario: '', // Cambiado a string para manejar el input
  });

  // Efecto para autocompletar unidad_area e id_usuario con los datos del usuario logueado
  useEffect(() => {
    if (usuarioLogueado) {
      setFormData((prev) => ({
        ...prev,
        unidad_area: usuarioLogueado.unidad_area,
        id_usuario: usuarioLogueado.id_usuario.toString(), // Convertir a string
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

    // Validar que todos los campos estén llenos
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
      region_sanitaria: parseInt(formData.region_sanitaria, 10), // Convertir a número
      departamento: formData.departamento,
      unidad_area: formData.unidad_area,
      estado: formData.estado, // Siempre activo
      id_usuario: parseInt(formData.id_usuario, 10), // Convertir a número
    };

    console.log('Datos a enviar:', nuevoExpediente); // Verifica los datos antes de enviar

    try {
      // Llamar a la función crearExpediente del contexto
      await crearExpediente(nuevoExpediente);
      alert('Expediente creado con éxito.');

      // Limpiar el formulario después de crear el expediente
      setFormData({
        numero_expediente: '',
        nombre_establecimiento: '',
        region_sanitaria: '', // Restaurar como string
        departamento: '',
        unidad_area: usuarioLogueado?.unidad_area ?? '', // Restaurar unidad_area del usuario logueado
        estado: true, // Siempre activo
        id_usuario: usuarioLogueado?.id_usuario.toString() ?? '', // Restaurar id_usuario como string
      });
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
                disabled // Deshabilitado porque se autocompleta con el usuario logueado
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
                disabled // Deshabilitado porque se autocompleta con el usuario logueado
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Estado:</label>
              <input
                type="text"
                name="estado"
                value="Activo" // Siempre activo
                className="form-control"
                disabled // Deshabilitado porque no se puede cambiar
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

export default IngresarExpediente;