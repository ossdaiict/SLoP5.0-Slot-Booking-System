import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    secondary: 'bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50 shadow-md hover:shadow-lg',
    outline: 'bg-transparent border-2 border-gray-300 hover:border-gray-900 hover:text-gray-900 text-gray-700',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-900',
    danger: 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white shadow-lg hover:shadow-xl',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

export default Button;
