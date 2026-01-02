import { useEffect, useRef } from 'react';

const DotGrid = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const dotsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Configuration
    const DOT_SPACING = 70;
    const DOT_RADIUS = 1.5;
    const GLOW_RADIUS = 150;
    const BASE_COLOR = { r: 147, g: 51, b: 234 }; // Purple
    const BASE_OPACITY = 0.15;
    const GLOW_OPACITY = 1;

    // Resize handler
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDots();
    };

    // Initialize dots
    const initDots = () => {
      dotsRef.current = [];
      const cols = Math.ceil(canvas.width / DOT_SPACING) + 1;
      const rows = Math.ceil(canvas.height / DOT_SPACING) + 1;
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dotsRef.current.push({
            x: i * DOT_SPACING,
            y: j * DOT_SPACING,
            opacity: BASE_OPACITY,
            targetOpacity: BASE_OPACITY,
          });
        }
      }
    };

    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const { x: mouseX, y: mouseY } = mouseRef.current;
      
      dotsRef.current.forEach(dot => {
        // Calculate distance from mouse
        const dx = dot.x - mouseX;
        const dy = dot.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Set target opacity based on distance
        if (distance < GLOW_RADIUS) {
          const intensity = 1 - (distance / GLOW_RADIUS);
          dot.targetOpacity = BASE_OPACITY + (GLOW_OPACITY - BASE_OPACITY) * intensity;
        } else {
          dot.targetOpacity = BASE_OPACITY;
        }
        
        // Smooth transition
        dot.opacity += (dot.targetOpacity - dot.opacity) * 0.1;
        
        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${BASE_COLOR.r}, ${BASE_COLOR.g}, ${BASE_COLOR.b}, ${dot.opacity})`;
        ctx.fill();
        
        // Add glow effect for bright dots
        if (dot.opacity > 0.3) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, DOT_RADIUS * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${BASE_COLOR.r}, ${BASE_COLOR.g}, ${BASE_COLOR.b}, ${dot.opacity * 0.3})`;
          ctx.fill();
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    // Initialize
    resize();
    animate();

    // Event listeners
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default DotGrid;