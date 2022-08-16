import { Router } from 'express';
import { checkAuth } from '../middlewares';
import { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil } from '../controllers/usuario';

const router = Router();

router.post('/', registrar);
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', olvidePassword);

router.route('/olvide-password/:token')
  .get(comprobarToken)
  .post(nuevoPassword);

router.get('/perfil', checkAuth, perfil);

export default router;