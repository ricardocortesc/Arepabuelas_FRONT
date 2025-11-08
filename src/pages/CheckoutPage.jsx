import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardContent } from '../components/ui/Card';
import { Shield } from 'lucide-react';

const CheckoutPage = () => {
  // Sacamos 'purchaseHistory' para saber si es un nuevo usuario
  const { cart, cartTotal, placeOrder, setPage, purchaseHistory } = useApp();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  // REQUISITO: Cupón para nuevos usuarios
  const isNewUser = purchaseHistory.length === 0;
  
  const handleCouponApply = () => {
    // La lógica de validación del cupón ahora está en el backend.
    // Aquí solo simulamos la UI para 'NUEVO10'
    if (isNewUser && coupon.toUpperCase() === 'NUEVO10') {
      setCouponApplied(true);
    } else {
      // Opcional: podrías llamar a un endpoint /api/validate-coupon
      setCouponApplied(false);
    }
  };

  // Mantenemos el total local para la UI, aunque el backend lo recalculará
  const finalTotal = (couponApplied && isNewUser) ? (cartTotal * 0.9).toFixed(2) : cartTotal;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      const matches = v.match(/.{1,4}/g);
      setPaymentInfo(prev => ({ ...prev, [name]: matches ? matches.join(' ') : '' }));
    } else if (name === 'expiry') {
      const v = value.replace(/[^0-9]/gi, '');
      let formattedValue = v;
      if (v.length > 2) {
        formattedValue = v.substring(0, 2) + '/' + v.substring(2, 4);
      }
      setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setPaymentInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentInfo.cardNumber.length !== 19 || paymentInfo.expiry.length !== 5 || paymentInfo.cvv.length < 3) {
      alert("Por favor, introduce datos de tarjeta válidos (simulados).");
      return;
    }
    // La lógica ahora está en AppContext
    await placeOrder(paymentInfo, couponApplied);
  };

  if (cart.length === 0) {
    setPage('home'); // Redirigir si el carrito está vacío
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Formulario de Pago */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Información de Pago</h2>
          <p className="text-sm text-gray-500 mb-4 bg-yellow-100 border border-yellow-300 p-3 rounded-md">
            <Shield className="h-4 w-4 inline mr-1" />
            Estás en un entorno de prueba. Usa números de tarjeta ficticios.
            Ej: 4242 4242 4242 4242, Exp: 12/25, CVV: 123
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
              <Input id="cardName" name="cardName" value={paymentInfo.cardName} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="cardNumber">Número de Tarjeta</Label>
              <Input id="cardNumber" name="cardNumber" value={paymentInfo.cardNumber} onChange={handleInputChange} maxLength="19" placeholder="0000 0000 0000 0000" required />
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <Label htmlFor="expiry">Expiración (MM/YY)</Label>
                <Input id="expiry" name="expiry" value={paymentInfo.expiry} onChange={handleInputChange} maxLength="5" placeholder="12/25" required />
              </div>
              <div className="w-1/2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" name="cvv" value={paymentInfo.cvv} onChange={handleInputChange} maxLength="4" placeholder="123" required />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full">
              Pagar ${finalTotal}
            </Button>
          </form>
        </div>

        {/* Resumen del Pedido */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Resumen del Pedido</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-cover" />
                      <span>{item.name} <span className="text-xs text-gray-500">x{item.quantity}</span></span>
                    </div>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t my-4 pt-4">
                {isNewUser && (
                  <div className="flex space-x-2 mb-4">
                    <Input placeholder="Cupón: NUEVO10" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                    <Button variant="secondary" onClick={handleCouponApply}>Aplicar</Button>
                  </div>
                )}
                {couponApplied && isNewUser && (
                  <p className="text-green-600 font-semibold mb-2">¡Cupón 'NUEVO10' aplicado! (-10%)</p>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cartTotal}</span>
                </div>
                {couponApplied && isNewUser && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span>-${(cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold mt-2">
                  <span>Total</span>
                  <span>${finalTotal}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;