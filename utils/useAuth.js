// Utilitário para autenticação de usuários
const useAuth = {
  // Chave para armazenamento do usuário
  USER_KEY: 'mood-pa-usuario',
  
  // Usuários de exemplo para demonstração
  USUARIOS_DEMO: [
    {
      id: 1,
      nome: 'Caique Tavares',
      email: 'arquitetocaiquetavares@gmail.com',
      senha: 'admin123', // Em produção, usar hash seguro
      perfil: 'admin'
    },
    {
      id: 2,
      nome: 'Usuário Teste',
      email: 'usuario@teste.com',
      senha: 'teste123', // Em produção, usar hash seguro
      perfil: 'usuario'
    }
  ],
  
  // Inicializa o sistema de autenticação
  init: () => {
    // Verificar se já existe um usuário logado
    const usuarioAtual = useAuth.getUsuarioAtual();
    return !!usuarioAtual;
  },
  
  // Realiza login
  login: (email, senha) => {
    // Em um sistema real, isso seria uma chamada de API
    const usuario = useAuth.USUARIOS_DEMO.find(
      u => u.email === email && u.senha === senha
    );
    
    if (usuario) {
      // Remover a senha antes de armazenar
      const { senha, ...usuarioSemSenha } = usuario;
      localStorage.setItem(useAuth.USER_KEY, JSON.stringify(usuarioSemSenha));
      return usuarioSemSenha;
    }
    
    return null;
  },
  
  // Realiza logout
  logout: () => {
    localStorage.removeItem(useAuth.USER_KEY);
    return true;
  },
  
  // Obtém o usuário atual
  getUsuarioAtual: () => {
    try {
      const usuario = localStorage.getItem(useAuth.USER_KEY);
      return usuario ? JSON.parse(usuario) : null;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  },
  
  // Verifica se o usuário está autenticado
  isAutenticado: () => {
    return !!useAuth.getUsuarioAtual();
  },
  
  // Verifica se o usuário é administrador
  isAdmin: () => {
    const usuario = useAuth.getUsuarioAtual();
    return usuario && usuario.perfil === 'admin';
  },
  
  // Registra um novo usuário (simulação)
  registrar: (nome, email, senha) => {
    // Em um sistema real, isso seria uma chamada de API
    // Verificar se o email já existe
    const emailExiste = useAuth.USUARIOS_DEMO.some(u => u.email === email);
    
    if (emailExiste) {
      return { sucesso: false, mensagem: 'Email já cadastrado' };
    }
    
    // Simular registro bem-sucedido
    return { 
      sucesso: true, 
      mensagem: 'Usuário registrado com sucesso! Em um sistema real, este usuário seria salvo no banco de dados.' 
    };
  }
};

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = useAuth;
}
