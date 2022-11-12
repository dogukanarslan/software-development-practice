const { Router } = require('express');
const pinController = require('../controllers/pinController');
const requireAuth = require('../middlewares/authMiddleware');

const router = Router();

router.get('/pins', pinController.list_get);

router.get('/pins/create', pinController.create_get);
router.post('/pins/create', pinController.create_post);

module.exports = router;
