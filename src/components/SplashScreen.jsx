import { useEffect, useState } from 'react';

export default function SplashScreen({ onLoadingComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState('initial'); // 'initial', 'spread', 'fade'

  useEffect(() => {
    // Start spreading animation after 1 second
    const spreadTimer = setTimeout(() => {
      setAnimationPhase('spread');
    }, 1000);

    // Start fade animation after 3 seconds
    const fadeTimer = setTimeout(() => {
      setAnimationPhase('fade');
    }, 3000);

    // Complete loading after 4 seconds
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onLoadingComplete, 300);
    }, 4000);

    return () => {
      clearTimeout(spreadTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-green-500 to-blue-600 z-50 transition-opacity duration-500 ${
      animationPhase === 'fade' ? 'opacity-0' : 'opacity-100'
    }`}>
      
      {/* Animated Logo Container */}
      <div className="w-full h-full flex items-center justify-center">
        <div className={`
          relative transition-all duration-2000 ease-in-out
          ${animationPhase === 'initial' ? 'scale-100 opacity-100' : ''}
          ${animationPhase === 'spread' ? 'scale-150 opacity-80' : ''}
          ${animationPhase === 'fade' ? 'scale-200 opacity-0' : ''}
        `}>
          <img 
            src="/sneho-pws-logo.png" 
            alt="Sneho Logo" 
            className="w-64 h-64 object-contain transition-all duration-2000"
          />
        </div>
      </div>

      {/* Optional: Loading text that also fades */}
      <div className={`absolute bottom-10 left-0 right-0 text-center transition-opacity duration-1000 ${
        animationPhase === 'fade' ? 'opacity-0' : 'opacity-100'
      }`}>
        <p className="text-white text-lg">আপনার স্বাস্থ্য সঙ্গী</p>
      </div>
    </div>
  );
}