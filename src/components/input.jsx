export const InputField = ({
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  required = false,
  readOnly = false,
  error = ''
}) => {
  return (
    <div className="relative w-full">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        readOnly={readOnly}
        className={`textSecondary peer block w-full h-11 px-3 pt-4 pb-1 text-sm border rounded appearance-none focus:outline-none ${className} ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
            : 'border-textInactive focus:border-primary focus:ring-1 focus:ring-primary'
        }`}
      />
      <label
        htmlFor={name}
        className={`absolute textSecondary duration-200 transform scale-75 -translate-y-3 top-1 left-3 z-10 origin-[0] bg-white px-1 
          peer-placeholder-shown:scale-100 
          peer-placeholder-shown:top-1/2 
          peer-placeholder-shown:-translate-y-1/2 
          peer-focus:scale-75 
          peer-focus:-translate-y-3 
          peer-focus:top-1 
          peer-focus:text-primary`}
      >
        {placeholder}
      </label>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};
