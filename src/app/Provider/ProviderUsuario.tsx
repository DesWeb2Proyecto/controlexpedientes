'use client'
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { Usuario } from '../Models/Usuario';
import { usuarioContext } from '../Context/UsuarioContext';
import { useRouter } from 'next/navigation';

interface VistaReact {
  children: ReactNode;
}

export default function ProviderUsuario({ children }: VistaReact) {
  const [usuario, setUsuario] = useState<Usuario[]>([]);
  const [usuarioLogueado, setUsuarioLogueado] = useState<Usuario | null>(null);
  const [id_usuario, setId] = useState<number>(0);
  const [nombre_usuario, setNombreUsuario] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [nombre_completo, setNombreCompleto] = useState<string>('');
  const [unidad_area, setUnidadArea] = useState<string>('');
  const [administrador, setAdministrador] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');
    if (usuarioGuardado) {
      try {
        const datos: Usuario = JSON.parse(usuarioGuardado);

        setUsuarioLogueado(datos);
        setId(datos.id_usuario ?? 0);
        setNombreUsuario(datos.nombre_usuario ?? "");
        setContrasena(datos.contrasena ?? "");
        setNombreCompleto(datos.nombre_completo ?? "");
        setUnidadArea(datos.unidad_area ?? "");
        setAdministrador(datos.administrador ?? false);
      } catch (error) {
        console.error("Error al cargar usuario desde localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (usuarioLogueado) {
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado));
    } else {
      localStorage.removeItem('usuarioLogueado');
    }
  }, [usuarioLogueado]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!usuarioLogueado && window.location.pathname !== '/') {
        router.replace('/');
      } else if (usuarioLogueado && window.location.pathname === '/') {
        router.replace('/listausuario');
      }
    }
  }, [usuarioLogueado]);

  async function cargarUsuarios() {
    try {
      const res = await fetch('http://localhost:5000/users');
      const data = await res.json();
      setUsuario(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }

  async function logearUsuario(usuario: Usuario) {
    try {
      const res = await fetch('http://localhost:5000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      });

      if (!res.ok) {
        alert('Usuario no encontrado o credenciales incorrectas');
        return;
      }

      const data = await res.json();
      setUsuarioLogueado(data);
      setId(data.id_usuario ?? 0);
      setNombreUsuario(data.nombre_usuario ?? "");
      setContrasena(data.contrasena ?? "");
      setNombreCompleto(data.nombre_completo ?? "");
      setUnidadArea(data.unidad_area ?? "");
      setAdministrador(data.administrador ?? false);

      router.push('/listausuario');
    } catch (error) {
      console.error('Error al logear usuario:', error);
    }
  }

  function cerrarSesion() {
    setUsuarioLogueado(null);
    setId(0);
    setNombreUsuario('');
    setContrasena('');
    setNombreCompleto('');
    setUnidadArea('');
    setAdministrador(false);
    localStorage.removeItem('usuarioLogueado');
    router.push('/');
  }

  async function actualizarUsuario(
    id_usuario: number,
    nombre_usuario: string,
    contrasena: string,
    nombre_completo: string,
    unidad_area: string,
    administrador: boolean
  ) {
    try {
      const res = await fetch(`http://localhost:5000/users/${id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_usuario,
          contrasena,
          nombre_completo,
          unidad_area,
          administrador,
        }),
      });

      if (!res.ok) {
        alert('Error al actualizar usuario');
        return;
      }

      cargarUsuarios();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  }

  return (
    <usuarioContext.Provider
      value={{
        usuario,
        setUsuario,
        agregarUsuario: async (usuario: Usuario) => {
          await fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario),
          });
          cargarUsuarios();
        },
        logearUsuario,
        actualizarUsuario,
        eliminarUsuario: async (id_usuario: number) => {
          await fetch(`http://localhost:5000/users/${id_usuario}`, { method: 'DELETE' });
          cargarUsuarios();
        },
        usuarioLogueado,
        setUsuarioLogueado,
        cerrarSesion,
        id_usuario,
        setId,
        nombre_usuario,
        setNombreUsuario,
        contrasena,
        setContrasena,
        nombre_completo,
        setNombreCompleto,
        unidad_area,
        setUnidadArea,
        administrador,
        setAdministrador,
      }}
    >
      {children}
    </usuarioContext.Provider>
  );
}

export function useUsuarioContext() {
  return useContext(usuarioContext);
}
