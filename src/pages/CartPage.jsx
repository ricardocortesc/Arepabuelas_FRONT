import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardContent 
} from '../components/ui/Card';
import { ShoppingCart, ArrowLeft, Trash2, CreditCard } from 'lucide-react';

const CartPage = () => {
  const { cart, setPage, removeFromCart, updateCartQuantity, cartTotal } = useApp();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <ShoppingCart className="h-24 w-24 mx-auto text-gray-300" />
        <h2 className="text-2xl font-bold mt-4 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-6">Parece que no has añadido nada a tu carrito.</p>
        <Button onClick={() => setPage('home')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Ver nuestro menú
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <Card key={item.id} className="flex items-center p-4 shadow-sm">
              <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
              <div className="flex-grow ml-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-500">${item.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))}
                  className="w-16 h-9 text-center"
                />
              </div>
              <span className="text-lg font-semibold w-20 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => removeFromCart(item.id)}>
                <Trash2 className="h-5 w-5" />
              </Button>
            </Card>
          ))}
        </div>
        
        {/* Resumen de Compra */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span className="font-semibold">${cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Envío</span>
                <span className="font-semibold">GRATIS</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${cartTotal}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full" onClick={() => setPage('checkout')}>
                Proceder al Pago
                <CreditCard className="h-5 w-5 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;