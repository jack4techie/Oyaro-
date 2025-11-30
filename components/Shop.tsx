
import React, { useState } from 'react';
import { ShoppingBag, Minus, Plus, Trash2, X, CreditCard, ShoppingCart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';

const Shop: React.FC = () => {
  const { products, cart, addToCart, removeFromCart, updateCartQuantity, clearCart } = useAppContext();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate API call
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      clearCart();
      setTimeout(() => setCheckoutComplete(false), 5000);
    }, 2000);
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-serif font-bold text-slate-800">Family Store</h2>
           <p className="text-slate-500">Support the foundation and show your pride.</p>
        </div>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm hover:border-primary/50 transition-colors flex items-center gap-2 group"
        >
          <ShoppingCart className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
          <span className="font-medium text-slate-700">Cart</span>
          {cartItemCount > 0 && (
            <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'clothing', 'keepsake', 'donation'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors
              ${filter === cat 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
            <div className="aspect-square relative overflow-hidden bg-slate-100">
               <img 
                 src={product.image} 
                 alt={product.name} 
                 className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
               />
               <div className="absolute top-3 right-3">
                 <span className="bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-2 py-1 rounded-full shadow-sm uppercase tracking-wide">
                   {product.category}
                 </span>
               </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 mb-1">{product.name}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{product.description}</p>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-slate-900 text-white p-2 rounded-lg hover:bg-primary transition-colors flex items-center gap-2 text-sm font-medium px-4"
                >
                  <ShoppingBag className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Drawer / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-lg text-slate-800">Your Cart ({cartItemCount})</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {checkoutComplete ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-slate-900">Thank You!</h3>
                  <p className="text-slate-500">Your order has been placed successfully.</p>
                  <button 
                    onClick={() => { setIsCartOpen(false); setCheckoutComplete(false); }}
                    className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                  <p>Your cart is empty.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 text-primary font-medium text-sm hover:underline"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-slate-100" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-2">{item.name}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="font-bold text-slate-600 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-2 py-1">
                          <button 
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="p-0.5 hover:text-primary disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="p-0.5 hover:text-primary"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!checkoutComplete && cart.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <>Processing...</>
                  ) : (
                    <>Checkout <CreditCard className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
