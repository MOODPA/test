# Arquitetura de Integração com Banco de Dados - MOOD.PA

## Visão Geral

Este documento descreve a arquitetura de integração do Firebase/Firestore com o MOOD.PA, uma plataforma web para análise técnica de projetos arquitetônicos.

## Escolha de Tecnologia

Para atender aos requisitos de simplicidade de implementação e pequena escala (até 100 usuários), selecionamos o **Firebase/Firestore** como solução de banco de dados:

- **Sem servidor**: Não requer configuração ou manutenção de servidor de banco de dados
- **Autenticação integrada**: Sistema de autenticação pronto para uso
- **Armazenamento de arquivos**: Firebase Storage para arquivos de projetos
- **Tempo real**: Atualizações em tempo real para colaboração
- **Plano gratuito**: Generoso para aplicações de pequena escala
- **Integração com Vercel**: Fácil integração com a plataforma de hospedagem atual

## Estrutura do Banco de Dados

### Coleções do Firestore

1. **users**
   ```
   users/{userId}
   {
     id: string,
     nome: string,
     email: string,
     perfil: "admin" | "usuario",
     dataCriacao: timestamp,
     ultimoAcesso: timestamp
   }
   ```

2. **projetos**
   ```
   projetos/{projetoId}
   {
     id: string,
     nome: string,
     tipo: string,
     areaTerreno: number,
     areaConstruida: number,
     usuarioId: string,
     data: timestamp,
     status: "Em Análise" | "Análise Concluída",
     conformidade: "Total" | "Parcial" | "Pendente",
     arquivosUrls: [string]
   }
   ```

3. **analises**
   ```
   analises/{analiseId}
   {
     id: string,
     projetoId: string,
     data: timestamp,
     parametros: {
       recuoFrontal: {
         valor: number,
         minimo: number,
         conforme: boolean
       },
       recuoLateral: {
         valor: number,
         minimo: number,
         conforme: boolean
       },
       taxaOcupacao: {
         valor: number,
         maximo: number,
         conforme: boolean
       },
       taxaPermeabilidade: {
         valor: number,
         minimo: number,
         conforme: boolean
       },
       coeficienteAproveitamento: {
         valor: number,
         maximo: number,
         conforme: boolean
       }
     },
     representacaoGrafica: {
       plantaBaixa: boolean,
       cortes: boolean,
       fachadas: boolean,
       implantacao: boolean,
       cobertura: boolean,
       cotasNiveis: boolean,
       escalas: boolean,
       norte: boolean
     },
     observacoes: [string],
     conformidade: "Total" | "Parcial"
   }
   ```

4. **configuracoes**
   ```
   configuracoes/{configId}
   {
     id: string,
     parametrosUrbanisticos: {
       recuoFrontalMinimo: number,
       recuoLateralMinimo: number,
       taxaOcupacaoMaxima: number,
       taxaPermeabilidadeMinima: number,
       coeficienteAproveitamentoMaximo: number
     },
     elementosObrigatorios: [string],
     elementosComplementares: [string]
   }
   ```

### Firebase Storage

Estrutura de pastas para armazenamento de arquivos:

```
/projetos/{projetoId}/
  - planta_baixa.pdf
  - cortes.pdf
  - fachadas.pdf
  - implantacao.pdf
  - outros_documentos/
    - documento1.pdf
    - documento2.dwg
```

## Fluxo de Dados

### Autenticação de Usuários

1. Usuário acessa a página de login
2. Insere credenciais (email/senha)
3. Firebase Authentication valida as credenciais
4. Se válidas, retorna token JWT
5. Token é armazenado localmente para sessões futuras
6. Dados do usuário são carregados da coleção `users`

### Gerenciamento de Projetos

#### Criação de Projeto

1. Usuário preenche formulário de novo projeto
2. Faz upload de arquivos para Firebase Storage
3. Documento do projeto é criado na coleção `projetos`
4. Sistema inicia análise automática
5. Resultados da análise são salvos na coleção `analises`
6. Projeto é atualizado com status e conformidade

#### Consulta de Projetos

1. Sistema consulta coleção `projetos` filtrada por `usuarioId`
2. Resultados são exibidos na interface do usuário
3. Ao selecionar um projeto, sistema carrega análise correspondente

### Geração de Relatórios

1. Sistema consulta dados do projeto e análise
2. Gera relatório em memória
3. Converte para PDF
4. Salva cópia no Firebase Storage (opcional)
5. Disponibiliza para download

## Segurança

### Regras do Firestore

```
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários só podem ler/editar seus próprios dados
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projetos só podem ser lidos/editados pelo proprietário
    match /projetos/{projetoId} {
      allow read: if request.auth != null && resource.data.usuarioId == request.auth.uid;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.usuarioId == request.auth.uid;
    }
    
    // Análises seguem as mesmas regras dos projetos
    match /analises/{analiseId} {
      allow read: if request.auth != null && 
                   get(/databases/$(database)/documents/projetos/$(resource.data.projetoId)).data.usuarioId == request.auth.uid;
      allow write: if request.auth != null && 
                    get(/databases/$(database)/documents/projetos/$(resource.data.projetoId)).data.usuarioId == request.auth.uid;
    }
    
    // Configurações só podem ser editadas por administradores
    match /configuracoes/{configId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.perfil == "admin";
    }
  }
}
```

### Regras do Storage

```
service firebase.storage {
  match /b/{bucket}/o {
    match /projetos/{projetoId}/{allPaths=**} {
      allow read: if request.auth != null && 
                   get(/databases/$(database)/documents/projetos/$(projetoId)).data.usuarioId == request.auth.uid;
      allow write: if request.auth != null && 
                    get(/databases/$(database)/documents/projetos/$(projetoId)).data.usuarioId == request.auth.uid;
    }
  }
}
```

## Integração com a Aplicação

### Bibliotecas Necessárias

```
npm install firebase firebase/app firebase/auth firebase/firestore firebase/storage
```

### Configuração Inicial

```javascript
// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
```

### Migração de Dados Locais

Para migrar os dados existentes do LocalStorage para o Firestore:

1. Recuperar todos os dados do LocalStorage
2. Para cada usuário, criar documento na coleção `users`
3. Para cada projeto, criar documento na coleção `projetos`
4. Para cada análise, criar documento na coleção `analises`
5. Atualizar a aplicação para usar o Firestore em vez do LocalStorage

## Considerações de Desempenho

- **Indexação**: Criar índices para consultas frequentes (por usuário, por status)
- **Paginação**: Implementar paginação para listas de projetos com mais de 20 itens
- **Caching**: Utilizar cache local para dados frequentemente acessados
- **Tamanho dos documentos**: Manter documentos pequenos (< 1MB)

## Próximos Passos

1. Criar projeto no Firebase Console
2. Configurar autenticação de usuários
3. Implementar estrutura de banco de dados
4. Migrar dados existentes
5. Atualizar a aplicação para usar o Firestore

## Conclusão

A arquitetura proposta oferece uma solução simples e eficiente para integrar o MOOD.PA com um banco de dados em nuvem. O Firebase/Firestore é ideal para aplicações de pequena escala, oferecendo facilidade de implementação e manutenção mínima.

---

© 2025 Caique Tavares Silva. Todos os direitos reservados.
