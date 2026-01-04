// ==========================================
// 🌫️ FOG CONFIGURATION - Edit these values
// ==========================================

const CONFIG = {
    FOG_OPACITY: 0.8,
    
    LAYER_1_OPACITY: 1,
    LAYER_2_OPACITY: 0.8,
    LAYER_3_OPACITY: 1,
    LAYER_4_OPACITY: 0.6,
    CENTER_WISP_OPACITY: 0.35,
    
    LAYER_1_COLOR: '147, 51, 234',
    LAYER_2_COLOR: '217, 70, 239',
    LAYER_3_COLOR: '192, 132, 252',
    LAYER_4_COLOR: '124, 58, 237',
    CENTER_COLOR: '168, 85, 247',
    
    COLOR_INTENSITY: 0.2,
    
    // FIXED - Much faster!
    LAYER_1_SPEED: 13,
    LAYER_2_SPEED: 14,
    LAYER_3_SPEED: 18,
    LAYER_4_SPEED: 20,
    CENTER_PULSE_SPEED: 1,
    
    // Movement
    MOVEMENT_X: 9,   // 40 was too extreme
    MOVEMENT_Y: 9,
    SCALE_AMOUNT: 1.3,
    
    CLEARING_SIZE_X: 90,
    CLEARING_SIZE_Y: 45,
    CENTER_DARKNESS: 0.5,
    NOISE_OPACITY: 0.1,
  };
  
  // ==========================================
  
  const FogBackground = () => {
    const styles = {
      '--fog-opacity': CONFIG.FOG_OPACITY,
      '--layer-1-opacity': CONFIG.LAYER_1_OPACITY,
      '--layer-2-opacity': CONFIG.LAYER_2_OPACITY,
      '--layer-3-opacity': CONFIG.LAYER_3_OPACITY,
      '--layer-4-opacity': CONFIG.LAYER_4_OPACITY,
      '--center-opacity': CONFIG.CENTER_WISP_OPACITY,
      '--layer-1-color': CONFIG.LAYER_1_COLOR,
      '--layer-2-color': CONFIG.LAYER_2_COLOR,
      '--layer-3-color': CONFIG.LAYER_3_COLOR,
      '--layer-4-color': CONFIG.LAYER_4_COLOR,
      '--center-color': CONFIG.CENTER_COLOR,
      '--color-intensity': CONFIG.COLOR_INTENSITY,
      '--layer-1-speed': `${CONFIG.LAYER_1_SPEED}s`,
      '--layer-2-speed': `${CONFIG.LAYER_2_SPEED}s`,
      '--layer-3-speed': `${CONFIG.LAYER_3_SPEED}s`,
      '--layer-4-speed': `${CONFIG.LAYER_4_SPEED}s`,
      '--center-speed': `${CONFIG.CENTER_PULSE_SPEED}s`,
      '--move-x': `${CONFIG.MOVEMENT_X}%`,
      '--move-y': `${CONFIG.MOVEMENT_Y}%`,
      '--scale': CONFIG.SCALE_AMOUNT,
      '--clearing-x': `${CONFIG.CLEARING_SIZE_X}%`,
      '--clearing-y': `${CONFIG.CLEARING_SIZE_Y}%`,
      '--center-dark': CONFIG.CENTER_DARKNESS,
      '--noise-opacity': CONFIG.NOISE_OPACITY,
    };
  
    return (
      <div className="fog-wrapper" style={styles}>
        {/* Background Depth */}
        <div className="fog-depth" />
        
        {/* Cloud Container */}
        <div className="fog-clouds">
          {/* Top-Left */}
          <div className="fog-cluster fog-top-left fog-animate-1">
            <div className="fog-gradient fog-gradient-1" />
          </div>
  
          {/* Top-Right */}
          <div className="fog-cluster fog-top-right fog-animate-2">
            <div className="fog-gradient fog-gradient-2" />
          </div>
  
          {/* Bottom-Right */}
          <div className="fog-cluster fog-bottom-right fog-animate-3">
            <div className="fog-gradient fog-gradient-3" />
          </div>
  
          {/* Bottom-Left */}
          <div className="fog-cluster fog-bottom-left fog-animate-4">
            <div className="fog-gradient fog-gradient-4" />
          </div>
  
          {/* Center Wisp */}
          <div className="fog-center-wisp">
            <div className="fog-wisp-inner" />
          </div>
        </div>
  
        {/* Lighting */}
        <div className="fog-lighting" />
        
        {/* Noise */}
        <div className="fog-noise" />
      </div>
    );
  };
  
  export default FogBackground;