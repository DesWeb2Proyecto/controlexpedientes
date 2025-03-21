import NavBar from "../Components/NavBar";
import ProviderHistorial from "../Provider/ProviderHistorial";
import { ProviderExpediente } from "../Provider/ProviderExpediente";



export default function  LayoutSecundario({
 children
}: {
 children: React.ReactNode;
}) {
  return (
    <>
    
   
      <ProviderHistorial>
      <ProviderExpediente>
      <NavBar></NavBar>
      {children}
      </ProviderExpediente>
      </ProviderHistorial>
 
 
   
      
    </>
  );
}