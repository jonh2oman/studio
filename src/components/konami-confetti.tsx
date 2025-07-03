
import React from 'react';
import { Ship } from 'lucide-react';

const confettiCount = 50;

export const KonamiConfetti: React.FC = () => {
    const confetti = Array.from({ length: confettiCount }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}vw`,
            animationDuration: `${Math.random() * 3 + 4}s`, // 4s to 7s
            animationDelay: `${Math.random() * 2}s`, // 0s to 2s
            transform: `scale(${Math.random() * 0.5 + 0.5})`, // 0.5 to 1 scale
            opacity: Math.random() * 0.5 + 0.5, // 0.5 to 1 opacity
        };
        return (
            <div key={i} className="absolute top-[-50px] animate-fall" style={style}>
                <Ship className="h-8 w-8 text-primary" style={{ transform: `rotate(${Math.random() * 360}deg)` }} />
            </div>
        );
    });

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] overflow-hidden">
            {confetti}
            <style jsx>{`
                @keyframes fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                    }
                    100% {
                        transform: translateY(110vh) rotate(360deg);
                    }
                }
                .animate-fall {
                    animation-name: fall;
                    animation-timing-function: linear;
                }
            `}</style>
        </div>
    );
};
