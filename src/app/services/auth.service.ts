import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  async login(email: string, password: string): Promise<boolean> {
    console.log('[AuthService] Login intent', { email, password });
    // Simula una llamada a API
    await new Promise((res) => setTimeout(res, 400));
    const ok = !!email && !!password;
    console.log('[AuthService] Login result', ok ? 'SUCCESS' : 'FAIL');
    return ok;
  }

  async logout(): Promise<void> {
    console.log('[AuthService] Logout');
  }
}

