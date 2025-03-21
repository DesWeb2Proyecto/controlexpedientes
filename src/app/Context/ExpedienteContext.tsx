'use client'
import { createContext } from 'react';
import { Expediente } from '../Models/Expediente';

interface ExpedienteContextType {
  expedientes: Expediente[];
  setExpedientes: (expedientes: Expediente[]) => void;
  obtenerExpedientes: () => Promise<void>;
  obtenerExpedientePorNumero: (numero_expediente: string) => Promise<void>;
  obtenerExpedientesPorUnidad: (unidad: string) => Promise<void>;
  obtenerExpedientesPorUsuario: (id_usuario: number) => Promise<void>; // <-- Agregado aquí
  crearExpediente: (expediente: Omit<Expediente, "id_expediente" | "fecha_creacion">) => Promise<void>;
  editarExpediente: (id: number, expediente: Partial<Expediente>) => Promise<void>;
  transferirExpediente: (id: number, nueva_unidad: string, id_usuario: number) => Promise<void>;
  expedienteSeleccionado: Expediente | null;
  setExpedienteSeleccionado: (expediente: Expediente | null) => void;
}

export const expedienteContext = createContext<ExpedienteContextType>({
  expedientes: [],
  setExpedientes: () => {},
  obtenerExpedientes: async () => {},
  obtenerExpedientePorNumero: async () => {},
  obtenerExpedientesPorUnidad: async () => {},
  obtenerExpedientesPorUsuario: async () => {}, // <-- Agregado aquí
  crearExpediente: async () => {},
  editarExpediente: async () => {},
  transferirExpediente: async () => {},
  expedienteSeleccionado: null,
  setExpedienteSeleccionado: () => {},
});