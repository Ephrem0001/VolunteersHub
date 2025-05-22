const Button = ({ children, className, ...props }) => {
    return (
      <button
        className={`px-4 py-2 rounded-lg shadow-md transition-all hover:scale-105 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
