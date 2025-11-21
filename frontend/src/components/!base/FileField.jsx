import { useState } from "react";

export const FileField = ({ 
  label, 
  onChange, 
  disabled = false, 
  required = false,
  accept = '*'
}) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" style={{ color: '#093331' }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={disabled}
          required={required}
          accept={accept}
          className="hidden"
          id={`file-${label.replace(/\s+/g, '-')}`}
        />
        <label
          htmlFor={`file-${label.replace(/\s+/g, '-')}`}
          className="flex items-center justify-center w-full px-4 py-2 rounded-lg border-2 cursor-pointer transition-all hover:opacity-80"
          style={{ 
            borderColor: '#093331',
            backgroundColor: disabled ? '#f3f4f6' : '#A27752',
            color: 'white'
          }}
        >
          {fileName || 'Choose File'}
        </label>
      </div>
    </div>
  );
};