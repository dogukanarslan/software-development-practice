const { Router } = require('express');
const pinController = require('../controllers/pinController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = Router();

router.use(requireAuth);

router.get('/pins/create', pinController.create_get);
router.post('/pins/create', pinController.create_post);

router.get('/pins', pinController.list_get);

router.post('/pins/like', pinController.like_pin);
router.post('/pins/dislike', pinController.dislike_pin);
router.get('/pins/:pinId', pinController.show_get);

module.exports = router;
