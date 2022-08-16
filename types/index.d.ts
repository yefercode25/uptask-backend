declare namespace Express {
  type ObjectId = string;

  interface UserRequest {
    _id: any;
    nombre: string;
    email: string;
  }

  export interface Request {
    usuario: UserRequest;
  }
}