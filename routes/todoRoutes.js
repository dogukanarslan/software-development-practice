const { Router } = require('express');
const todoController = require('../controllers/todoController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = Router();

router.use(requireAuth);

router.get('/todos', todoController.list_get);
router.post('/todos/create', todoController.create_post);
router.get('/todos/delete/:todoId', todoController.delete);
router.get('/todos/:todoId', todoController.show_get);

module.exports = router;
