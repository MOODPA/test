const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <a href="/" className="text-xl font-bold">
              MOOD.PA
            </a>
            <p className="text-sm mt-1">
              Analisador de Projetos Arquitetônicos
            </p>
          </div>
          
          <div className="text-sm">
            <p className="mb-2">
              <strong>Contato:</strong> arquitetocaiquetavares@gmail.com
            </p>
            <p className="mb-2">
              <strong>Endereço:</strong> Rua Silviano Brandão, n° 17 - Cerqueira Lima
            </p>
            <p>
              © {currentYear} Caique Tavares Silva. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
