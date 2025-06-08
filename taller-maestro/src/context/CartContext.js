import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } from '../services/cartService';
import { logoutUser } from '../utils/authUtils';

// Crear el contexto
const CartContext = createContext();

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { user, setUser } = useContext(UserContext);

  // Calcular totales
  const calculateTotals = (items) => {
    if (!Array.isArray(items)) {
      setCartCount(0);
      setCartTotal(0);
      return;
    }
    
    const count = items.reduce((total, item) => total + item.quantity, 0);
    const total = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    setCartCount(count);
    setCartTotal(total);
  };

  // Cargar carrito desde API
  const loadCart = async (navigate = null) => {
    if (!user) {
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      return;
    }

    try {
      setLoadingCart(true);
      const result = await getCart(user, setUser, navigate);
      
      if (result.success) {
        // La API devuelve un objeto con la propiedad 'items'
        let cartItems = [];
        
        if (Array.isArray(result.data)) {
          // Si result.data es directamente un array
          cartItems = result.data;
        } else if (result.data && Array.isArray(result.data.items)) {
          // Si result.data tiene una propiedad 'items' que es el array (estructura de tu API)
          cartItems = result.data.items;
        } else if (result.data && Array.isArray(result.data.cart_items)) {
          // Si result.data tiene una propiedad 'cart_items' que es el array
          cartItems = result.data.cart_items;
        } else {
          // Estructura desconocida
          cartItems = [];
        }
        
        setCartItems(cartItems);
        calculateTotals(cartItems);
      } else {
        console.error('Error al cargar carrito:', result.error);
        setCartItems([]);
        setCartCount(0);
        setCartTotal(0);
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      if (error.message === 'Sesión expirada' || error.message === 'Usuario no autenticado') {
        if (navigate) {
          logoutUser(setUser, navigate);
        }
      }
    } finally {
      setLoadingCart(false);
    }
  };

  // Agregar producto al carrito
  const addToCartHandler = async (productId, quantity = 1, navigate = null) => {
    if (!user) {
      return { success: false, error: 'Debes iniciar sesión para agregar productos al carrito' };
    }

    try {
      const result = await addToCart(productId, quantity, user, setUser, navigate);
      
      if (result.success) {
        await loadCart(navigate); // Recargar carrito
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      if (error.message === 'Sesión expirada' || error.message === 'Usuario no autenticado') {
        if (navigate) {
          logoutUser(setUser, navigate);
        }
      }
      return { success: false, error: error.message };
    }
  };

  // Actualizar cantidad de producto
  const updateQuantity = async (itemId, newQuantity, navigate = null) => {
    if (!user) return { success: false, error: 'Usuario no autenticado' };

    try {
      const result = await updateCartItem(itemId, newQuantity, user, setUser, navigate);
      if (result.success) {
        await loadCart(navigate); // Recargar carrito
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      return { success: false, error: error.message };
    }
  };

  // Incrementar cantidad de producto
  const increaseQuantityHandler = async (itemId, navigate = null) => {
    if (!user) return { success: false, error: 'Usuario no autenticado' };

    try {
      const result = await increaseQuantity(itemId, user, setUser, navigate);
      if (result.success) {
        await loadCart(navigate); // Recargar carrito
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error al incrementar cantidad:', error);
      return { success: false, error: error.message };
    }
  };

  // Decrementar cantidad de producto
  const decreaseQuantityHandler = async (itemId, navigate = null) => {
    if (!user) return { success: false, error: 'Usuario no autenticado' };

    try {
      const result = await decreaseQuantity(itemId, user, setUser, navigate);
      if (result.success) {
        await loadCart(navigate); // Recargar carrito
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error al decrementar cantidad:', error);
      return { success: false, error: error.message };
    }
  };

  // Eliminar producto del carrito
  const removeFromCartHandler = async (itemId, navigate = null) => {
    if (!user) return { success: false, error: 'Usuario no autenticado' };

    try {
      const result = await removeFromCart(itemId, user, setUser, navigate);
      if (result.success) {
        await loadCart(navigate); // Recargar carrito
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      return { success: false, error: error.message };
    }
  };

  // Vaciar carrito completo
  const clearCartHandler = async (navigate = null) => {
    if (!user) return { success: false, error: 'Usuario no autenticado' };

    try {
      const result = await clearCart(user, setUser, navigate);
      if (result.success) {
        setCartItems([]);
        setCartCount(0);
        setCartTotal(0);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
      return { success: false, error: error.message };
    }
  };

  // Cargar carrito cuando el usuario cambie
  useEffect(() => {
    loadCart();
  }, [user]);

  // Escuchar eventos de actualización del carrito
  useEffect(() => {
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, [user]);

  const value = {
    // Estado
    cartItems,
    cartCount,
    cartTotal,
    loadingCart,
    isCartOpen,
    
    // Funciones
    setIsCartOpen,
    loadCart,
    addToCart: addToCartHandler,
    updateQuantity,
    increaseQuantity: increaseQuantityHandler,
    decreaseQuantity: decreaseQuantityHandler,
    removeFromCart: removeFromCartHandler,
    clearCart: clearCartHandler
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 