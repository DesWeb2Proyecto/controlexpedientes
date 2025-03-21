'use client'
import NavBar from "../Components/NavBar";
import ProviderHistorial from "../Provider/ProviderHistorial";
import { ProviderExpediente } from "../Provider/ProviderExpediente";
import { usePathname } from "next/navigation";

export default function LayoutSecundario({ children }: { children: React.ReactNode; }) {
  const pathname = usePathname();
  return (
    <>
      <ProviderHistorial>
        <ProviderExpediente>
          <NavBar />
          {/* Forzamos el remount de los hijos con una key basada en la ruta */}
          <div key={pathname}>
            {children}
          </div>
        </ProviderExpediente>
      </ProviderHistorial>
    </>
  );
}
