const {
    getNavBar,
    getProducts,
    showProducts,
    showProductById,
    showNewProductForm, 
    createProduct,
    updateProductById, 
    deleteProductById,
} = require('../controllers/productController.js');
const Product = require('../models/Product.js');

jest.mock('../models/Product.js', () => ({
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()   
}));

describe('getNavBar', () => {
    it('should return the navigation bar in the dashboard path', () => {
        const path = '/dashboard';
        const expectedHTML = `
            <!DOCTYPE html>
            <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" href="/styles.css">
                    <title>Tienda</title>
                </head>
                <body>
                    <nav class="navbar">
                        <ul>
                            <li><a href="/dashboard/">Productos</a></li>
                            <li><a href="/dashboard/?category=camisetas">Camisetas</a></li>
                            <li><a href="/dashboard/?category=pantalones">Pantalones</a></li>
                            <li><a href="/dashboard/?category=zapatos">Zapatos</a></li>
                            <li><a href="/dashboard/?category=accesorios">Accesorios</a></li>
                            <li><a href="/dashboard/new">Nuevo Producto</a></li>
                            <li><a href="/logout">Logout</a>
                        </ul>
                    </nav>
                    <h2 class="title">Productos</h2>
        `
        expect(getNavBar(path)).toBe(expectedHTML);
    });
    it('should return the navigation bar in the products path', () => {
        const path = '/products';
        const expectedHTML = `
            <!DOCTYPE html>
            <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" href="/styles.css">
                    <title>Tienda</title>
                </head>
                <body>
                    <nav class="navbar">
                        <ul>
                            <li><a href="/products/">Productos</a></li>
                            <li><a href="/products/?category=camisetas">Camisetas</a></li>
                            <li><a href="/products/?category=pantalones">Pantalones</a></li>
                            <li><a href="/products/?category=zapatos">Zapatos</a></li>
                            <li><a href="/products/?category=accesorios">Accesorios</a></li>
                            <li><a href="/login">Login</a>
                        </ul>
                    </nav>
                    <h2 class="title">Productos</h2>
        `
        expect(getNavBar(path)).toBe(expectedHTML);
    })
});

describe('getProducts', () => {
    it('should return HTML with products', () => {
        const path = '/products/'
        const products = [
            { 
                _id: 1, 
                name: 'Product 1', 
                description: 'Description 1', 
                image: '', 
                price: 10, 
                category: 'Category 1', 
                size: 'M' 
            }
        ];
        const expectedHTML = `
<ul class="products-list">
                    <li class="product-card">
                        <h3>Product 1</h3>
                        <img src="/images/" alt="Product 1">
                        <p>Description 1</p>
                        <p>10€</p>
                        <a href="${path}1"><button class="buttons">Ver</button></a>
                    </li>
                </ul>
            </body>
            </html>
            `

        expect(getProducts(path, products)).toBe(expectedHTML);
    })
});

describe('showProducts', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return HTML with products', async () => {
        const mockProducts = [
            { 
                _id: 1, 
                name: "camiseta", 
                description: "camiseta con logo", 
                price: 15, image:"", 
                category: "camisetas", 
                size: "M"
            },
            { 
                _id: 2, 
                name: "pantalones", 
                description: "pantalones rotos", 
                price: 30, 
                image:"", 
                category: "pantalones", 
                size: "L"
            }
        ];
        Product.find.mockResolvedValue(mockProducts);

        const req = { path: '/dashboard'};
        const res = { 
            send: jest.fn()
        };

        await showProducts(req, res);
        // Verificar que Product.find fué llamado
        expect(Product.find).toHaveBeenCalled();

        // Verificar el HTML
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining('<h2 class="title">Productos</h2>'))
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining('camiseta'))
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining('pantalones'))
    });

    it('should throw an error if the product does not exist', async () => {
        const mockError = new Error('Error getting products')
        Product.find.mockRejectedValue(mockError);

        const mockReq = { path: '/dashboard'};
        const mockRes = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis()
        }
        
        await showProducts(mockReq, mockRes);
        
        // Verificar que Product.find fué llamado 
        expect(Product.find).toHaveBeenCalled();
        expect(Product.find).rejects.toThrow('Error getting products')
        // Verificar que el status es 500
        expect(mockRes.status).toHaveBeenCalledWith(500);
        // Verificar que nos devuelve el mensaje de error
        expect(mockRes.send).toHaveBeenCalledWith({ message: 'There was a problem trying get all products'})
    });    
});

