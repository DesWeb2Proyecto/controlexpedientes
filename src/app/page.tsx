'use client';
import { useEffect, useState } from 'react';
import { useUsuarioContext } from './Provider/ProviderUsuario';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logoDGVM from '../../public/logoDGVMN.jpeg';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Page() {
  const router = useRouter();
  const { nombre_usuario, setNombreUsuario, contrasena, setContrasena, logearUsuario, usuarioLogueado } = useUsuarioContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Marca que el componente ya está montado en el cliente
  }, []);

  useEffect(() => {
    if (isClient && usuarioLogueado) {
      router.push('/paginaPrincipal');
    }
  }, [isClient, usuarioLogueado, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre_usuario || !contrasena) {
      alert('Por favor, complete todos los campos.');
      return;
    }
    logearUsuario({ nombre_usuario, contrasena } as any);
  };

  if (!isClient) {
    return null; // Evita el error de hidratación mostrando nada hasta que el cliente cargue
  }

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        {/* Logo encima del formulario */}
        <div className="text-center mb-3">
          <Image src={logoDGVM} alt="Logo DGVM" width={200} height={75} className="mx-auto" />
        </div>
        <h2 className="text-center mb-4">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre_usuario" className="form-label">Nombre de usuario</label>
            <input
              type="text"
              id="nombre_usuario"
              value={nombre_usuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contrasena" className="form-label">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
}
