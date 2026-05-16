const Input = ({ label, error, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-accent text-luxury-muted mb-2">{label}</label>}
    <input className={`input-luxury ${error ? 'border-red-500/50' : ''} ${className}`} {...props} />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

export default Input;
