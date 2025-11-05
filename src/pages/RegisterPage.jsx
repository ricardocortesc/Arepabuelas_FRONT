import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '../components/ui/Card';

const RegisterPage = () => {
  const { register, setPage } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(''); // REQUISITO: Foto

  const handleSubmit = (e) => {
    e.preventDefault();
    register(name, email, password, photo);
  };

  return (
    <div className="flex justify-center items-center py-12 animate-fade-in">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
          <CardDescription className="text-center">
            Tu cuenta deberá ser aprobada por un administrador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo">URL de tu Foto (Opcional)</Label>
              <Input
                id="photo"
                type="text"
                placeholder="https://tu-foto.com/imagen.png"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Registrarse
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Button variant="link" className="p-0" onClick={() => setPage('login')}>
              Inicia sesión
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;