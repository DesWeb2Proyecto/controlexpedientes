'use client'
import { useUsuarioContext } from '@/app/Provider/ProviderUsuario'
import { useParams } from 'next/navigation'
import React from 'react'

export default function page() {

  const {id_usuario} = useParams()
  const {usuario}= useUsuarioContext()

  const usuarioDetalle= usuario.find((user)=> user.id_usuario==Number(id_usuario))

  return (
    <div>
        <h4>Detalle de Usuario</h4>
        <p>Id: {usuarioDetalle?.id_usuario}</p>
        <p>Nombre Usuario: {usuarioDetalle?.nombre_usuario}</p>
        <p>Nombre Completo: {usuarioDetalle?.nombre_completo}</p>
    </div>
  )
}