describe('showProductById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return HTML with the specified product by ID', async () =>{ 
        const mockProduct = { 
            _id: 1, 
            name: "camiseta", 
            description: "camiseta con logo", 
            price: 15, 
            image:"", 
            category: "camisetas", 
            size: "M"
        };

        Product.findById.mockResolvedValue(mockProduct);

        const req = { 
            path: '/dashboard',
            params: {
                id: 2
            }
        };
        const res = { 
            send: jest.fn()
        };

        await showProductById(req, res);

        // Verificar que Product.find fué llamado
        expect(Product.findById).toHaveBeenCalled();

        // Verificar el HTML
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining('<h2 class="title">Productos</h2>'))
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining('camiseta'));
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining(mockProduct.name));

    });
    it('should throw an error if the product does not exist', async () => {
        Product.findById.mockResolvedValue(null);

        const mockReq = { 
            params: {
                id: 'undefined'
            }
        };
        const mockRes = { 
            send: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await showProductById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.send).toHaveBeenCalledWith({message: 'Product not found'});

    });
    it('should throw an error if there are a problem with server', async ()=> {
        const mockError = new Error('Error getting the product by id')
        Product.findById.mockRejectedValue(mockError);

        const mockReq = { 
            path: '/dashboard',
            params: {
                id: 'undefined'
            }
        };
        const mockRes = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis()
        }
        
        await showProductById(mockReq, mockRes);
        
        // Verificar que Product.find fué llamado 
        expect(Product.findById).toHaveBeenCalled();
        expect(Product.findById).rejects.toThrow('Error getting the product by id')
        // Verificar que el status es 500
        expect(mockRes.status).toHaveBeenCalledWith(500);
        // Verificar que nos devuelve el mensaje de error
        expect(mockRes.send).toHaveBeenCalledWith({ message: 'Error getting the product.'})
    });  
});


describe('showNewProductForm', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return HTML for the new product form', async () => {
        const expectedHTML = `
        <!DOCTYPE html>
        <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="/styles.css">
                <title>Tienda</title>
            </head>
            <body>
                <nav class="navbar">
                    <ul>
                        <li><a href="/dashboard/">Productos</a></li>
                        <li><a href="/dashboard/?category=camisetas">Camisetas</a></li>
                        <li><a href="/dashboard/?category=pantalones">Pantalones</a></li>
                        <li><a href="/dashboard/?category=zapatos">Zapatos</a></li>
                        <li><a href="/dashboard/?category=accesorios">Accesorios</a></li>
                        <li><a href="/dashboard/new">Nuevo Producto</a></li>
                        <li><a href="/logout">Logout</a>
                    </ul>
                </nav>
                <h2 class="title">Productos</h2>
            <div class="new-product">
                <h2>Crear producto</h2>
                <div class="form">
                    <form action="/dashboard/" method="post">
                        <div>
                            <label for="name">Nombre: *</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div>
                            <label for="description">Descripción: *</label>
                            <textarea id="description" name="description" required></textarea>
                        </div>
                        <div>
                            <label for="price">Precio: *</label>
                            <input type="number" id="price" name="price" step=".01" required>
                        </div>
                        <div>
                            <label for="image">Imagen:</label>
                            <input type="file" id="image" name="image" accept=".webp, .jpg, .jpeg">
                        </div>
                        <div>
                            <label for="category">Categoría: *</label>
                            <select name="category" id="category">
                                <option value="camisetas">Camisetas</option>
                                <option value="pantalones">Pantalones</option>
                                <option value="zapatos">Zapatos</option>
                                <option value="accesorios">Accesorios</option>
                            </select>
                        </div>
                        <div>
                            <label for="size">Talla: *</label>
                            <select name="size" id="size">
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                            </select>
                        </div>
                        <button type="submit">Crear</button>
                    </form>
                </div>
            </div>
            </body>
            </html>
        `
        const req = { path: '/dashboard' };
        const res = { send: jest.fn()};

        const result = await showNewProductForm(req, res);

        expect(res.send).toHaveBeenCalledWith(expect.stringContaining('<h2 class="title">Productos</h2>'))
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining(expectedHTML))

    });
    it('should throw an error if the new product form does not exist', async () => {

    })
})

