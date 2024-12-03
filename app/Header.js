const Header = ({ options, onSelect }) => {
    return (
      <div style={{ display: "flex", justifyContent: "space-around", padding: "10px", background: "#f0f0f0" }}>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option)}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {option}
          </button>
        ))}
      </div>
    );
  };
  
  export default Header;
  