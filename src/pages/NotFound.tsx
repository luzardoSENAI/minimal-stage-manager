
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="text-9xl font-bold text-blue-700 mb-4">404</div>
        <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-xl text-gray-600 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link to="/" className="btn btn-primary inline-block">
          Voltar para o início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
