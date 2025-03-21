import { createContext } from "react"; // Importamos createContext para manejar el contexto global
import { Historial } from "../Models/Historial"; // Importamos la interfaz Historial, que define la estructura de los datos
import { Expediente } from "../Models/Expediente"; // Asegúrate de importar el modelo de Expediente


// 🔹 Creamos el contexto con valores iniciales
export const historialContext = createContext({
  historial: [] as Historial[], // Estado inicial del historial como un array vacío de tipo Historial
  setHistorial: (historial: Historial[]) => {}, // Función para actualizar el historial en el estado global

  // 🔹 Funciones para obtener datos del historial desde el backend
  obtenerHistorial: () => {}, // Obtiene todos los registros de historial
  obtenerHistorialExpediente: (numero_expediente: string) => {}, // Obtiene historial de un expediente específico
  obtenerHistorialDeUsuario: (id_usuario: number) => {}, // Obtiene historial de expedientes de un usuario
  obtenerHistorialDetallado: () => {}, // Obtiene historial detallado con información de usuarios y expedientes

  // 🔹 Variables y funciones para manejar los datos de un historial específico
  id: 0, // ID del historial
  setId: (id: number) => {}, // Función para actualizar el ID

  id_expediente: 0, // ID del expediente asociado
  setIdExpediente: (id_expediente: number) => {}, // Función para actualizar el ID del expediente

  id_usuario: 0, // ID del usuario que realizó la acción
  setIdUsuario: (id_usuario: number) => {}, // Función para actualizar el ID del usuario

  fecha_transferencia: "", // Fecha en la que ocurrió la transferencia del expediente
  setFechaTransferencia: (fecha_transferencia: string) => {}, // Función para actualizar la fecha de transferencia

  comentario: "", // Comentario opcional sobre la transferencia
  setComentario: (comentario: string) => {}, // Función para actualizar el comentario

  // 🔹 Datos adicionales sobre el usuario que hizo la acción
  usuario: { id_usuario: 0, nombre_completo: "" }, // Datos básicos del usuario que hizo la acción
  setUsuario: (usuario: { id_usuario: number; nombre_completo: string }) => {}, // Función para actualizar los datos del usuario

  // 🔹 Datos del expediente asociado al historial
  expediente: null as Expediente | null, // ✅ Permitimos `null` explícitamente
  setExpediente: (expediente: Expediente | null) => {}, // Función para actualizar los datos del expediente
});
