import React from 'react';

const Logo = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} select-none overflow-visible`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft Drop Shadow for the Shield */}
        <filter id="logoShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.8" floodColor="#0f172a" floodOpacity="0.15" />
        </filter>

        {/* Gradients */}
        <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064e3b" /> {/* Deep Forest Green */}
          <stop offset="60%" stopColor="#15803d" /> {/* Vibrant Green */}
          <stop offset="100%" stopColor="#4ade80" /> {/* Light Mint */}
        </linearGradient>

        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b45309" /> {/* Rich Saffron */}
          <stop offset="50%" stopColor="#f59e0b" /> {/* Pure Gold */}
          <stop offset="100%" stopColor="#fbbf24" /> {/* Warm Yellow */}
        </linearGradient>

        <linearGradient id="shieldBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* Embedded Styles for Premium Animations */}
      <style>{`
        .wreath-branch {
          transform-origin: 50px 50px;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* Rotate the wreath slowly when parent group is hovered */
        .group:hover .wreath-branch {
          animation: spin-wreath 30s linear infinite;
        }
        @keyframes spin-wreath {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        /* Golden Sun subtle heartbeat pulse */
        .pulsing-sun {
          transform-origin: 61px 71px;
          animation: heartbeat-sun 4s ease-in-out infinite;
        }
        @keyframes heartbeat-sun {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
      `}</style>

      {/* 1. Soft Circular Badge Background (Gives contrast and matches the original badge style) */}
      <circle cx="50" cy="50" r="47" fill="#fcfbf7" stroke="#e6e3d1" strokeWidth="0.8" />

      {/* 2. Outer Wreath (Animated on hover) */}
      <g className="wreath-branch">
        {/* Left Wreath Branch */}
        <path d="M 48 83 C 31 81, 21 58, 24 34 Q 28 20, 36 17" fill="none" stroke="url(#emeraldGrad)" strokeWidth="1.2" strokeLinecap="round" />
        {/* Right Wreath Branch */}
        <path d="M 52 83 C 69 81, 79 58, 76 34 Q 72 20, 64 17" fill="none" stroke="url(#emeraldGrad)" strokeWidth="1.2" strokeLinecap="round" />
        
        {/* Wreath Leaves */}
        <path d="M 38 78 Q 33 75 32 70 Q 37 72 38 78 Z" fill="url(#emeraldGrad)" />
        <path d="M 30 66 Q 24 65 22 59 Q 28 59 30 66 Z" fill="url(#emeraldGrad)" />
        <path d="M 25 50 Q 19 51 17 44 Q 23 43 25 50 Z" fill="url(#emeraldGrad)" />
        <path d="M 26 36 Q 21 39 18 32 Q 24 31 26 36 Z" fill="url(#emeraldGrad)" opacity="0.9" />
        
        <path d="M 62 78 Q 67 75 68 70 Q 63 72 62 78 Z" fill="url(#emeraldGrad)" />
        <path d="M 70 66 Q 76 65 78 59 Q 72 59 70 66 Z" fill="url(#emeraldGrad)" />
        <path d="M 75 50 Q 81 51 83 44 Q 77 43 75 50 Z" fill="url(#emeraldGrad)" />
        <path d="M 74 36 Q 79 39 82 32 Q 76 31 74 36 Z" fill="url(#emeraldGrad)" opacity="0.9" />

        {/* Decorative Saffron Rosettes on Wreath */}
        <circle cx="50" cy="14" r="2.5" fill="url(#goldGrad)" stroke="#92400e" strokeWidth="0.3" />
        <circle cx="50" cy="14" r="0.8" fill="#fff" />
        <circle cx="16" cy="56" r="2.5" fill="url(#goldGrad)" stroke="#92400e" strokeWidth="0.3" />
        <circle cx="16" cy="56" r="0.8" fill="#fff" />
        <circle cx="84" cy="56" r="2.5" fill="url(#goldGrad)" stroke="#92400e" strokeWidth="0.3" />
        <circle cx="84" cy="56" r="0.8" fill="#fff" />
        <circle cx="72" cy="74" r="2.5" fill="url(#goldGrad)" stroke="#92400e" strokeWidth="0.3" />
        <circle cx="72" cy="74" r="0.8" fill="#fff" />
        <circle cx="28" cy="74" r="2.5" fill="url(#goldGrad)" stroke="#92400e" strokeWidth="0.3" />
        <circle cx="28" cy="74" r="0.8" fill="#fff" />
      </g>

      {/* 3. Central Shield with Drop Shadow filter & Vertical split shading */}
      <g filter="url(#logoShadow)">
        {/* Shield Outer Path */}
        <path 
          d="M 50 22 C 63 19, 74 24, 76 26 C 76 46, 72 70, 50 86 C 28 70, 24 46, 24 26 C 27 24, 38 19, 50 22 Z" 
          fill="none" 
          stroke="url(#shieldBorderGrad)" 
          strokeWidth="2" 
          strokeLinejoin="round" 
        />
        {/* Shield Left Half Shaded Interior */}
        <path d="M 50 24 C 40 21.5, 30 26.5, 27.5 27.5 C 27.5 45, 31 66, 50 80.5 Z" fill="#f4fbf7" />
        {/* Shield Right Half Shaded Interior */}
        <path d="M 50 24 C 60 21.5, 70 26.5, 72.5 27.5 C 72.5 45, 69 66, 50 80.5 Z" fill="#e8f7ee" />
        
        {/* Shield Inner border border */}
        <path 
          d="M 50 24 C 60 21.5, 70 26.5, 72.5 27.5 C 72.5 45, 69 66, 50 80.5 C 31 66, 27.5 45, 27.5 27.5 Q 38.5 21.5, 50 24 Z" 
          fill="none" 
          stroke="#a7f3d0" 
          strokeWidth="0.6" 
        />
      </g>

      {/* 4. Green Peepal Leaf (Left Inside Shield) */}
      <g>
        <path d="M 38 66 C 38 72, 43 75, 45 76" fill="none" stroke="#15803d" strokeWidth="1" strokeLinecap="round" />
        <path 
          d="M 42 66 C 36 64, 31 52, 31 43 C 31 35, 39 33, 40 33 C 41 33, 49 35, 49 43 C 49 52, 44 64, 38 66" 
          fill="url(#emeraldGrad)" 
          stroke="#166534" 
          strokeWidth="0.8" 
        />
        {/* Leaf Veins */}
        <path d="M 40 33 C 40 44, 38 66, 38 66" fill="none" stroke="#052e16" strokeWidth="0.6" />
        <path d="M 39 42 Q 35 44 32 45" fill="none" stroke="#052e16" strokeWidth="0.5" />
        <path d="M 39 42 Q 43 44 47 45" fill="none" stroke="#052e16" strokeWidth="0.5" />
        <path d="M 39 50 Q 35 52 32 54" fill="none" stroke="#052e16" strokeWidth="0.5" />
        <path d="M 39 50 Q 43 52 47 54" fill="none" stroke="#052e16" strokeWidth="0.5" />
      </g>

      {/* 5. Glowing Rising Sun (Bottom-Right Inside Shield, with pulse animation) */}
      <g className="pulsing-sun">
        <circle cx="61" cy="71" r="5.5" fill="url(#goldGrad)" />
        <circle cx="61" cy="71" r="4" fill="#fbbf24" />
        {/* Sun Rays */}
        <path d="M 61 63 L 61 60 M 55 67 L 52 66 M 57 62 L 55 59 M 65 65 L 68 62 M 66 71 L 69 71 M 65 77 L 68 80 M 61 79 L 61 82 M 56 77 L 53 79 M 53 72 L 50 72" fill="none" stroke="url(#goldGrad)" strokeWidth="0.8" strokeLinecap="round" />
      </g>

      {/* 6. Elegant Orange Lotus Flower (Bottom Center overlapping shield tip) */}
      <g>
        <path d="M 50 69 C 48 74, 48 78, 50 80 C 52 78, 52 74, 50 69 Z" fill="url(#goldGrad)" />
        <path d="M 50 73 C 45 75, 42 78, 43 81 C 47 81, 49 77, 50 73 Z" fill="#ea580c" />
        <path d="M 50 73 C 55 75, 58 78, 57 81 C 53 81, 51 77, 50 73 Z" fill="#ea580c" />
        <path d="M 50 76 C 41 78, 38 80, 39 82 C 43 82, 47 80, 50 76 Z" fill="url(#goldGrad)" />
        <path d="M 50 76 C 59 78, 62 80, 61 82 C 57 82, 53 80, 50 76 Z" fill="url(#goldGrad)" />
        <path d="M 44 81 Q 50 85 56 81" fill="none" stroke="#166534" strokeWidth="1" />
      </g>

      {/* 7. Sacred Devanagari Script "श्री" (Top-Right Inside Shield) */}
      <text 
        x="51.5" 
        y="48" 
        fill="#0f5132" 
        fontFamily="'Lora', 'Noto Sans Devanagari', 'Rozha One', 'Yatra One', 'Georgia', serif" 
        fontWeight="800" 
        fontSize="15.5"
      >
        श्री
      </text>
    </svg>
  );
};

export default Logo;
