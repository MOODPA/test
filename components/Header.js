import { useTheme } from '../hooks/useTheme';
import { useState } from 'react';

const Header = ({ currentPage = 'home' }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <a href="/" className="text-2xl font-bold">
              MOOD.PA
            </a>
            <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded">
              Beta
            </span>
          </div>

          {/* Menu para desktop */}
          <nav className="hidden md:flex space-x-6">
            <a 
              href="/" 
              className={`hover:text-gray-200 transition-colors ${
                currentPage === 'home' ? 'font-bold' : ''
              }`}
            >
              Início
            </a>
            <a 
              href="/projetos" 
              className={`hover:text-gray-200 transition-colors ${
                currentPage === 'projetos' ? 'font-bold' : ''
              }`}
            >
              Projetos
            </a>
            <a 
              href="/sobre" 
              className={`hover:text-gray-200 transition-colors ${
                currentPage === 'sobre' ? 'font-bold' : ''
              }`}
            >
              Sobre
            </a>
            <button
              onClick={toggleTheme}
              className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              aria-label={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            >
              {isDarkMode ? 
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> 
                : 
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              }
            </button>
          </nav>

          {/* Botão de menu para mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className="p-1 mr-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              aria-label={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            >
              {isDarkMode ? 
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> 
                : 
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              }
            </button>
            <button
              onClick={toggleMenu}
              className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isMenuOpen ? 
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> 
                : 
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              }
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2">
            <nav className="flex flex-col space-y-3">
              <a 
                href="/" 
                className={`hover:text-gray-200 transition-colors ${
                  currentPage === 'home' ? 'font-bold' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </a>
              <a 
                href="/projetos" 
                className={`hover:text-gray-200 transition-colors ${
                  currentPage === 'projetos' ? 'font-bold' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Projetos
              </a>
              <a 
                href="/sobre" 
                className={`hover:text-gray-200 transition-colors ${
                  currentPage === 'sobre' ? 'font-bold' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
