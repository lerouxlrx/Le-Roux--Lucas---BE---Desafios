const express = require('express');
const router = express.Router();

const ProductManager = require('../controllers/product.manager.db.js');
const ProductModel = require('../models/product.model.js');
const productManager = new ProductManager()

router.get("/products", async (req,res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const query = req.query.query || null;
    const sort = req.query.sort || null;
    
    try {     
        const productos = await ProductModel.paginate({query}, {limit,page,sort});
        const status = (productos) ? "success" : "error"
 
        const productosResultados = productos.docs.map(producto => {
          const {_id, ...rest} = producto.toObject();
          return rest;
        })
        const objetoResultado = {
          status: status,
          payload: productosResultados,
          totalPages: productos.totalPages,
          prevPage: productos.prevPage,
          nextPage: productos.nextPage,
          page: productos.page,
          hasPrevPage: productos.hasPrevPage,
          hasNextPage: productos.hasNextPage,
          prevLink: (productos.prevPage) ? "/?page="+productos.prevPage : null,
          nextLink: (productos.nextPage) ? "/?page="+productos.nextPage : null,
        }
 
        res.json(objetoResultado)
    } catch (error) {
        console.log ("No se pudieron traer los productos");
        res.status(500).json({error: "Error al leer productos."});
    }
})

router.get("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const product = await productManager.getProductById(id);
        if(product) {
            res.json(product);
        } else {
            res.json({error: "No se encontro un producto con dicho ID"})
        }
    } catch (error) {
        console.log ("No se pudo traer el producto por ID");
        res.status(500).json({error: "Error al leer producto por ID"});
    }
})

router.post("/products", async (req, res) => {
    const nuevoProducto = req.body;

    try {
        await productManager.addProduct(nuevoProducto)
        res.status(201).json({message: "Producto agregado."})
    } catch (error) {
        console.log ("No se pudo agregar el producto");
        res.status(500).json({error: "Error al agregar producto"+error});
    }
})

router.put("/products/:pid", async (req, res) => {
    let id = req.params.pid;
    const productoActualizado = req.body;

    try {
        await productManager.updateProduct(id, productoActualizado);
        res.json({message: "Se actualizo el producto."});
    } catch (error) {
        console.log ("No se pudo actualizar el producto");
        res.status(500).json({error: "Error al actualizar producto"+error});
    }
})

router.delete("/products/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        await productManager.deleteProduct(id);
        res.json({message: "Se elimino el producto."});
    } catch (error) {
        console.log ("No se pudo eliminar el producto");
        res.status(500).json({error: "Error al eliminar producto"+error});
    }
})

module.exports = router