describe('createProduct', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new product', async () => {
        const newMockProduct = {
            name: "nuevo producto", 
            description: "descripción del nuevo producto", 
            price: 20, 
            image:"", 
            category: "camisetas", 
            size: "M"
        };
        const createdProduct = { _id: 5, ...newMockProduct }
        Product.create.mockResolvedValue(createdProduct);

        const req = {
            path: '/dashboard',
            body: newMockProduct
        };
        const res = {
            send: jest.fn()
        };
    
        await createProduct(req,res);
        
        expect(Product.create).toHaveBeenCalledWith(newMockProduct);
        //expect(res.send).toHaveBeenCalledWith(expect.stringContaining('<h2>Crear producto</h2>'));
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining('<p>descripción del nuevo producto</p>'));
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining('<p>20€</p>'));
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining('<p>Categoria: camisetas</p>'));
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining('<p>Talla: M</p>'));
    });
    it('should throw an error if any field is empty', async () => {
        const mockReq = {
            body: {
                name: 'Camiseta',
                price: 20,
                category: 'camisetas',
                size: 'M'
            }
        };
        
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        await createProduct(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith({ message: 'All fields marked with * are required'})

    })

    it('should throw an error if there are a problem with server', async () => {
        const mockError = new Error('Error creating product')
        Product.create.mockRejectedValue(mockError);

        const mockReq = { 
            path: '/dashboard',
            body: {}
        };
        const mockRes = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis()
        }
        
        await createProduct(mockReq, mockRes);
        
        expect(mockRes.status).toHaveBeenCalledWith(500);

        // Verificar que nos devuelve el mensaje de error
        expect(mockRes.send).toHaveBeenCalledWith({ message: 'There was a problem trying to create a product'})
    });  
});


describe('updateProductById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should update an existing product', async () => {
        const updatedMockProduct = {
            id: 5,
            name: "producto actualizado", 
            description: "descripción actualizada", 
            price: 25, 
            image:"", 
            category: "categoría actualizada", 
            size: "L"
        };

        Product.findByIdAndUpdate.mockResolvedValue(updatedMockProduct)

        const mockReq = {
            body: {
                name: "producto actualizado", 
                description: "descripción actualizada", 
                price: 25, 
                image:"", 
                category: "categoría actualizada", 
                size: "L" 
            },
            params: {
                productId: 5
            },
            path: '/dashboard'
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }

        await updateProductById(mockReq, mockRes);
        expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(5, {...mockReq.body}, { new: true});
        expect(mockRes.send).toHaveBeenCalledWith(expect.stringContaining('<a href="/dashboard/" class="backProducts" id="backProducts">Volver</a>'));
    });

    it('should throw an error if id is empty', async () => {
        const mockReq = {
            body: {},
            params: {},
            path: '/dashboard'
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        await updateProductById(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.send).toHaveBeenCalledWith({message: 'Product not found'})
    });

    it('should throw an error if there are a problem with server', async () => {
        const mockError = new Error('Error creating product')
        Product.findByIdAndUpdate.mockRejectedValue(mockError);

        const mockReq = { 
            path: '/dashboard',
            body: {},
            params: {
                productId: 5
            }
        };
        const mockRes = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis()
        }
        
        await updateProductById(mockReq, mockRes);
        
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({ message: "There was a problem trying to update the product" })
    });  
});


describe('deleteProductById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete an existing product', async () => {
        const mockProduct = {
            _id: 1,
            name: 'Producto a eliminar',
            description: 'Producto a eliminar',
            price: 20,
            image: '',
            category: 'camisetas',
            size: 'XS'
        }
        Product.findByIdAndDelete.mockResolvedValue(mockProduct);

        const mockReq = {
            params: {
                productId: 1
            },
            path: '/dashboard'
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }

        await deleteProductById(mockReq, mockRes);        
        expect(Product.findByIdAndDelete).toHaveBeenCalledWith(1);
        expect(mockRes.send).toHaveBeenCalledWith(expect.stringContaining('Product deleted'))
    });

    it('should throw an error during deletion', async () => {
        const mockError = new Error('Error deleting product')
        Product.findByIdAndDelete.mockRejectedValue(mockError);

        const mockReq = {
            params: {
                productId: 1
            },
            path: '/dashboard'
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        await deleteProductById(mockReq,mockRes);
        expect(Product.findByIdAndDelete).toHaveBeenCalledWith(1);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith(expect.stringContaining('There was a problem trying to delete a product' ));
    })
});