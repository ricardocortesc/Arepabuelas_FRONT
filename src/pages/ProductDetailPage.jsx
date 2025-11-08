import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { apiGetProductById, apiGetProductComments } from '../lib/api'; // Importamos API

const ProductDetailPage = ({ id }) => {
  const { addToCart, addProductComment, setPage, currentUser, showNotification } = useApp();
  
  // Estado local para el producto y sus comentarios
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar el producto y sus comentarios al montar la página
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const productData = await apiGetProductById(id);
        const commentsData = await apiGetProductComments(id);
        
        // Mapeamos 'imageUrl' a 'image'
        setProduct({ ...productData, image: productData.imageUrl });
        // Mapeamos DTO a lo que el frontend espera (asumimos que el DTO tiene 'user' como objeto o 'userName')
        setComments(commentsData.map(c => ({...c, user: c.userName || 'Usuario'}))); // Ajusta 'c.userName'
      } catch (error) {
        showNotification('Error al cargar el producto.', 'error');
        setPage('home'); // Volver a home si falla
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, setPage, showNotification]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      await addProductComment(id, commentText);
      // Recargar comentarios después de añadir uno nuevo
      const commentsData = await apiGetProductComments(id);
      setComments(commentsData.map(c => ({...c, user: c.userName || 'Usuario'})));
      setCommentText('');
    }
  };
  
  if (isLoading) {
      return <div className="text-center py-20">Cargando producto...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
        <Button onClick={() => setPage('home')}>Volver al inicio</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Button variant="outline" size="sm" onClick={() => setPage('home')} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al menú
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <img src={product.image || 'https://placehold.co/600x400/888888/FFFFFF?text=Producto'} alt={product.name} className="w-full h-auto rounded-xl shadow-lg object-cover aspect-square" />
        
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 text-lg mb-6">{product.description}</p>
          <div className="flex items-center justify-between mb-8">
            <span className="text-4xl font-extrabold text-red-600">${product.price}</span>
            <Button size="lg" onClick={() => addToCart(product.id)}>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Añadir al carrito
            </Button>
          </div>
          
          {/* Sección de Comentarios */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-2xl font-semibold mb-4">Comentarios</h3>
            <div className="space-y-4 max-h-48 overflow-y-auto mb-4 pr-2">
              {comments.length === 0 ? (
                <p className="text-gray-500">Aún no hay comentarios. ¡Sé el primero!</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="p-3 bg-gray-50 rounded-lg border">
                    {/* El DTO solo tiene userId, deberías poblar el nombre en el backend */}
                    <p className="font-semibold text-gray-800">{comment.user}</p>
                    <p className="text-gray-600">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
            
            {currentUser ? (
              <form onSubmit={handleCommentSubmit} className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Escribe un comentario..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit">Enviar</Button>
              </form>
            ) : (
              <p className="text-sm text-gray-500">
                <Button variant="link" className="p-0" onClick={() => setPage('login')}>Inicia sesión</Button> para dejar un comentario.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;