import { Router } from "express";
//import CartManager from "../CartManager.js";
import CartsManager from "../dao/mongo/manager/carts.js";
import ProductsManager from "../dao/mongo/manager/products.js";
const productsManager = new ProductsManager();
//const cartManager = new CartManager();
const cartsManager = new CartsManager();

const getCartById =async (req, res) => {
    const { id } = req.params;
    const cart = await cartsManager.getCart(id);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  }

const createCart = async (req, res) => {
    const { products } = req.body;
    const cart = { products };
    const newCart = await cartsManager.createCart(cart);
    res.status(201).json(newCart);
  }

const addProductToCart=async (req, res) => {

    try {
        const {cid,pid } = req.params;
        const { quantity } = req.body;
        const cart = await cartsManager.getCart(cid);
        if (!cart) {
          return 'Carrito no encontrado';
        }
        const product = await productsManager.getProduct(pid);
        if (!product) {
          return 'El producto no existe';
        }
        const result=  await cartsManager.addProductToCart(cid,pid,quantity)
        res.json({message: 'Producto agregado al carrito exitosamente'});
    } catch (error) {
        return res.status(400).json({status:"error",message:"Cannot add product: "+ error})
    }
  }
const deleteProductFromCart = async(req,res)=>{
    try {
      const { cid, pid } = req.params;
      const cart = await cartsManager.getCart(cid);
      
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
      const product = await productsManager.getProduct(pid);
      
      if (!product) {
        return res.status(404).json({ error: 'El producto no existe' });
      }
      const productIndex = cart.products.findIndex((p) => p.product.equals(product._id));
      
      if (productIndex === -1) {
        return res.status(404).json({ error: 'El producto no existe en el carrito '  + productIndex});
      }
  
      cart.products.splice(productIndex, 1);
      await cart.save();
      
      res.json({ message: 'Producto eliminado del carrito exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto del carrito ' + error });
    }}

const updateCart=async (req, res) => {
    try {
      const { cid } = req.params;
      const { products } = req.body;
      
      const cart = await cartsManager.getCart(cid);
      
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
      
      cart.products = products;
      await cart.save();
      
      res.json({ message: 'Carrito actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el carrito: '+error });
    }
  }

const updateProductInCart= async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
  
      // Obtener el carrito
      const cart = await cartsManager.getCart(cid);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
      const product = await productsManager.getProduct(pid);
      if (!product) {
        return res.status(404).json({ error: 'El producto no existe' });
      }
      const productIndex = cart.products.findIndex((p) => p.product.equals(product._id));
  
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
      }
  
      // Actualizar la cantidad del producto
      cart.products[productIndex].quantity = quantity;
  
      // Guardar los cambios en el carrito
      await cart.save();
  
      res.json({ message: 'Cantidad de ejemplares del producto actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' + error });
    }
  }

const deleteCart =async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartsManager.getCart(cid);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
      
      // Vaciar el arreglo de productos del carrito
      cart.products = [];
      
      // Guardar los cambios en el carrito
      await cart.save();
      
      return res.json({ message: 'Productos eliminados del carrito exitosamente' });
    } catch (error) {
      return res.status(500).json({ error: 'Error al eliminar los productos del carrito' });
    }
  }
export {
    getCartById,
    createCart,
    addProductToCart,
    deleteProductFromCart,
    updateCart,
    updateProductInCart,
    deleteCart
}