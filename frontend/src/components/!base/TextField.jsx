export const TextField = ({ 
  label, 
  value, 
  onChange, 
  disabled = false, 
  required = false,
  placeholder = '',
  type = 'text'
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" style={{ color: '#093331' }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
        style={{
          borderColor: '#093331',
          backgroundColor: disabled ? '#f3f4f6' : 'white',
          color: '#093331'
        }}
      />
    </div>
  );
};