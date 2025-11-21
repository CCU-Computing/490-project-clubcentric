export const ActionButton = ({ 
  label, 
  onClick, 
  disabled = false,
  variant = 'primary', // 'primary' or 'secondary'
  type = 'button'
}) => {
  const isPrimary = variant === 'primary';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-2 rounded-lg font-medium transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ 
        backgroundColor: isPrimary ? '#093331' : '#A27752',
        color: 'white'
      }}
    >
      {label}
    </button>
  );
};