export interface Contact {
  id: string;
  nombre: string;
  email: string;
  /** DNI argentino — clave de trazabilidad civil */
  dni: string;
  telefono: string;
  /** Rol declarado: periodista, abogado/a, ciudadano/a, etc. */
  rol: string;
  passwordHash: string;
  createdAt: string; // ISO 8601
}

/** Versión pública sin passwordHash */
export type ContactPublic = Omit<Contact, 'passwordHash'>;
