const Router = require('express');
const router = new Router();
const inventoryFieldController = require('../controllers/inventoryFieldController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:inventoryId', authMiddleware, inventoryFieldController.create);
router.get('/:inventoryId', authMiddleware, inventoryFieldController.getAll);

router.put('/:id', authMiddleware, inventoryFieldController.update);
router.delete('/:id', authMiddleware, inventoryFieldController.delete);

module.exports = router;