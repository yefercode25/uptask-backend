import mongoose from 'mongoose';
import { IProyectoModel } from './Proyecto';
import { IUsuarioModel } from './Usuario';

export interface ITareaModel {
  nombre: string;
  descripcion: string;
  estado: boolean;
  fechaEntrega: Date;
  prioridad: string;
  proyecto: mongoose.Types.ObjectId | IProyectoModel;
  completado: mongoose.Types.ObjectId | IUsuarioModel;
}

const tareaSchema = new mongoose.Schema<ITareaModel>({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  estado: {
    type: Boolean,
    default: false,
  },
  fechaEntrega: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  prioridad: {
    type: String,
    required: true,
    enum: ['Baja', 'Media', 'Alta'],
  },
  proyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proyecto',
    required: true,
  },
  completado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
  }
}, { timestamps: true });

export const Tarea = mongoose.model<ITareaModel>('Tarea', tareaSchema);