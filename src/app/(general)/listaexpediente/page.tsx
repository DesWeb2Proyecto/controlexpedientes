'use client'

import { useExpedienteContext } from '@/app/Provider/ProviderExpediente'
import ExpedientesUsuarioComponent from '@/app/Components/ExpedientesPorUsuarioComponent'
import Link from 'next/link'
import React from 'react'

export default function page() {


  const { expedientes } = useExpedienteContext()

  return (
    <>
      <ExpedientesUsuarioComponent></ExpedientesUsuarioComponent>
    </>
  )
}