import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>MOOD.PA - Analisador Técnico de Projetos Arquitetônicos</title>
        <meta name="description" content="Plataforma para análise técnica de projetos arquitetônicos segundo a legislação municipal de Itaúna" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header currentPage="home" />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">MOOD.PA</h1>
              <p className="text-xl md:text-2xl mb-8">
                Analisador Técnico de Projetos Arquitetônicos
              </p>
              <p className="text-lg mb-8 opacity-90">
                Simplifique a análise de conformidade dos seus projetos com a legislação municipal de Itaúna
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/projetos"
                  className="px-6 py-3 bg-white text-blue-700 rounded-md font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  Acessar Projetos
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
                <a
                  href="/sobre"
                  className="px-6 py-3 bg-blue-700 text-white rounded-md font-medium hover:bg-blue-600 transition-colors border border-white/30 flex items-center justify-center"
                >
                  Saiba Mais
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Principais Funcionalidades</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600 dark:text-blue-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Análise de Representação Gráfica</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Verificação automática da conformidade da representação gráfica do projeto com as normas municipais.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600 dark:text-blue-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Cálculo de Parâmetros Urbanísticos</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Análise automática de recuos, afastamentos, taxas de ocupação, permeabilidade e outros parâmetros.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600 dark:text-blue-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Relatórios Detalhados</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Geração de relatórios completos com análise de conformidade e recomendações para correções.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600 dark:text-blue-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Gerenciamento de Projetos</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Interface intuitiva para gerenciar todos os seus projetos e acompanhar o status de cada análise.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600 dark:text-blue-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Segurança e Privacidade</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sistema seguro com autenticação de usuários para proteger seus projetos e informações.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600 dark:text-blue-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Entrada Manual de Dados</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Possibilidade de inserir manualmente informações que não foram detectadas automaticamente.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Comece a usar o MOOD.PA hoje mesmo</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Simplifique o processo de análise técnica dos seus projetos arquitetônicos e 
                aumente a conformidade com a legislação municipal de Itaúna.
              </p>
              <a
                href="/projetos"
                className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-500 transition-colors inline-flex items-center"
              >
                Acessar Plataforma
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
