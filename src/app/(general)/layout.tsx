'use client'
import NavBar from "../Components/NavBar";
import ProviderHistorial from "../Provider/ProviderHistorial";
import { ProviderExpediente } from "../Provider/ProviderExpediente";
import { usePathname } from "next/navigation";
import Image from 'next/image';
import logoDGVM from '../../../public/logoDGVMN.jpeg';

export default function LayoutSecundario({ children }: { children: React.ReactNode; }) {
  const pathname = usePathname();
  return (
    <>
      <ProviderHistorial>
        <ProviderExpediente>
          <NavBar />
          {/* Logo ubicado en la esquina superior izquierda justo debajo del navbar */}
          <div className="container mt-3">
            <div className="d-flex">
              <Image src={logoDGVM} alt="Logo DGVM" width={250} height={75} />
            </div>
          </div>
          <div key={pathname}>
            {children}
          </div>
        </ProviderExpediente>
      </ProviderHistorial>
    </>
  );
}
