import { createContext } from "react";
import { Expediente } from "../Models/Expediente";

// 🔹 Creamos el contexto con valores iniciales
export const expedienteContext = createContext({
  expedientes: [] as Expediente[],
  setExpedientes: (expedientes: Expediente[]) => {},

  // 🔹 Funciones para obtener datos de expedientes desde el backend
  obtenerExpedientes: () => {}, // Corregido el nombre
  obtenerExpedientePorNumero: (numero_expediente: string) => {},
  obtenerExpedientesPorUnidad: (unidad: string) => {},

  // 🔹 Funciones para manipular expedientes
  crearExpediente: (expediente: Partial<Expediente>) => {},
  editarExpediente: (id: number, expediente: Partial<Expediente>) => {},
  transferirExpediente: (id: number, nueva_unidad: string, id_usuario: number) => {},

  // 🔹 Variables de estado individuales
  id_expediente: 0,
  setIdExpediente: (id_expediente: number) => {},

  numero_expediente: "",
  setNumeroExpediente: (numero_expediente: string) => {},

  nombre_establecimiento: "",
  setNombreEstablecimiento: (nombre_establecimiento: string) => {},

  region_sanitaria: "",
  setRegionSanitaria: (region_sanitaria: string) => {},

  departamento: "",
  setDepartamento: (departamento: string) => {},

  unidad_area: "",
  setUnidadArea: (unidad_area: string) => {},

  estado: true,
  setEstado: (estado: boolean) => {},

  fecha_creacion: "",
  setFechaCreacion: (fecha_creacion: string) => {},

  id_usuario: 0,
  setIdUsuario: (id_usuario: number) => {},
});
