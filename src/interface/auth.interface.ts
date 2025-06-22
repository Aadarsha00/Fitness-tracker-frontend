export interface ISignUp {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender?: string;
}

export interface ILogin {
  email: string;
  password: string;
}
