import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUsuarioModel {
  nombre: string;
  password: string;
  email: string;
  token: string;
  confirmado: boolean;
  comprobarPassword: (password: string) => Promise<boolean>;
}

const usuarioSchema = new mongoose.Schema<IUsuarioModel>({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  token: {
    type: String
  },
  confirmado: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

usuarioSchema.pre('save', async function (next: () => void) {
  if(!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.comprobarPassword = async function (password: string) { 
  return bcrypt.compare(password, this.password);
}

export const Usuario = mongoose.model<IUsuarioModel>('Usuario', usuarioSchema);