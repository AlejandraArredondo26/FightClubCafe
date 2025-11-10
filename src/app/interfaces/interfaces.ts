// Shared application interfaces
export interface Hero {
  id: number;
  name: string;
  images?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
  };
  biography?: {
    fullName?: string;
    placeOfBirth?: string;
    publisher?: string;
    alignment?: string;
  };
  powerstats?: {
    intelligence?: number;
    strength?: number;
    speed?: number;
    durability?: number;
    power?: number;
    combat?: number;
  };


}

export interface Personaje {
  id: string;         
  nombre: string;
  descripcion: string;
  dano: number;
  velocidad: number;
  imagen: string;
}

