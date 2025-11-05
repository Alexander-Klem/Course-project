const Router = require('express');
const router = new Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:inventoryId', authMiddleware, itemController.create);
router.get('/:inventoryId', authMiddleware, itemController.getAll);
router.get('/item/:id', authMiddleware, itemController.getOne);
router.put('/item/:id', authMiddleware, itemController.update);
router.delete('/:inventoryId/:id', authMiddleware, itemController.delete);

module.exports = router;