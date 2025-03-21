'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUsuarioContext } from '@/app/Provider/ProviderUsuario';
import IngresarExpedienteComponent from '@/app/Components/IngresarExpedienteComponent';
import HistorialPorUsuarioComponent from '@/app/Components/HistorialPorUsuarioComponent';


export default function Page() {
  const { usuarioLogueado } = useUsuarioContext();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !usuarioLogueado) {
      router.push('/');
    }
  }, [isClient, usuarioLogueado, router]);

  if (!isClient || !usuarioLogueado) {
    return null; // No renderiza nada hasta verificar la autenticación
  }

  // Callback que se invoca cuando se crea un expediente para forzar remount
  const handleExpedienteCreado = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      {(usuarioLogueado.unidad_area === "UAC" || usuarioLogueado.administrador) && (
        <IngresarExpedienteComponent key={`exp-${refreshKey}`} onExpedienteCreado={handleExpedienteCreado} />
      )}
      <HistorialPorUsuarioComponent key={`hist-${refreshKey}`} />

    </>
  );
}
