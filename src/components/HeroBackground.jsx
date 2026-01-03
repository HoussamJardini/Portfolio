const HeroBackground = () => {
    return (
      <div className="hero-bg-animation">
        <svg width={800} height={800} viewBox="0 0 100 100">
          <defs>
            <mask id="hero-clipping">
              <polygon points="0,0 100,0 100,100 0,100" fill="black" />
              <polygon points="10,10 90,10 50,90" fill="white" />
              <polygon points="50,10 90,90 10,90" fill="white" />
              <polygon points="20,20 80,20 50,80" fill="white" />
              <polygon points="25,25 75,25 50,75" fill="white" />
              <polygon points="25,25 75,25 50,75" fill="white" />
              <polygon points="25,25 75,25 50,75" fill="white" />
            </mask>
          </defs>
        </svg>
        <div className="hero-bg-box" />
      </div>
    );
  };
  
  export default HeroBackground;