# Guia de Implantação do MOOD.PA

Este documento fornece instruções detalhadas para a implantação da versão atualizada do MOOD.PA (Analisador Técnico de Projetos Arquitetônicos).

## Visão Geral

O MOOD.PA é uma plataforma web para análise técnica de projetos arquitetônicos segundo a legislação municipal de Itaúna. A plataforma permite aos profissionais de arquitetura e urbanismo verificar a conformidade de seus projetos com as normas municipais antes da submissão formal à Prefeitura.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

```
mood-pa-vercel/
├── components/         # Componentes React reutilizáveis
├── hooks/              # Hooks React personalizados
├── pages/              # Páginas React
├── public/             # Arquivos estáticos e versões HTML
│   ├── index.html      # Página inicial estática
│   ├── sobre.html      # Página Sobre estática
│   ├── projetos.html   # Página de Projetos estática
│   ├── relatorio.html  # Página de Relatório estática
│   ├── login.html      # Página de Login estática
│   └── js/             # Scripts JavaScript
│       └── main.js     # Script principal
├── styles/             # Estilos CSS
├── utils/              # Utilitários JavaScript
│   ├── analiseRepresentacaoGrafica.js
│   ├── calculoParametrosUrbanisticos.js
│   ├── localStorageDB.js
│   ├── reportGenerator.js
│   ├── useAuth.js
│   └── useReportExport.js
├── package.json        # Dependências e scripts
├── next.config.js      # Configuração do Next.js
├── tailwind.config.js  # Configuração do Tailwind CSS
└── postcss.config.js   # Configuração do PostCSS
```

## Opções de Implantação

Existem duas opções principais para implantar o MOOD.PA:

### 1. Implantação no Vercel (Recomendado)

A Vercel é uma plataforma de hospedagem otimizada para aplicações Next.js, oferecendo implantação contínua a partir do GitHub.

#### Passos para implantação no Vercel:

1. Crie uma conta na [Vercel](https://vercel.com) se ainda não tiver uma
2. Conecte sua conta GitHub à Vercel
3. Importe o repositório do MOOD.PA
4. Configure as variáveis de ambiente necessárias (se houver)
5. Clique em "Deploy"

A Vercel automaticamente detectará que é um projeto Next.js e configurará a implantação adequadamente.

### 2. Implantação como Site Estático

Para casos onde uma implantação mais simples é preferida, você pode usar as versões HTML estáticas incluídas no diretório `public/`.

#### Passos para implantação estática:

1. Copie todo o conteúdo do diretório `public/` para o servidor web
2. Configure o servidor web para servir os arquivos estáticos
3. Certifique-se de que o servidor está configurado para redirecionar para `index.html` em caso de rotas não encontradas

Esta opção é adequada para servidores web simples como Apache, Nginx, ou serviços de hospedagem compartilhada.

## Requisitos do Sistema

- Node.js 14.x ou superior (para desenvolvimento e build)
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Conexão com a internet para carregar o Tailwind CSS via CDN (nas versões estáticas)

## Funcionalidades Implementadas

- **Análise de Representação Gráfica**: Verificação automática da conformidade da representação gráfica do projeto com as normas municipais.
- **Cálculo de Parâmetros Urbanísticos**: Análise automática de recuos, afastamentos, taxas de ocupação, permeabilidade e outros parâmetros.
- **Relatórios Detalhados**: Geração de relatórios completos com análise de conformidade e recomendações para correções.
- **Gerenciamento de Projetos**: Interface intuitiva para gerenciar todos os seus projetos e acompanhar o status de cada análise.
- **Autenticação de Usuários**: Sistema seguro com autenticação de usuários para proteger seus projetos e informações.
- **Tema Claro/Escuro**: Suporte a tema claro e escuro para melhor experiência do usuário.
- **Design Responsivo**: Interface adaptável a diferentes tamanhos de tela, desde dispositivos móveis até desktops.

## Personalização

### Tailwind CSS

O projeto utiliza Tailwind CSS para estilização. Para personalizar o tema, edite o arquivo `tailwind.config.js`.

### Conteúdo

Para modificar o conteúdo das páginas:

- Versão React: Edite os arquivos em `pages/`
- Versão Estática: Edite os arquivos HTML em `public/`

### Lógica de Negócio

A lógica de negócio está implementada nos utilitários em `utils/`. Para modificar as regras de análise:

- `analiseRepresentacaoGrafica.js`: Regras para análise de representação gráfica
- `calculoParametrosUrbanisticos.js`: Regras para cálculo de parâmetros urbanísticos

## Suporte e Contato

Para suporte técnico ou dúvidas sobre o MOOD.PA, entre em contato:

- **Email**: arquitetocaiquetavares@gmail.com
- **Endereço**: Rua Silviano Brandão, n° 17 - Cerqueira Lima

## Próximos Passos

Para futuras versões do MOOD.PA, estão planejadas as seguintes melhorias:

1. Integração com banco de dados para armazenamento persistente
2. Upload e análise automática de arquivos DWG/PDF
3. Geração de relatórios em PDF com marca d'água
4. Integração com sistemas da Prefeitura de Itaúna
5. Análise de projetos em 3D

---

© 2025 Caique Tavares Silva. Todos os direitos reservados.
