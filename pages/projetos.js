import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useProjetos from '../hooks/useProjetos';
import useAuth from '../hooks/useAuth';

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjetos, setFilteredProjetos] = useState([]);
  
  // Formulário de novo projeto
  const [novoProjeto, setNovoProjeto] = useState({
    nome: '',
    tipo: 'residencial',
    areaTerreno: '',
    areaConstruida: ''
  });
  const [arquivos, setArquivos] = useState([]);
  
  const router = useRouter();
  const projetosHook = useProjetos();
  const auth = useAuth();
  
  // Verificar autenticação e carregar projetos
  useEffect(() => {
    const verificarAutenticacao = async () => {
      // Simulação de usuário autenticado para desenvolvimento
      // Em produção, isso seria verificado através do Firebase Auth
      const usuarioAtual = { id: 'user123', nome: 'Usuário Teste' };
      
      if (usuarioAtual) {
        await carregarProjetos(usuarioAtual.id);
      } else {
        router.push('/login');
      }
    };
    
    verificarAutenticacao();
  }, []);
  
  // Carregar projetos do usuário
  const carregarProjetos = async (usuarioId) => {
    try {
      setLoading(true);
      const result = await projetosHook.getProjetos(usuarioId);
      
      if (result.success) {
        setProjetos(result.projetos);
        setFilteredProjetos(result.projetos);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar projetos. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };
  
  // Filtrar projetos
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProjetos(projetos);
    } else {
      const filtered = projetos.filter(projeto => 
        projeto.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjetos(filtered);
    }
  }, [searchTerm, projetos]);
  
  // Alternar formulário
  const toggleForm = () => {
    setShowForm(!showForm);
    setMessage({ type: '', text: '' });
  };
  
  // Atualizar campos do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoProjeto({
      ...novoProjeto,
      [name]: name === 'areaTerreno' || name === 'areaConstruida' ? parseFloat(value) : value
    });
  };
  
  // Lidar com upload de arquivos
  const handleFileChange = (e) => {
    setArquivos(Array.from(e.target.files));
  };
  
  // Enviar novo projeto
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos
    if (!novoProjeto.nome || !novoProjeto.areaTerreno || !novoProjeto.areaConstruida) {
      setMessage({ type: 'error', text: 'Preencha todos os campos obrigatórios.' });
      return;
    }
    
    try {
      setLoading(true);
      
      // Adicionar usuarioId ao projeto
      const projetoCompleto = {
        ...novoProjeto,
        usuarioId: 'user123' // Em produção, seria o ID do usuário autenticado
      };
      
      const result = await projetosHook.adicionarProjeto(projetoCompleto, arquivos);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Projeto adicionado com sucesso!' });
        
        // Limpar formulário
        setNovoProjeto({
          nome: '',
          tipo: 'residencial',
          areaTerreno: '',
          areaConstruida: ''
        });
        setArquivos([]);
        
        // Fechar formulário
        setShowForm(false);
        
        // Atualizar lista de projetos
        setProjetos([...projetos, result.projeto]);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error);
      setMessage({ type: 'error', text: 'Erro ao adicionar projeto. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };
  
  // Remover projeto
  const handleRemoverProjeto = async (projetoId) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        setLoading(true);
        const result = await projetosHook.removerProjeto(projetoId);
        
        if (result.success) {
          setMessage({ type: 'success', text: 'Projeto removido com sucesso!' });
          
          // Atualizar lista de projetos
          setProjetos(projetos.filter(projeto => projeto.id !== projetoId));
        } else {
          setMessage({ type: 'error', text: result.message });
        }
      } catch (error) {
        console.error('Erro ao remover projeto:', error);
        setMessage({ type: 'error', text: 'Erro ao remover projeto. Tente novamente.' });
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Meus Projetos</h1>
            <button
              onClick={toggleForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {showForm ? 'Cancelar' : 'Novo Projeto'}
            </button>
          </div>
          
          {message.text && (
            <div className={`mb-6 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}`}>
              {message.text}
            </div>
          )}
          
          {/* Formulário de novo projeto */}
          {showForm && (
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Novo Projeto</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome do Projeto *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={novoProjeto.nome}
                      onChange={handleInputChange}
                      placeholder="Ex: Residência Unifamiliar - Vila Santa Maria"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tipo de Projeto
                    </label>
                    <select
                      name="tipo"
                      value={novoProjeto.tipo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="residencial">Residencial</option>
                      <option value="comercial">Comercial</option>
                      <option value="misto">Misto</option>
                      <option value="industrial">Industrial</option>
                      <option value="institucional">Institucional</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Área do Terreno (m²) *
                    </label>
                    <input
                      type="number"
                      name="areaTerreno"
                      value={novoProjeto.areaTerreno}
                      onChange={handleInputChange}
                      placeholder="Ex: 250"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                      min="1"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Área Construída (m²) *
                    </label>
                    <input
                      type="number"
                      name="areaConstruida"
                      value={novoProjeto.areaConstruida}
                      onChange={handleInputChange}
                      placeholder="Ex: 150"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                      min="1"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Arquivos do Projeto
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Você pode enviar múltiplos arquivos (PDF, DWG, JPG, PNG)
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="mr-3 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Enviando...' : 'Enviar Projeto'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Barra de pesquisa */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Lista de projetos */}
          {loading && projetos.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Carregando projetos...</p>
            </div>
          ) : filteredProjetos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum projeto encontrado</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Tente outro termo de busca ou ' : 'Comece a '}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  adicione um novo projeto
                </button>
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Conformidade
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {filteredProjetos.map((projeto) => (
                    <tr key={projeto.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{projeto.nome}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{projeto.tipo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {projeto.data instanceof Date 
                            ? projeto.data.toLocaleDateString('pt-BR') 
                            : new Date(projeto.data.seconds * 1000).toLocaleDateString('pt-BR')}
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
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                        >
                          Ver Relatório
                        </a>
                        <button
                          onClick={() => handleRemoverProjeto(projeto.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Excluir
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
  );
}
