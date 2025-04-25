import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export default function AdminPage() {
  const [usuariosPendentes, setUsuariosPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const auth = useAuth();
  
  // Carregar usuários pendentes ao montar o componente
  useEffect(() => {
    const carregarUsuariosPendentes = async () => {
      try {
        const result = await auth.getUsuariosPendentes();
        
        if (result.success) {
          setUsuariosPendentes(result.usuarios);
        } else {
          setMessage({ type: 'error', text: result.message });
        }
      } catch (error) {
        console.error('Erro ao carregar usuários pendentes:', error);
        setMessage({ type: 'error', text: 'Erro ao carregar usuários pendentes.' });
      } finally {
        setLoading(false);
      }
    };
    
    carregarUsuariosPendentes();
  }, []);
  
  // Aprovar usuário
  const handleAprovar = async (userId) => {
    try {
      setLoading(true);
      const result = await auth.aprovarUsuario(userId);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Usuário aprovado com sucesso!' });
        // Atualizar lista de usuários pendentes
        setUsuariosPendentes(usuariosPendentes.filter(user => user.id !== userId));
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error);
      setMessage({ type: 'error', text: 'Erro ao aprovar usuário.' });
    } finally {
      setLoading(false);
    }
  };
  
  // Rejeitar usuário
  const handleRejeitar = async (userId) => {
    try {
      setLoading(true);
      const result = await auth.rejeitarUsuario(userId);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Usuário rejeitado com sucesso!' });
        // Atualizar lista de usuários pendentes
        setUsuariosPendentes(usuariosPendentes.filter(user => user.id !== userId));
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Erro ao rejeitar usuário:', error);
      setMessage({ type: 'error', text: 'Erro ao rejeitar usuário.' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Painel de Administração</h1>
          
          {message.text && (
            <div className={`mt-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}`}>
              {message.text}
            </div>
          )}
          
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Solicitações de Registro Pendentes</h2>
            
            {loading ? (
              <div className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</div>
            ) : usuariosPendentes.length === 0 ? (
              <div className="mt-4 text-gray-600 dark:text-gray-400">Não há solicitações pendentes.</div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Nome
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Data de Registro
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600">
                    {usuariosPendentes.map((usuario) => (
                      <tr key={usuario.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {usuario.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {usuario.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {new Date(usuario.dataCriacao.seconds * 1000).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleAprovar(usuario.id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-4"
                            disabled={loading}
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => handleRejeitar(usuario.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            disabled={loading}
                          >
                            Rejeitar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
