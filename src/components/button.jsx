import React from 'react';

export const Button = ({
    type = 'button',
    onClick,
    children,
    className = '',
    disabled = false,
    ...props
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                bg-icon text-white 
                hover:ring-4 hover:ring-primary
                px-6 py-2 rounded shadow border-primary
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-150 ease-in-out
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
};
