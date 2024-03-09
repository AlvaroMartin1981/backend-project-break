const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');
const methodOverride = require('method-override');
const checkSession = require('../middlewares/authMiddlewares.js')

router.use(methodOverride('_method'));
//Redireccion a /products
router.get('/', (req,res) => {
    res.redirect('/products/');
});

router.get('/products/', productController.showProducts);
router.get('/products/:productId', productController.showProductById);
router.get('/dashboard/', checkSession, productController.showProducts);
router.get('/dashboard/new', checkSession, productController.showNewProductForm);
router.get('/dashboard/:productId', checkSession, productController.showProductById);
router.post('/dashboard/', checkSession, productController.createProduct);
router.put('/dashboard/:productId', checkSession, productController.updateProductById);
router.get('/dashboard/:productId/edit', checkSession, productController.showEditProductForm);
router.get('/dashboard/:productId/delete', checkSession, productController.deleteProductById);

module.exports = router;