const HeroBackground = () => {
    return (
      <div className="hero-bg-animation">
        <svg width={400} height={400} viewBox="0 0 100 100">
          <defs>
            <mask id="hero-clipping">
              <polygon points="0,0 100,0 100,100 0,100" fill="black" />
              <polygon points="25,25 75,25 50,75" fill="white" />
              <polygon points="50,25 75,75 25,75" fill="white" />
              <polygon points="35,35 65,35 50,65" fill="white" />
              <polygon points="35,35 65,35 50,65" fill="white" />
              <polygon points="35,35 65,35 50,65" fill="white" />
              <polygon points="35,35 65,35 50,65" fill="white" />
            </mask>
          </defs>
        </svg>
        <div className="hero-bg-box" />
      </div>
    );
  };
  
  export default HeroBackground;
  