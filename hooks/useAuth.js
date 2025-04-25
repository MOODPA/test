// Configuração do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';

// Configuração do Firebase (substitua com suas credenciais reais)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Hook de autenticação
export function useAuth() {
  // Login com email e senha
  const login = async (email, senha) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      
      // Buscar dados adicionais do usuário no Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Verificar se o usuário está aprovado
        if (!userData.aprovado) {
          await signOut(auth);
          return { 
            success: false, 
            message: 'Sua conta ainda não foi aprovada por um administrador.' 
          };
        }
        
        // Atualizar último acesso
        await updateDoc(doc(db, 'users', user.uid), {
          ultimoAcesso: new Date()
        });
        
        return { 
          success: true, 
          user: {
            id: user.uid,
            email: user.email,
            nome: userData.nome,
            perfil: userData.perfil
          }
        };
      } else {
        // Se o documento do usuário não existir no Firestore
        await signOut(auth);
        return { 
          success: false, 
          message: 'Dados de usuário não encontrados.' 
        };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      let message = 'Erro ao fazer login. Tente novamente.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'Email ou senha incorretos.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Muitas tentativas de login. Tente novamente mais tarde.';
      }
      
      return { success: false, message };
    }
  };
  
  // Registro de novo usuário
  const registrar = async (nome, email, senha) => {
    try {
      // Verificar se o email já está em uso
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return { 
          success: false, 
          message: 'Este email já está em uso.' 
        };
      }
      
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      
      // Criar documento do usuário no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        nome,
        email,
        perfil: 'usuario', // Perfil padrão
        dataCriacao: new Date(),
        ultimoAcesso: new Date(),
        aprovado: false // Usuário precisa ser aprovado por um administrador
      });
      
      // Fazer logout após registro (usuário precisa ser aprovado)
      await signOut(auth);
      
      return { 
        success: true, 
        message: 'Registro realizado com sucesso! Sua conta será analisada por um administrador.' 
      };
    } catch (error) {
      console.error('Erro no registro:', error);
      let message = 'Erro ao registrar. Tente novamente.';
      
      if (error.code === 'auth/email-already-in-use') {
        message = 'Este email já está em uso.';
      } else if (error.code === 'auth/weak-password') {
        message = 'A senha é muito fraca. Use pelo menos 6 caracteres.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Email inválido.';
      }
      
      return { success: false, message };
    }
  };
  
  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      return { 
        success: false, 
        message: 'Erro ao fazer logout. Tente novamente.' 
      };
    }
  };
  
  // Obter usuários pendentes (para administradores)
  const getUsuariosPendentes = async () => {
    try {
      const q = query(collection(db, 'users'), where('aprovado', '==', false));
      const querySnapshot = await getDocs(q);
      
      const usuarios = [];
      querySnapshot.forEach((doc) => {
        usuarios.push(doc.data());
      });
      
      return { success: true, usuarios };
    } catch (error) {
      console.error('Erro ao buscar usuários pendentes:', error);
      return { 
        success: false, 
        message: 'Erro ao buscar usuários pendentes.' 
      };
    }
  };
  
  // Aprovar usuário (para administradores)
  const aprovarUsuario = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        aprovado: true
      });
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error);
      return { 
        success: false, 
        message: 'Erro ao aprovar usuário.' 
      };
    }
  };
  
  // Rejeitar usuário (para administradores)
  const rejeitarUsuario = async (userId) => {
    try {
      // Em uma implementação completa, você poderia excluir o usuário do Auth também
      // Aqui estamos apenas marcando como rejeitado no Firestore
      await updateDoc(doc(db, 'users', userId), {
        aprovado: false,
        rejeitado: true
      });
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao rejeitar usuário:', error);
      return { 
        success: false, 
        message: 'Erro ao rejeitar usuário.' 
      };
    }
  };
  
  return {
    login,
    registrar,
    logout,
    getUsuariosPendentes,
    aprovarUsuario,
    rejeitarUsuario
  };
}

export default useAuth;
