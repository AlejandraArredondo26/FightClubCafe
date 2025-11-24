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


export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  personaje_id: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  personaje_id: string;
}

export interface ForoComentario {
  id: string;
  usuario_id: string;
  nombre: string;
  comentario: string;
  createdAt: number;

  ui: {
    showReplyForm: boolean;
  };
}



export interface ForoRespuesta {
  id: string;
  thread_id: string;
  usuario_id: string;
  nombre: string;
  texto: string;
  createdAt: number;
}



