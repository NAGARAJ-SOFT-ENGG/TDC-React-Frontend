import React from 'react';

export const ButtonLight = ({
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
                bg-white text-icon border border-icon
                hover:text-white hover:ring-4 hover:ring-primary hover:bg-icon
                px-6 py-2 rounded shadow-sm
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
