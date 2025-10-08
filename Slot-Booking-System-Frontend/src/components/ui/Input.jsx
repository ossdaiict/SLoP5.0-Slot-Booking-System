import React from 'react';

const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 ${Icon ? 'pl-11' : 'pl-4'} 
            border-2 border-gray-200 rounded-lg
            focus:border-gray-900 focus:ring-4 focus:ring-gray-100
            transition-all duration-200
            placeholder-gray-400
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
