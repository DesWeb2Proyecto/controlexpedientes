'use client'
import React from 'react'
import { Usuario } from '../Models/Usuario'
import Link from 'next/link'
import { useUsuarioContext } from '../Provider/ProviderUsuario'


interface UsuarioLista{
    Usuarios: Usuario[]
}

export default function ListaUsuarioComponent({Usuarios}:UsuarioLista) {

  const {actualizarUsuario,eliminarUsuario,usuario,id_usuario,nombre_usuario,nombre_completo,contrasena,unidad_area,administrador,
    setId,setContrasena,setNombreUsuario,setNombreCompleto,setUnidadArea,setAdministrador,logearUsuario} =useUsuarioContext();

  return (
    <div>
        <ul>
        {
          
          Usuarios.map((user:Usuario) => (
            <li key={user.id_usuario}>
              <Link href={`/detalle/${user.id_usuario}`}>
                {user.nombre_usuario} - {user.nombre_completo} - {user.unidad_area} 

              </Link>

              <button type='button' className='btn btn-info btn-sm' onClick={()=>actualizarUsuario(user.id_usuario,user.nombre_usuario,user.contrasena,user.nombre_completo,user.unidad_area,user.administrador)}>Editar</button>
              <button type='button' className='btn btn-danger btn-sm' onClick={()=>eliminarUsuario(user.id_usuario)}>Eliminar</button>
            </li>

          ))
        }
      </ul>
    </div>
  )
}
