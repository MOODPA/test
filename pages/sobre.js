import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Sobre() {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Sobre - MOOD.PA</title>
        <meta name="description" content="Informações sobre o MOOD.PA - Analisador Técnico de Projetos Arquitetônicos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header currentPage="sobre" />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Sobre o MOOD.PA</h1>
              <p className="text-xl opacity-90">
                Conheça mais sobre nossa plataforma de análise técnica de projetos arquitetônicos
              </p>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">O que é o MOOD.PA?</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  O MOOD.PA (Analisador Técnico de Projetos Arquitetônicos) é uma plataforma web desenvolvida para análise técnica de projetos 
                  arquitetônicos segundo a legislação municipal de Itaúna. A plataforma permite aos profissionais de arquitetura e urbanismo 
                  verificar a conformidade de seus projetos com as normas municipais antes da submissão formal à Prefeitura, reduzindo o tempo 
                  de aprovação e minimizando erros.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  Desenvolvida por Caique Tavares Silva, Arquiteto e Urbanista, a plataforma utiliza tecnologia avançada para automatizar 
                  a verificação de conformidade, tornando o processo mais eficiente e preciso.
                </p>
              </div>
              
              <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">Funcionalidades Principais</h2>
                <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong>Análise de Representação Gráfica:</strong> Verificação automática da conformidade da representação gráfica do projeto com as normas municipais.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong>Cálculo de Parâmetros Urbanísticos:</strong> Análise automática de recuos, afastamentos, taxas de ocupação, permeabilidade e outros parâmetros.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong>Relatórios Detalhados:</strong> Geração de relatórios completos com análise de conformidade e recomendações para correções.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong>Entrada Manual de Dados:</strong> Possibilidade de inserir manualmente informações que não foram detectadas automaticamente.
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">Contato</h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span><strong>Email:</strong> arquitetocaiquetavares@gmail.com</span>
                  </p>
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span><strong>Endereço:</strong> Rua Silviano Brandão, n° 17 - Cerqueira Lima</span>
                  </p>
                </div>
              </div>
              
              <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">Desenvolvedor</h2>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="text-center md:text-left text-gray-700 dark:text-gray-300">
                    <h3 className="text-xl font-bold mb-2">Caique Tavares Silva</h3>
                    <p className="mb-2">Arquiteto e Urbanista</p>
                    <p className="mb-4">
                      Profissional dedicado ao desenvolvimento de soluções tecnológicas para otimizar processos na área de arquitetura e urbanismo.
                    </p>
                    <p className="text-sm">
                      © {new Date().getFullYear()} Caique Tavares Silva. Todos os direitos reservados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
