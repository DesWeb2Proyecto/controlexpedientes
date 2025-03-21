'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useUsuarioContext } from '../Provider/ProviderUsuario';

export default function NavBar() {
  const { usuarioLogueado, cerrarSesion } = useUsuarioContext();
  const pathname = usePathname(); // Obtiene la ruta actual

  // Función para generar clases dinámicas
  const getNavLinkClass = (href: string) =>
    `nav-link px-3 py-2 rounded ${
      pathname === href ? 'active bg-white text-primary fw-semibold shadow-sm' : 'text-white hover-effect'
    }`;

  // Lista de enlaces para escalabilidad
  const navLinks = [
    { href: '/paginaPrincipal', label: 'Inicio' },
    { href: '/listaexpediente', label: 'Lista de expedientes' },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container-fluid">
        {/* Logo o marca */}
        

        {/* Botón para dispositivos móviles */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú de navegación */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {navLinks.map(({ href, label }) => (
              <li className="nav-item" key={href}>
                <Link className={getNavLinkClass(href)} href={href}>{label}</Link>
              </li>
            ))}
          </ul>

          {/* Usuario logueado y botón de cerrar sesión */}
          {usuarioLogueado && (
            <div className="d-flex align-items-center">
              <span className="text-white me-3 fw-semibold">Bienvenid@, {usuarioLogueado.nombre_completo}</span>
              <button className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
