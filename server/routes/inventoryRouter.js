const Router = require('express');
const router = new Router();
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');
// const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/', authMiddleware, inventoryController.create); // только авторизованные пользователи
router.get('/', authMiddleware, inventoryController.getAll); // только авторизованные пользователи
router.get('/:id', authMiddleware, inventoryController.getOne); // только авторизованные пользователи
router.put('/:id', authMiddleware, inventoryController.update); // только создатели и администраторы
router.delete('/:id', authMiddleware, inventoryController.delete); // только администраторы

module.exports = router;