import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';
import useProjetos from '../hooks/useProjetos';
import useReportExport from '../hooks/useReportExport';

export default function DashboardPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [usuariosPendentes, setUsuariosPendentes] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    totalUsuarios: 0,
    totalProjetos: 0,
    projetosConformes: 0,
    projetosParciais: 0,
    projetosPendentes: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);
  
  const auth = useAuth();
  const projetosHook = useProjetos();
  const reportExport = useReportExport();
  const db = getFirestore();
  
  // Carregar dados ao montar o componente
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Carregar usuários
        await carregarUsuarios();
        
        // Carregar projetos
        await carregarProjetos();
        
        // Carregar usuários pendentes
        await carregarUsuariosPendentes();
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setMessage({ type: 'error', text: 'Erro ao carregar dados. Tente novamente.' });
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, []);
  
  // Carregar usuários
  const carregarUsuarios = async () => {
    try {
      const q = query(collection(db, 'users'), where('aprovado', '==', true));
      const querySnapshot = await getDocs(q);
      
      const usuariosData = [];
      querySnapshot.forEach((doc) => {
        usuariosData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setUsuarios(usuariosData);
      setEstatisticas(prev => ({ ...prev, totalUsuarios: usuariosData.length }));
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      throw error;
    }
  };
  
  // Carregar projetos
  const carregarProjetos = async () => {
    try {
      // Em uma implementação real, isso seria filtrado por usuário
      // Aqui estamos carregando todos os projetos para o administrador
      const q = query(collection(db, 'projetos'));
      const querySnapshot = await getDocs(q);
      
      const projetosData = [];
      querySnapshot.forEach((doc) => {
        projetosData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setProjetos(projetosData);
      
      // Calcular estatísticas
      const projetosConformes = projetosData.filter(p => p.conformidade === 'Total').length;
      const projetosParciais = projetosData.filter(p => p.conformidade === 'Parcial').length;
      const projetosPendentes = projetosData.filter(p => p.conformidade === 'Pendente').length;
      
      setEstatisticas(prev => ({
        ...prev,
        totalProjetos: projetosData.length,
        projetosConformes,
        projetosParciais,
        projetosPendentes
      }));
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      throw error;
    }
  };
  
  // Carregar usuários pendentes
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
      throw error;
    }
  };
  
  // Aprovar usuário
  const handleAprovarUsuario = async (userId) => {
    try {
      setLoading(true);
      const result = await auth.aprovarUsuario(userId);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Usuário aprovado com sucesso!' });
        
        // Atualizar lista de usuários pendentes
        setUsuariosPendentes(usuariosPendentes.filter(user => user.id !== userId));
        
        // Recarregar usuários
        await carregarUsuarios();
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
  const handleRejeitarUsuario = async (userId) => {
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
  
  // Gerar relatório estatístico
  const handleGerarRelatorioEstatistico = async () => {
    try {
      setGerandoRelatorio(true);
      setMessage({ type: '', text: '' });
      
      const result = await reportExport.gerarRelatorioEstatistico(projetos);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Relatório estatístico gerado com sucesso!' });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Erro ao gerar relatório estatístico:', error);
      setMessage({ type: 'error', text: 'Erro ao gerar relatório estatístico. Tente novamente.' });
    } finally {
      setGerandoRelatorio(false);
    }
  };
  
  // Gerar relatório comparativo
  const handleGerarRelatorioComparativo = async () => {
    try {
      setGerandoRelatorio(true);
      setMessage({ type: '', text: '' });
      
      const result = await reportExport.gerarRelatorioComparativo(projetos);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Relatório comparativo gerado com sucesso!' });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Erro ao gerar relatório comparativo:', error);
      setMessage({ type: 'error', text: 'Erro ao gerar relatório comparativo. Tente novamente.' });
    } finally {
      setGerandoRelatorio(false);
    }
  };
  
  // Formatar data
  const formatarData = (data) => {
    if (!data) return '';
    
    if (data instanceof Date) {
      return data.toLocaleDateString('pt-BR');
    }
    
    if (data.seconds) {
      return new Date(data.seconds * 1000).toLocaleDateString('pt-BR');
    }
    
    return data;
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Painel de Administração</h1>
          
          {message.text && (
            <div className={`mb-6 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}`}>
              {message.text}
            </div>
          )}
          
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('usuarios')}
                className={`${
                  activeTab === 'usuarios'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Usuários
              </button>
              <button
                onClick={() => setActiveTab('projetos')}
                className={`${
                  activeTab === 'projetos'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Projetos
              </button>
              <button
                onClick={() => setActiveTab('relatorios')}
                className={`${
                  activeTab === 'relatorios'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Relatórios
              </button>
              <button
                onClick={() => setActiveTab('aprovacoes')}
                className={`${
                  activeTab === 'aprovacoes'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm relative`}
              >
                Aprovações
                {usuariosPendentes.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {usuariosPendentes.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                      <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Usuários</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{estatisticas.totalUsuarios}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                      <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Projetos Conformes</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{estatisticas.projetosConformes}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Projetos Parciais</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{estatisticas.projetosParciais}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                      <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Aprovações Pendentes</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{usuariosPendentes.length}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Projetos Recentes</h2>
                  
                  {loading ? (
                    <div className="text-center py-4">
                      <svg className="mx-auto h-8 w-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : projetos.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">Nenhum projeto encontrado.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                              Nome
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                              Data
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                          {projetos.slice(0, 5).map((projeto) => (
                            <tr key={projeto.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{projeto.nome}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatarData(projeto.data)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  projeto.status === 'Análise Concluída' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                  {projeto.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Usuários Recentes</h2>
                  
                  {loading ? (
                    <div className="text-center py-4">
                      <svg className="mx-auto h-8 w-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : usuarios.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">Nenhum usuário encontrado.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                              Nome
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                              Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                              Perfil
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                          {usuarios.slice(0, 5).map((usuario) => (
                            <tr key={usuario.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{usuario.nome}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 dark:text-gray-400">{usuario.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  usuario.perfil === 'admin' 
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                }`}>
                                  {usuario.perfil}
                                </span>
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
          )}
          
          {/* Usuários Tab */}
          {activeTab === 'usuarios' && (
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Usuários</h2>
              
              {loading ? (
                <div className="text-center py-4">
                  <svg className="mx-auto h-8 w-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : usuarios.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Nenhum usuário encontrado.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Nome
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Perfil
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Data de Registro
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Último Acesso
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {usuarios.map((usuario) => (
                        <tr key={usuario.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{usuario.nome}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">{usuario.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              usuario.perfil === 'admin' 
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                              {usuario.perfil}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {formatarData(usuario.dataCriacao)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {formatarData(usuario.ultimoAcesso)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {/* Projetos Tab */}
          {activeTab === 'projetos' && (
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Projetos</h2>
              
              {loading ? (
                <div className="text-center py-4">
                  <svg className="mx-auto h-8 w-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : projetos.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Nenhum projeto encontrado.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Nome
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Tipo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Data
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Conformidade
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {projetos.map((projeto) => (
                        <tr key={projeto.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{projeto.nome}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {projeto.tipo.charAt(0).toUpperCase() + projeto.tipo.slice(1)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {formatarData(projeto.data)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              projeto.status === 'Análise Concluída' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {projeto.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              projeto.conformidade === 'Total' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : projeto.conformidade === 'Parcial' 
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {projeto.conformidade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a 
                              href={`/projetos/${projeto.id}`}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Ver Relatório
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {/* Relatórios Tab */}
          {activeTab === 'relatorios' && (
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Relatórios</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-200 rounded-lg p-6 dark:border-gray-700">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Relatório Estatístico</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Gera um relatório com estatísticas gerais de todos os projetos, incluindo médias de áreas, taxas de ocupação e conformidade.
                  </p>
                  <button
                    onClick={handleGerarRelatorioEstatistico}
                    disabled={gerandoRelatorio}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${gerandoRelatorio ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {gerandoRelatorio ? 'Gerando...' : 'Gerar Relatório Estatístico'}
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6 dark:border-gray-700">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Relatório Comparativo</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Gera um relatório comparativo entre todos os projetos, com tabelas e gráficos para análise visual.
                  </p>
                  <button
                    onClick={handleGerarRelatorioComparativo}
                    disabled={gerandoRelatorio}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${gerandoRelatorio ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {gerandoRelatorio ? 'Gerando...' : 'Gerar Relatório Comparativo'}
                  </button>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 dark:border-gray-700">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Relatórios Individuais</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Acesse os relatórios individuais de cada projeto na aba Projetos.
                </p>
                <button
                  onClick={() => setActiveTab('projetos')}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Ver Projetos
                </button>
              </div>
            </div>
          )}
          
          {/* Aprovações Tab */}
          {activeTab === 'aprovacoes' && (
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Solicitações de Registro Pendentes</h2>
              
              {loading ? (
                <div className="text-center py-4">
                  <svg className="mx-auto h-8 w-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : usuariosPendentes.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhuma solicitação pendente</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Não há solicitações de registro pendentes no momento.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
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
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {usuariosPendentes.map((usuario) => (
                        <tr key={usuario.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {usuario.nome}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {usuario.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {formatarData(usuario.dataCriacao)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleAprovarUsuario(usuario.id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-4"
                              disabled={loading}
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleRejeitarUsuario(usuario.id)}
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
          )}
        </div>
      </div>
    </div>
  );
}
