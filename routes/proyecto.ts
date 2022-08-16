import { Router } from 'express';
import { checkAuth } from '../middlewares';

import {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarColaborador,
  agregarColaborador,
  eliminarProyecto,
  buscarColaborador
} from '../controllers/proyecto';

const router = Router();

router.route('/')
  .get(checkAuth, obtenerProyectos)
  .post(checkAuth, nuevoProyecto);

router.route('/:id')
  .get(checkAuth, obtenerProyecto)
  .put(checkAuth, editarProyecto)
  .delete(checkAuth, eliminarProyecto);

router.post('/colaboradores', checkAuth, buscarColaborador);
router.post('/colaboradores/:id', checkAuth, agregarColaborador);
router.post('/eliminar-colaboradores/:id', checkAuth, eliminarColaborador);

export default router;