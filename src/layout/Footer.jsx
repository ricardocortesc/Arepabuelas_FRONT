import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Arepabuelas. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;