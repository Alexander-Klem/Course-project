const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.auth);


router.get('/admin', authMiddleware, checkRoleMiddleware('ADMIN'), (req, res) => {
    res.json({ message: 'Доступ только для админов' });
});
module.exports = router;