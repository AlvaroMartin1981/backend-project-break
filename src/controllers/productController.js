const Product = require('../models/Product');


//Funcion para obtener la barra de navegación, teniendo en cuenta la ruta.
const getNavBar = (path) => {
    let html = '';
    if(path === '/dashboard' || path === '/dashboard/') {
        html = `
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
                </body>
            </html>
        `
    } else {
        html = `
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
                </body>
            </html>
        `
    }
    return html;
};

//Funcion para pintar por pantalla todos los productos, teniendo en cuenta la ruta.
const getProducts = (path, products) => {
    let html = '<ul class="products-list">';
    for (let product of products) {   
                html += `
                    <li class="product-card">
                        <h3>${product.name}</h3>
                        <img src="/images/${product.image}" alt="${product.name}">
                        <p>${product.description}</p>
                        <p>${product.price}€</p>
                        <a href="${path}${product._id}"><button class="buttons">Ver</button></a>
                    </li>
                `;        
    }
    html += '</ul>';
    return html;
};

//Función para ver el detalle de un producto, teniendo en cuenta la ruta.
const getProduct = (path, product) => {
    let html = '';
    if(path === '/dashboard'  || path === '/dashboard/') {
        html += `
        <div class="cards">
            <div class="product-details">
                <h2>${product.name}</h2>
                <img src="/images/${product.image}" alt="${product.name}">
                <p>${product.description}</p>
                <p>${product.price}€</p>
                <p>Categoria: ${product.category}</p>
                <p>Talla: ${product.size}</p>
                <div>
                    <a href="${path}${product._id}/edit"><button class="buttons">Editar</button></a>
                    <a href="${path}${product._id}/delete"><button class="buttons">Borrar</button></a>
                </div>
            </div>
        </div>    
        `
    } else {
        html += `
        <div class="cards">
            <div class="product-details">
                <h2>${product.name}</h2>
                <img src="/images/${product.image}" alt="${product.name}">
                <p>${product.description}</p>
                <p>${product.price}€</p>
                <p>Categoria: ${product.category}</p>
                <p>Talla: ${product.size}</p>
                <a href="/products/"><button class="buttons">Volver</button></a>
            </div>
        </div>    
        `
    }
    return html;
};


const showProducts = async (req,res) => {
    try {
        const path = req.path;
        const products = await Product.find();
        res.send(getNavBar(path) + getProducts(path, products));
    } catch (error) {
        res.status(500).send({ message: 'There was a problem trying get all products'})
    }
};

const showProductById = async (req,res) => {
    try {
        const path = req.path;
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).send({message: 'Product not found'})
        }
        res.send(getNavBar(path) + getProduct(path, product));
    } catch (error) {
        res.status(500).send({ message: 'Error getting the product.'})
    }
};

const showProductsLogin = async (req,res) => {
    try {
        const path = req.path;
        const products = await Product.find();
        res.send(getNavBar(path) + getProducts(path, products));
    } catch (error) {
        console.log('error' , error);
        return res.status(500).send({ message: 'There was a problem trying get all products'})
    }
};

const showProductByIdLogin = async (req,res) => {
    try {
        const path = req.path.includes('/dashboard') ? '/dashboard/' : '';
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).send({message: 'Product not found'})
        }
        res.send(getNavBar(path) + getProduct(path, product));
    } catch (error) {
        res.status(500).send({message: 'Error getting the product'});
    }
};

const showNewProductForm = async (req,res) => {
    const path = req.path.includes('/dashboard') ? '/dashboard' : '';
    try {
        res.send(`
        ${getNavBar(path)}
            <div class="new-product">
                <h2>Crear producto</h2>
                <div class="form">
                    <form action="/dashboard/" method="post">
                        <div class="form-group">
                            <label for="name">Nombre:*</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="description">Descripción:*</label>
                            <textarea id="description" name="description" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="price">Precio:*</label>
                            <input type="number" id="price" name="price" step=".01" required>
                        </div>
                        <div class="form-group">
                            <label for="image">Imagen:</label>
                            <input type="file" id="image" name="image" accept=".webp, .jpg, .jpeg">
                        </div>
                        <div class="form-group">
                            <label for="category">Categoría:*</label>
                            <select name="category" id="category">
                                <option value="camisetas">Camisetas</option>
                                <option value="pantalones">Pantalones</option>
                                <option value="zapatos">Zapatos</option>
                                <option value="accesorios">Accesorios</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="size">Talla:*</label>
                            <select name="size" id="size">
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                            </select>
                        </div>
                        <button type="submit" class="button-form">Crear</button>
                    </form>
                </div>
            </div>
        `)
    } catch (error) {
        res.status(500).send({ message: "There was a problem trying to create a product" });
    }
    
};

