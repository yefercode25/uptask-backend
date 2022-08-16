import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { conectDB } from './config/db';

import usuarioRoutes from './routes/usuario';
import proyectoRoutes from './routes/proyecto';
import tareasRoutes from './routes/tarea';
import { Server } from 'socket.io';

dotenv.config();

const app: Express = express();
app.use(express.json());

// Configurar CORS
const whitelist = [process.env.FRONTEND_URL];
app.use(cors({
  origin: (origin, callback) => { 
    if(!whitelist.includes(origin)) {
      return callback(new Error('No tienes permiso para hacer peticiones a este servidor'));
    }

    callback(null, true);
  }
}));

conectDB();

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/tareas', tareasRoutes);

const server = app.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on port ${process.env.PORT} 🚀`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL
  }
});

io.on('connection', (socket) => { 
  console.log('Nuevo usuario conectado: ', socket.id);

  socket.on('abrir-proyecto', (id) => {
    socket.join(id);
  });

  socket.on('nueva-tarea', (tarea) => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit('tarea-agregada', tarea);
  });

  socket.on('eliminar-tarea', (tarea) => { 
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit('tarea-eliminada', tarea);
  });

  socket.on('editar-tarea', (tarea) => { 
    const proyecto = tarea.proyecto;
    socket.to(proyecto._id).emit('tarea-editada', tarea);
  });

  socket.on('completar-tarea', (tarea) => { 
    console.log(tarea);
    const proyecto = tarea.proyecto;
    socket.to(proyecto._id).emit('tarea-completada', tarea);
  });
});