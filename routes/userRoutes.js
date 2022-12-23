const { Router } = require('express');
const userController = require('../controllers/userController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = Router();

router.use(requireAuth);

router.get('/users', userController.list_get);
router.get('/users/follow/:userId', userController.follow_user);
router.get('/users/:userId', userController.show_get);

module.exports = router;
