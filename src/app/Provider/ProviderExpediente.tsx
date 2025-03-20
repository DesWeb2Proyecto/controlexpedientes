'use client'
import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { Expediente } from '../Models/Expediente'
import { expedienteContext } from '../Context/ExpedienteContext'

interface VistaReact {
  children: ReactNode
}

export default function ProviderExpediente({ children }: VistaReact) {
  const [expedientes, setExpedientes] = useState<Expediente[]>([])
  const [id_expediente, setIdExpediente] = useState<number>(0)
  const [numero_expediente, setNumeroExpediente] = useState<string>('')
  const [nombre_establecimiento, setNombreEstablecimiento] = useState<string>('')
  const [region_sanitaria, setRegionSanitaria] = useState<string>('')
  const [departamento, setDepartamento] = useState<string>('')
  const [unidad_area, setUnidadArea] = useState<string>('')
  const [estado, setEstado] = useState<boolean>(true)
  const [fecha_creacion, setFechaCreacion] = useState<string>('')
  const [id_usuario, setIdUsuario] = useState<number>(0)

  useEffect(() => {
    obtenerExpedientes()
  }, [])

  async function obtenerExpedientes() {
    try {
      const res = await fetch('http://localhost:5000/expedientes')
      const data = await res.json()
      setExpedientes(data)
    } catch (error) {
      alert('Ocurrió un error al obtener los expedientes: ' + error)
    }
  }

  async function obtenerExpedientePorNumero(numero: string) {
    try {
      const res = await fetch(`http://localhost:5000/expedientes/${numero}`)
      const data = await res.json()
      return data
    } catch (error) {
      alert('Error al obtener el expediente: ' + error)
    }
  }

  async function obtenerExpedientesPorUnidad(unidad: string) {
    try {
      const res = await fetch(`http://localhost:5000/expedientes/unidad/${unidad}`)
      const data = await res.json()
      setExpedientes(data)
    } catch (error) {
      alert('Error al obtener expedientes por unidad: ' + error)
    }
  }

  async function crearExpediente(expediente: Partial<Expediente>) {
    if (!expediente.numero_expediente || !expediente.nombre_establecimiento || 
        !expediente.region_sanitaria || !expediente.departamento || 
        !expediente.unidad_area || !expediente.id_usuario) {
      alert('Todos los campos obligatorios deben estar presentes.')
      return
    }

    try {
      const res = await fetch('http://localhost:5000/expedientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expediente),
      })
      const data = await res.json()
      setExpedientes([...expedientes, data.expediente])
    } catch (error) {
      alert('Error al crear expediente: ' + error)
    }
  }

  async function editarExpediente(id: number, expediente: Partial<Expediente>) {
    try {
      await fetch(`http://localhost:5000/expedientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expediente),
      })
      setExpedientes(expedientes.map((exp) => (exp.id_expediente === id ? { ...exp, ...expediente } : exp)))
    } catch (error) {
      alert('Error al editar expediente: ' + error)
    }
  }

  async function transferirExpediente(id: number, nueva_unidad: string, id_usuario: number) {
    try {
      await fetch(`http://localhost:5000/expedientes/transferir/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nueva_unidad, id_usuario }),
      })
      setExpedientes(expedientes.map((exp) => (exp.id_expediente === id ? { ...exp, unidad_area: nueva_unidad } : exp)))
    } catch (error) {
      alert('Error al transferir expediente: ' + error)
    }
  }

  return (
    <expedienteContext.Provider
      value={{
        expedientes,
        setExpedientes,
        obtenerExpedientes,
        obtenerExpedientePorNumero,
        obtenerExpedientesPorUnidad,
        crearExpediente,
        editarExpediente,
        transferirExpediente,
        id_expediente,
        setIdExpediente,
        numero_expediente,
        setNumeroExpediente,
        nombre_establecimiento,
        setNombreEstablecimiento,
        region_sanitaria,
        setRegionSanitaria,
        departamento,
        setDepartamento,
        unidad_area,
        setUnidadArea,
        estado,
        setEstado,
        fecha_creacion,
        setFechaCreacion,
        id_usuario,
        setIdUsuario,
      }}
    >
      {children}
    </expedienteContext.Provider>
  )
}

export function useExpedienteContext() {
  return useContext(expedienteContext)
}
