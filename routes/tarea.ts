import { Router } from 'express';
import { checkAuth } from '../middlewares';

import {
  agregarTarea,
  obtenerTarea,
  editarTarea,
  eliminarTarea,
  cambiarEstado
} from '../controllers/tarea';

const router = Router();

router.post('/', checkAuth, agregarTarea);

router.route('/:id')
  .get(checkAuth, obtenerTarea)
  .put(checkAuth, editarTarea)
  .delete(checkAuth, eliminarTarea);

router.post('/estado/:id', checkAuth, cambiarEstado);

export default router;