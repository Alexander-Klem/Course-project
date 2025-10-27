const Router = require('express');
const router = new Router();
const inventoryAccessController = require('../controllers/inventoryAccessController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, inventoryAccessController.create);
router.get('/:inventoryId', authMiddleware, inventoryAccessController.getAll);
router.delete('/:inventoryId/:userId', authMiddleware, inventoryAccessController.delete);

module.exports = router;