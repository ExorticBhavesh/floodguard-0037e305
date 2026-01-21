import { useEffect, useState } from "react";

export function HeroBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Animated orbs */}
      <div 
        className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full opacity-30 blur-[100px] transition-transform duration-[2000ms] ease-out"
        style={{ 
          background: 'radial-gradient(circle, hsl(200 98% 50% / 0.4) 0%, transparent 70%)',
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
        }}
      />
      <div 
        className="absolute bottom-[-30%] right-[-15%] w-[900px] h-[900px] rounded-full opacity-20 blur-[120px] transition-transform duration-[3000ms] ease-out"
        style={{ 
          background: 'radial-gradient(circle, hsl(200 80% 60% / 0.3) 0%, transparent 60%)',
          transform: `translate(${-mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px)`
        }}
      />
      <div 
        className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full opacity-15 blur-[80px] transition-transform duration-[2500ms] ease-out"
        style={{ 
          background: 'radial-gradient(circle, hsl(152 82% 39% / 0.3) 0%, transparent 70%)',
          transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
        }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30 animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
