export type UserRole = 'USER' | 'ADMIN';

export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: UserRole = 'USER'
  ) {}

  isValidEmail(): boolean {
    return /\S+@\S+\.\S+/.test(this.email);
  }
}
