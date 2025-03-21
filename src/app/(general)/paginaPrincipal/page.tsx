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

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !usuarioLogueado) {
      router.push('/');
    }
  }, [isClient, usuarioLogueado, router]);

  if (!isClient || !usuarioLogueado) {
    return null; // No renderiza nada hasta que se verifique la autenticación
  }

  return (
    <>
      <IngresarExpedienteComponent />
      <HistorialPorUsuarioComponent />
    </>
  );
}