const createProduct = async (req,res) => {
    try {
        const { name, description, price, image, category, size } = req.body;
        if(!name || !description || !price|| !category|| !size ) {
            res.status(400).send( { message: 'All fields marked with * are required'})
        }
        const product = await Product.create({ name, description, price, image, category, size });
        const path = req.path;
        res.send(`
            ${getNavBar(path) + getProduct(path, product)}
            <a href="/dashboard/" class="backProducts" id="backProducts">Volver</a>
            <button><a href="${path}${product._id}/edit">Editar</a></button>
            <button><a href="${path}${product._id}/delete">Borrar</a></button>
        `)
    } catch (error) {
        res.status(500).send({ message: "There was a problem trying to create a product" });
    }
};

const updateProductById = async (req, res) => {
    try {
        const { name, description, price, image, category, size } = req.body;
        const id = req.params.productId;
        if(!id) {
            return res.status(404).send({message: 'Product not found'})
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, {name, description, price, image, category, size }, { new: true });
        const path = req.path;
        res.send(`
            ${getNavBar(path) + getProduct(path, updatedProduct)}
            <a href="/dashboard/" class="backProducts" id="backProducts">Volver</a>
            `)
    } catch (error) {
       res.status(500).send({ message: "There was a problem trying to update the product" });
    }
};

const showEditProductForm = async (req, res) => {
    try {
        const path = req.path.includes('/dashboard') ? '/dashboard/' : '';
        const product = await Product.findById(req.params.productId);
        res.send(`
            ${getNavBar(path)}
            <div class="edit-product">
                <h2>Editar producto</h2>
                <div class="form">
                    <form action="/dashboard/${product._id}?_method=PUT" method="post">
                        <div class="form-group">
                            <label for="name">Nombre:</label>
                            <input type="text" id="name" name="name" value="${product.name}" required>
                        </div>
                        <div class="form-group">
                            <label for="description">Descripción:</label>
                            <textarea id="description" name="description" required>${product.description}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="price">Precio:</label>
                            <input type="number" id="price" name="price" value="${product.price}" required>
                        </div>
                        <div class="form-group">
                            <label for="image">Imagen:</label>
                            <input type="text" id="image" name="image" value="${product.image}">
                        </div>
                        <div class="form-group">
                            <label for="category">Categoría:</label>
                            <select name="category" id="category">
                                <option value="camisetas" ${product.category === 'camisetas' ? 'selected' : ''}>Camisetas</option>
                                <option value="pantalones" ${product.category === 'pantalones' ? 'selected' : ''}>Pantalones</option>
                                <option value="zapatos" ${product.category === 'zapatos' ? 'selected' : ''}>Zapatos</option>
                                <option value="accesorios" ${product.category === 'accesorios' ? 'selected' : ''}>Accesorios</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="size">Talla:</label>
                            <select name="size" id="size">
                                <option value="XS" ${product.size === 'XS' ? 'selected' : ''}>XS</option>
                                <option value="S" ${product.size === 'S' ? 'selected' : ''}>S</option>
                                <option value="M" ${product.size === 'M' ? 'selected' : ''}>M</option>
                                <option value="L" ${product.size === 'L' ? 'selected' : ''}>L</option>
                                <option value="XL" ${product.size === 'XL' ? 'selected' : ''}>XL</option>
                            </select>
                        </div>
                        <button type="submit" class="button-form">Actualizar</button>
                    </form>
                </div>
            </div>
        `);
    } catch (error) {
        res.status(500).send({ message: "There was a problem trying to find the product for editing" });
    }
};

const deleteProductById = async (req,res) => {
    const path = req.path.includes('/dashboard') ? '/dashboard' : '';
    try {
        const product = await Product.findByIdAndDelete(req.params.productId);
        res.send(getNavBar(path) + 'Product deleted');
    } catch (error) {
        res.status(500).send(getNavBar(path) + 'There was a problem trying to delete a product')
    }
};


const showProductsByCategory = async (req, res) => {
    const path = req.path;
    const category = req.query.category;
    try {
        let products;
        if(category){
            products = await Product.find({ category: category });
        }else{
            products = await Product.find();
        }
        res.send(getNavBar(path, category) + getProducts(path, products)); 
    } catch (error) {
        res.status(500).send({ message: "Error when filtering products"});
    }
};

module.exports = {
    getNavBar,
    getProducts,
    showProducts,
    showProductById,
    showProductsLogin,
    showProductByIdLogin,
    showNewProductForm, 
    createProduct,
    updateProductById, 
    showEditProductForm,
    deleteProductById,
    showProductsByCategory
}; 