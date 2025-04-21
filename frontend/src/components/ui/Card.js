const Card = ({ children, className }) => {
    return (
      <div className={`bg-white p-6 rounded-xl shadow-lg transition-all hover:shadow-2xl ${className}`}>
        {children}
      </div>
    );
  };
  
  export default Card;
  