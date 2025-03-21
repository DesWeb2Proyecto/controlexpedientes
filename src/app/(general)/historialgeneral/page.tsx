'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUsuarioContext } from '@/app/Provider/ProviderUsuario';
import HistorialDetalladoComponent from '@/app/Components/HistorialDetalladoComponent';
import GraficaExpedientesComponent from '@/app/Components/GraficaexpedienteComponent';

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

  return (
    <>
        <HistorialDetalladoComponent key={`hist-${refreshKey}`} />
        <GraficaExpedientesComponent key={`gra-${refreshKey}`} />
    </>
  );
}
