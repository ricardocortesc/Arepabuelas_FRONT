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
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const { login, setPage } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password); // La lógica ahora está en AppContext
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center py-12 animate-fade-in">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Accede a tu cuenta para ordenar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Button variant="link" className="p-0" onClick={() => setPage('register')} disabled={isLoading}>
              Regístrate aquí
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;