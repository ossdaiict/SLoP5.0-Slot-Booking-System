import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  gradient = false,
  ...props 
}) => {
  const baseStyles = 'bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300';
  const hoverStyles = hover ? 'hover:shadow-2xl hover:-translate-y-1' : '';
  const gradientStyles = gradient ? 'bg-gradient-to-br from-white to-gray-50' : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${gradientStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
