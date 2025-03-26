
import React from 'react';
import LoginForm from '../components/LoginForm';
import Logo from '../components/Logo';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md mx-auto text-center mb-8">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Gestão Digital de Estágios
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Plataforma para controle de frequência e avaliação de estagiários
        </p>
      </div>
      
      <LoginForm />
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Gestão Digital de Estágios. Todos os direitos reservados.
      </p>
    </div>
  );
};

export default Login;
