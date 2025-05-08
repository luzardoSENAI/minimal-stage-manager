
import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center">
            <h1 className="text-5xl font-bold text-blue-700 mb-4">
              Estágio<span className="text-6xl">S</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600">Gestão Digital de Estágios</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Bem-vindo ao Sistema</h2>
          <p className="text-gray-600 mb-6">
            Por favor, selecione o seu tipo de perfil para continuar:
          </p>

          <div className="space-y-4">
            <Link to="/dashboard" state={{ role: 'student' }} className="block w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition duration-300">
              Aluno
            </Link>
            <Link to="/dashboard" state={{ role: 'school' }} className="block w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition duration-300">
              Escola
            </Link>
            <Link to="/dashboard" state={{ role: 'company' }} className="block w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition duration-300">
              Empresa
            </Link>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EstágioS. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default Index;
