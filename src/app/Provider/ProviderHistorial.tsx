"use client";
import React, { ReactNode, useContext, useEffect, useState, useCallback } from "react";
import { Historial } from "../Models/Historial";
import { Expediente } from "../Models/Expediente";
import { historialContext } from "../Context/HistorialContext";

interface VistaReact {
  children: ReactNode;
}

export default function ProviderHistorial({ children }: VistaReact) {
  const [historial, setHistorial] = useState<Historial[]>([]);
  const [id, setId] = useState<number>(0);
  const [id_expediente, setIdExpediente] = useState<number>(0);
  const [id_usuario, setIdUsuario] = useState<number>(0);
  const [fecha_transferencia, setFechaTransferencia] = useState<string>("");
  const [comentario, setComentario] = useState<string>("");
  const [usuario, setUsuario] = useState<{ id_usuario: number; nombre_completo: string }>({
    id_usuario: 0,
    nombre_completo: "",
  });
  const [expediente, setExpediente] = useState<Expediente | null>(null);

  // 🔹 Función optimizada con useCallback para evitar recreaciones innecesarias
  const obtenerHistorial = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/historial");
      if (!res.ok) throw new Error("No se pudo obtener el historial.");
      const data = await res.json();
      setHistorial(data);
    } catch (error) {
      alert("Error al obtener el historial: " + error);
    }
  }, []);

  const obtenerHistorialExpediente = useCallback(async (numero_expediente: string) => {
    try {
      const res = await fetch(`http://localhost:5000/historial/expediente/${numero_expediente}`);
      if (!res.ok) throw new Error("No se pudo obtener el historial del expediente.");
      const data = await res.json();
      setHistorial(data.historial);
    } catch (error) {
      alert("Error al obtener el historial del expediente: " + error);
    }
  }, []);

  const obtenerHistorialDeUsuario = useCallback(async (id_usuario: number) => {
    try {
      const res = await fetch(`http://localhost:5000/historial/usuario/${id_usuario}`);
      if (!res.ok) throw new Error("No se pudo obtener el historial del usuario.");
      const data = await res.json();
      setHistorial(data);
    } catch (error) {
      alert("Error al obtener el historial del usuario: " + error);
    }
  }, []);

  const obtenerHistorialDetallado = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/historial/detallado");
      if (!res.ok) throw new Error("No se pudo obtener el historial detallado.");
      const data = await res.json();
      setHistorial(data);
    } catch (error) {
      alert("Error al obtener el historial detallado: " + error);
    }
  }, []);

  // 🔹 Ejecuta la función solo al montar el componente
  useEffect(() => {
    obtenerHistorial();
  }, [obtenerHistorial]);

  return (
    <historialContext.Provider
      value={{
        historial,
        setHistorial,
        obtenerHistorial,
        obtenerHistorialExpediente,
        obtenerHistorialDeUsuario,
        obtenerHistorialDetallado,
        id,
        setId,
        id_expediente,
        setIdExpediente,
        id_usuario,
        setIdUsuario,
        fecha_transferencia,
        setFechaTransferencia,
        comentario,
        setComentario,
        usuario,
        setUsuario,
        expediente,
        setExpediente,
      }}
    >
      {children}
    </historialContext.Provider>
  );
}

export function useHistorialContext() {
  return useContext(historialContext);
}
