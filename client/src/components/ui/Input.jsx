// SECTION: Labeled input — optional label, luxury-styled field, and inline error message
const Input = ({ label, error, className = '', ...props }) => (
  <div className="w-full">
    {/* SECTION: Label — shown only when label prop is passed */}
    {label && <label className="block text-sm font-accent text-luxury-muted mb-2">{label}</label>}
    {/* SECTION: Field — spreads remaining props (type, value, onChange, etc.) onto native input */}
    <input className={`input-luxury ${error ? 'border-red-500/50' : ''} ${className}`} {...props} />
    {/* SECTION: Error — validation message below the field */}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

export default Input;
