const Router = require('express');
const router = new Router();
const discussionPostController = require('../controllers/discussionPostController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:inventoryId', authMiddleware, discussionPostController.create);
router.get('/:inventoryId', authMiddleware, discussionPostController.getAll);
router.post('/:id/like', authMiddleware, discussionPostController.like);
router.delete('/:id', authMiddleware, discussionPostController.delete);

module.exports = router;