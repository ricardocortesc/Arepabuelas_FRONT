import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card } from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { UserCheck, Package, Plus, CheckCircle } from 'lucide-react';

// REQUISITOS: Validar Usuarios y Crear Productos
const AdminPage = () => {
  const { users, products, approveUser, createProduct } = useApp();
  const [view, setView] = useState('users'); // 'users' o 'products'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '' });

  const pendingUsers = users.filter(u => !u.approved);

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const success = createProduct({
      ...newProduct,
      price: parseFloat(newProduct.price)
    });
    if (success) {
      setIsModalOpen(false);
      setNewProduct({ name: '', description: '', price: '', image: '' });
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Panel de Administrador</h1>
      <div className="flex space-x-2 mb-8 border-b">
        <Button variant={view === 'users' ? 'default' : 'ghost'} onClick={() => setView('users')}>
          <UserCheck className="h-4 w-4 mr-2" />
          Validar Usuarios
        </Button>
        <Button variant={view === 'products' ? 'default' : 'ghost'} onClick={() => setView('products')}>
          <Package className="h-4 w-4 mr-2" />
          Gestionar Productos
        </Button>
      </div>

      {/* Vista de Validación de Usuarios */}
      {view === 'users' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Usuarios Pendientes de Aprobación</h2>
          {pendingUsers.length === 0 ? (
            <p className="text-gray-500">No hay usuarios pendientes de aprobación.</p>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map(user => (
                <Card key={user.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <img src={user.photo} alt={user.name} className="h-10 w-10 rounded-full" />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => approveUser(user.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprobar
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vista de Gestión de Productos */}
      {view === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Productos Actuales</h2>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Nuevo Producto
            </Button>
          </div>
          <div className="space-y-3">
            {products.map(product => (
              <Card key={product.id} className="flex items-center p-4">
                <img src={product.image} alt={product.name} className="h-16 w-16 rounded-lg object-cover" />
                <div className="flex-grow ml-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-500">${product.price}</p>
                </div>
                {/* Aquí irían botones de Editar/Eliminar */}
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Modal para Crear Producto */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nuevo Producto">
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div>
            <Label htmlFor="prodName">Nombre del Producto</Label>
            <Input id="prodName" value={newProduct.name} onChange={(e) => setNewProduct(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="prodDesc">Descripción</Label>
            <Input id="prodDesc" value={newProduct.description} onChange={(e) => setNewProduct(p => ({ ...p, description: e.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="prodPrice">Precio</Label>
            <Input id="prodPrice" type="number" step="0.01" min="0" value={newProduct.price} onChange={(e) => setNewProduct(p => ({ ...p, price: e.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="prodImage">URL de la Imagen</Label>
            <Input id="prodImage" placeholder="https://..." value={newProduct.image} onChange={(e) => setNewProduct(p => ({ ...p, image: e.target.value }))} />
            <p className="text-xs text-gray-500 mt-1">La carga de archivos se simula con un enlace (URL).</p>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Crear Producto</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPage;