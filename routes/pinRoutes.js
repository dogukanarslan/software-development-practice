const { Router } = require('express');
const pinController = require('../controllers/pinController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = Router();

router.use(requireAuth);

router.get('/pins/create', pinController.create_get);
router.post('/pins/create', pinController.create_post);

router.put('/pins/edit/:pinId', pinController.edit_put);

router.get('/pins', pinController.list_get);
router.get('/pins/saved', pinController.list_saved_get);

router.get('/pins/save/:pinId', pinController.save_pin);

router.get('/pins/interact/:pinId', pinController.interact_pin);
router.get('/pins/:pinId', pinController.show_get);

module.exports = router;
