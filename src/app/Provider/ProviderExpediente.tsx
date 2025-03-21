'use client';
import React, { useState, useEffect, useContext } from 'react';
import { expedienteContext } from '../Context/ExpedienteContext';
import { Expediente } from '../Models/Expediente';

interface ProviderExpedienteProps {
  children: React.ReactNode;
}

export const ProviderExpediente: React.FC<ProviderExpedienteProps> = ({ children }) => {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState<Expediente | null>(null);

  // Obtener todos los expedientes
  const obtenerExpedientes = async (): Promise<void> => {
    try {
      const res = await fetch('http://localhost:5000/expedientes');
      if (!res.ok) throw new Error('No se pudo obtener los expedientes.');
      const data = await res.json();
      setExpedientes(data);
    } catch (error) {
      console.error('Error al obtener expedientes:', error);
    }
  };

  // Obtener un expediente por su número
  const obtenerExpedientePorNumero = async (numero: string): Promise<void> => {
    try {
      const res = await fetch(`http://localhost:5000/expedientes/${numero}`);
      if (!res.ok) throw new Error('Expediente no encontrado.');
      const data = await res.json();
      setExpedienteSeleccionado(data);
    } catch (error) {
      console.error('Error al obtener expediente:', error);
    }
  };

  // Obtener expedientes por unidad
  const obtenerExpedientesPorUnidad = async (unidad: string): Promise<void> => {
    try {
      const res = await fetch(`http://localhost:5000/expedientes/unidad/${unidad}`);
      if (!res.ok) throw new Error('No se pudieron obtener los expedientes por unidad.');
      const data = await res.json();
      setExpedientes(data);
    } catch (error) {
      console.error('Error al obtener expedientes por unidad:', error);
    }
  };

  // Crear un nuevo expediente
  const crearExpediente = async (expediente: Omit<Expediente, 'id_expediente' | 'fecha_creacion'>): Promise<void> => {
    try {
      const res = await fetch('http://localhost:5000/expedientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expediente),
      });
      if (!res.ok) throw new Error('Error al crear el expediente.');
      const nuevoExpediente = await res.json();
      setExpedientes((prev) => [...prev, nuevoExpediente]);
    } catch (error) {
      console.error('Error al crear expediente:', error);
    }
  };

  const editarExpediente = async (id: number, expediente: Partial<Expediente>): Promise<void> => {
    try {
      if (!id) {
        console.error("Error: ID inválido para editar expediente.");
        return;
      }
  
      console.log("Editando expediente:", id, expediente);
  
      const res = await fetch(`http://localhost:5000/expedientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expediente),
      });
  
      if (!res.ok) {
        const errorMsg = await res.text(); // Obtener mensaje del servidor
        throw new Error(`No se pudo editar el expediente. Servidor: ${errorMsg}`);
      }
  
      const expedienteActualizado = await res.json();
      console.log("Expediente actualizado:", expedienteActualizado);
  
      setExpedientes((prev) =>
        prev.map((exp) => (exp.id_expediente === id ? expedienteActualizado : exp))
      );
    } catch (error) {
      console.error("Error al editar expediente:", error);
    }
  };
  

  // Transferir un expediente a otra unidad
  const transferirExpediente = async (id: number, nueva_unidad: string, id_usuario: number): Promise<void> => {
    try {
      const res = await fetch(`http://localhost:5000/expedientes/transferir/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nueva_unidad, id_usuario }),
      });
      if (!res.ok) throw new Error('No se pudo transferir el expediente.');
      const expedienteTransferido = await res.json();
      setExpedientes((prev) =>
        prev.map((exp) => (exp.id_expediente === id ? expedienteTransferido : exp))
      );
    } catch (error) {
      console.error('Error al transferir expediente:', error);
    }
  };

  // Obtener expedientes por usuario
const obtenerExpedientesPorUsuario = async (id_usuario: number): Promise<void> => {
  try {
    const res = await fetch(`http://localhost:5000/expedientes/usuario/${id_usuario}`);
    if (!res.ok) throw new Error("No se pudieron obtener los expedientes del usuario.");
    const data = await res.json();
    setExpedientes(data);
  } catch (error) {
    console.error("Error al obtener expedientes del usuario:", error);
  }
};

  // Valor del contexto
  const contextValue = {
    expedientes,
    setExpedientes,
    obtenerExpedientes,
    obtenerExpedientePorNumero,
    obtenerExpedientesPorUnidad,
    obtenerExpedientesPorUsuario,
    crearExpediente,
    editarExpediente,
    transferirExpediente,
    expedienteSeleccionado,
    setExpedienteSeleccionado,
  };

  return (
    <expedienteContext.Provider value={contextValue}>
      {children}
    </expedienteContext.Provider>
  );
};

export function useExpedienteContext() {
  return useContext(expedienteContext);
}
