export const SelectField = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  disabled = false, 
  required = false,
  placeholder = 'Select an option'
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" style={{ color: '#093331' }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
        style={{ 
          borderColor: '#093331',
          backgroundColor: disabled ? '#093331' : '#093331'
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};