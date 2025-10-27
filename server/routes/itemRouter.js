const Router = require('express');
const router = new Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:inventoryId', authMiddleware, itemController.create);
router.get('/:inventoryId', authMiddleware, itemController.getAll);
router.get('/:id', authMiddleware, itemController.getOne);
router.put('/:id', authMiddleware, itemController.update);
router.delete('/:id', authMiddleware, itemController.delete);

module.exports = router;