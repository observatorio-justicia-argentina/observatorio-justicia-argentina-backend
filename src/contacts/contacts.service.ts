import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Contact, ContactPublic } from './contacts.interface';

@Injectable()
export class ContactsService {
  /** Almacenamiento en memoria. Se pierde al reiniciar el backend (hasta que se conecte una DB). */
  private readonly store: Contact[] = [];

  async create(data: {
    nombre: string;
    email: string;
    dni: string;
    telefono: string;
    rol: string;
    password: string;
  }): Promise<ContactPublic> {
    const existing = this.store.find((c) => c.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new ConflictException('Ya existe un contacto registrado con ese email');
    }

    const existingDni = this.store.find((c) => c.dni === data.dni);
    if (existingDni) {
      throw new ConflictException('Ya existe un contacto registrado con ese DNI');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const contact: Contact = {
      id: `CTK-${Date.now().toString(36).toUpperCase()}`,
      nombre: data.nombre,
      email: data.email.toLowerCase(),
      dni: data.dni,
      telefono: data.telefono,
      rol: data.rol,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    this.store.push(contact);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...pub } = contact;
    return pub;
  }

  async validatePassword(email: string, password: string): Promise<Contact | null> {
    const contact = this.store.find((c) => c.email.toLowerCase() === email.toLowerCase());
    if (!contact) return null;
    const ok = await bcrypt.compare(password, contact.passwordHash);
    return ok ? contact : null;
  }

  findByEmail(email: string): Contact | undefined {
    return this.store.find((c) => c.email.toLowerCase() === email.toLowerCase());
  }

  findById(id: string): ContactPublic | undefined {
    const c = this.store.find((c) => c.id === id);
    if (!c) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...pub } = c;
    return pub;
  }

  findAll(): ContactPublic[] {
    return this.store.map(({ passwordHash: _, ...pub }) => pub);
  }
}
