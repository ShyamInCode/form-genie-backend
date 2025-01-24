import express from 'express';
import formRoutes from './form/form.route'
const router = express.Router();
const defaultRoutes = [
  {
    path: '/form',
   route: formRoutes,
  },
];



defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});


export default router;
