const Router = require('express');
const router = new Router();
const ItemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:inventoryId', authMiddleware, ItemController.create);
router.get('/:inventoryId', authMiddleware, ItemController.getAll);
router.get('/:id', authMiddleware, ItemController.getOne);
router.put('/:id', authMiddleware, ItemController.update);
router.delete('/:id', authMiddleware, ItemController.delete);

module.exports = router;