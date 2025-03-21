'use client'
import Link from 'next/link'
import React from 'react'
import { useUsuarioContext } from '../Provider/ProviderUsuario'

export default function NavBar() {
  const { usuarioLogueado, cerrarSesion } = useUsuarioContext();

  return (
    <main>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" href="/">Usuario</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <Link href='/paginaPrincipal' className="nav-link active">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link href='/listaexpediente' className="nav-link active">Lista de expedientes</Link>
            </li>
          </ul>
          
          {/* Mostrar el nombre del usuario logueado y botón de cerrar sesión */}
          {usuarioLogueado ? (
            <div className="d-flex align-items-center">
              <span className="me-3">Bienvenid@, {usuarioLogueado.nombre_completo}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={cerrarSesion}>Cerrar Sesión</button>
            </div>
          ) : null}
        </div>
      </nav>
    </main>
  )
}
