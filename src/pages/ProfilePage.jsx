import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { History } from 'lucide-react';

// REQUISITO: Historial de Compras
const ProfilePage = () => {
  const { currentUser, purchaseHistory } = useApp();

  if (!currentUser) return null; // No debería pasar si está bien protegido

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center space-x-4 mb-8">
        <img src={currentUser.photo} alt={currentUser.name} className="h-24 w-24 rounded-full shadow-lg" />
        <div>
          <h1 className="text-3xl font-bold">{currentUser.name}</h1>
          <p className="text-gray-500">{currentUser.email}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            Historial de Compras
          </CardTitle>
        </CardHeader>
        <CardContent>
          {purchaseHistory.length === 0 ? (
            <p className="text-gray-500">Todavía no has realizado ninguna compra.</p>
          ) : (
            <div className="space-y-4">
              {purchaseHistory.map(order => (
                <div key={order.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Pedido #{order.id}</span>
                    <span className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-gray-600 mb-2">
                    {order.items.map(item => (
                      <li key={item.id}>{item.name} (x{item.quantity})</li>
                    ))}
                  </ul>
                  {order.discount > 0 && (
                    <p className="text-sm text-green-600">Descuento aplicado: -${order.discount}</p>
                  )}
                  <p className="text-right font-bold text-lg">Total: ${order.finalTotal}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;