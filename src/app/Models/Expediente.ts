export interface Expediente {
  id_expediente: number;
  numero_expediente: string;
  nombre_establecimiento: string;
  region_sanitaria: number;
  departamento: string;
  unidad_area: string;
  estado: boolean;
  fecha_creacion: string;
  id_usuario: number;
}