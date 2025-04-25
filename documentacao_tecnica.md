# Documentação do MOOD.PA - Analisador Técnico de Projetos Arquitetônicos

## Visão Geral

O MOOD.PA (Analisador Técnico de Projetos Arquitetônicos) é uma plataforma web desenvolvida para análise técnica de projetos arquitetônicos segundo a legislação municipal de Itaúna. A plataforma permite aos profissionais de arquitetura e urbanismo verificar a conformidade de seus projetos com as normas municipais antes da submissão formal à Prefeitura, reduzindo o tempo de aprovação e minimizando erros.

## Arquitetura do Sistema

O MOOD.PA foi desenvolvido com uma arquitetura flexível que permite duas formas de implantação:

1. **Aplicação Next.js**: Uma aplicação web completa com React e Next.js, oferecendo funcionalidades avançadas e experiência de usuário aprimorada.

2. **Versão HTML Estática**: Uma versão simplificada usando HTML, CSS e JavaScript puro, que pode ser hospedada em qualquer servidor web sem necessidade de Node.js.

### Tecnologias Utilizadas

- **Frontend**: React, Next.js, Tailwind CSS
- **Armazenamento**: LocalStorage (versão atual), preparado para integração com banco de dados
- **Estilização**: Tailwind CSS (via CDN na versão estática)
- **Interatividade**: JavaScript moderno (ES6+)

## Componentes do Sistema

### 1. Interface do Usuário

A interface do usuário é composta por cinco páginas principais:

- **Página Inicial**: Apresentação da plataforma e suas principais funcionalidades
- **Página Sobre**: Informações detalhadas sobre o MOOD.PA e dados de contato
- **Página de Projetos**: Listagem de projetos e formulário para novos projetos
- **Página de Relatório**: Análise detalhada de um projeto específico
- **Página de Login**: Autenticação de usuários

Todas as páginas são responsivas e adaptam-se a diferentes tamanhos de tela, desde dispositivos móveis até desktops.

### 2. Módulos de Análise Técnica

O sistema possui dois módulos principais de análise técnica:

#### Análise de Representação Gráfica

Este módulo verifica se o projeto contém todos os elementos gráficos obrigatórios e complementares segundo as normas municipais:

- **Elementos Obrigatórios**: Planta baixa, cortes, fachadas, implantação
- **Elementos Complementares**: Planta de cobertura, cotas e níveis, escalas, indicação do norte

O módulo está implementado no arquivo `utils/analiseRepresentacaoGrafica.js`.

#### Cálculo de Parâmetros Urbanísticos

Este módulo verifica se o projeto atende aos parâmetros urbanísticos definidos na legislação municipal:

- **Recuo Frontal**: Mínimo de 5,0m
- **Recuo Lateral**: Mínimo de 1,5m
- **Taxa de Ocupação**: Máximo de 70%
- **Taxa de Permeabilidade**: Mínimo de 20%
- **Coeficiente de Aproveitamento**: Máximo de 1,5

O módulo está implementado no arquivo `utils/calculoParametrosUrbanisticos.js`.

### 3. Geração de Relatórios

O sistema gera relatórios detalhados de análise, incluindo:

- Resumo da análise com status e conformidade
- Análise detalhada de parâmetros urbanísticos
- Análise detalhada de representação gráfica
- Observações e recomendações para correções

O módulo de geração de relatórios está implementado no arquivo `utils/reportGenerator.js`.

### 4. Armazenamento de Dados

Na versão atual, o sistema utiliza o LocalStorage do navegador para armazenamento de dados, incluindo:

- Projetos e suas análises
- Informações de usuários
- Preferências (como tema claro/escuro)

O módulo de armazenamento está implementado no arquivo `utils/localStorageDB.js`.

### 5. Autenticação de Usuários

O sistema possui um módulo de autenticação que permite:

- Login de usuários
- Verificação de permissões
- Proteção de rotas

O módulo de autenticação está implementado no arquivo `utils/useAuth.js`.

## Fluxos de Trabalho

### 1. Análise de Novo Projeto

1. Usuário acessa a página de Projetos
2. Clica em "Novo Projeto"
3. Preenche os dados do projeto e faz upload dos arquivos
4. O sistema realiza a análise automática
5. O sistema gera um relatório detalhado
6. Usuário visualiza o relatório e pode exportá-lo em PDF

### 2. Consulta de Projetos Existentes

1. Usuário acessa a página de Projetos
2. Visualiza a lista de projetos cadastrados
3. Pode filtrar projetos por nome
4. Clica em "Ver Relatório" para acessar a análise detalhada

### 3. Autenticação

1. Usuário acessa a página de Login
2. Insere email e senha
3. Sistema verifica as credenciais
4. Se válidas, redireciona para a página de Projetos
5. Se inválidas, exibe mensagem de erro

## Personalização e Extensão

### Modificação de Parâmetros Urbanísticos

Os parâmetros urbanísticos podem ser facilmente modificados no arquivo `utils/calculoParametrosUrbanisticos.js`:

```javascript
// Exemplo de modificação do recuo frontal mínimo
verificarRecuoFrontal: (valor, minimo = 5.0) => {
  return {
    valor,
    minimo,
    conforme: valor >= minimo
  };
}
```

### Adição de Novos Elementos de Representação Gráfica

Novos elementos podem ser adicionados no arquivo `utils/analiseRepresentacaoGrafica.js`:

```javascript
// Exemplo de adição de novo elemento
const elementosComplementares = [
  'cobertura', 
  'cotasNiveis', 
  'escalas', 
  'norte',
  'novoElemento' // Novo elemento adicionado
];
```

## Limitações Atuais e Trabalhos Futuros

### Limitações

- Armazenamento local: os dados são armazenados apenas no navegador do usuário
- Análise manual: ainda não há análise automática de arquivos DWG/PDF
- Sem integração com sistemas externos

### Trabalhos Futuros

1. Integração com banco de dados para armazenamento persistente
2. Upload e análise automática de arquivos DWG/PDF
3. Geração de relatórios em PDF com marca d'água
4. Integração com sistemas da Prefeitura de Itaúna
5. Análise de projetos em 3D

## Conclusão

O MOOD.PA representa uma solução inovadora para a análise técnica de projetos arquitetônicos, automatizando processos que tradicionalmente são realizados manualmente. A plataforma tem o potencial de reduzir significativamente o tempo de aprovação de projetos e minimizar erros, beneficiando tanto os profissionais de arquitetura quanto a administração municipal.

---

© 2025 Caique Tavares Silva. Todos os direitos reservados.
