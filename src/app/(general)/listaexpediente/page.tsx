'use client'
import ExpedientesUsuarioComponent from '@/app/Components/ExpedientesPorUsuarioComponent'
import React from 'react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUsuarioContext } from '@/app/Provider/ProviderUsuario';

export default function page() {
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
      <ExpedientesUsuarioComponent></ExpedientesUsuarioComponent>
    </>
  )
}