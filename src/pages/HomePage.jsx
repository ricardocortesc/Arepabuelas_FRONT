import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardContent 
} from '../components/ui/Card';

const HomePage = () => {
  const { products, setPage } = useApp();

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Nuestro Menú</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <Card 
            key={product.id} 
            className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            onClick={() => setPage(`product/${product.id}`)}
          >
            <img src={product.image} alt={product.name} className="h-56 w-full object-cover" />
            <CardHeader>
              <CardTitle className="text-xl">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 h-12 overflow-hidden text-ellipsis">{product.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-2xl font-bold text-red-600">${product.price}</span>
              <Button variant="outline" size="sm">
                Ver detalle
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomePage;