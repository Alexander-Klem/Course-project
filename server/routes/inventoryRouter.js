const Router = require('express');
const router = new Router();
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/', authMiddleware, inventoryController.create); 
router.get('/', authMiddleware, inventoryController.getAll); 
router.get('/:id', authMiddleware, inventoryController.getOne); 
router.put('/:id', authMiddleware, inventoryController.update);
router.delete('/:id', authMiddleware, inventoryController.delete);

module.exports = router;