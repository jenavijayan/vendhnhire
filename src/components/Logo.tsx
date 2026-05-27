import React from 'react';

export const Logo = ({ className = "h-12 w-12" }: { className?: string }) => {
  return (
    <svg viewBox="0 0 100 120" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Triquetra Knot made of 3 shifted leaves */}
      <g fill="none" stroke="#0D7438" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
        {/* Leaf 1 (Top) */}
        <path d="M 50,12 A 35,35 0 0,1 50,68 A 35,35 0 0,1 50,12" />
        {/* Leaf 2 (Bottom Right) */}
        <g transform="rotate(120 50 50)">
          <path d="M 50,12 A 35,35 0 0,1 50,68 A 35,35 0 0,1 50,12" />
        </g>
        {/* Leaf 3 (Bottom Left) */}
        <g transform="rotate(240 50 50)">
          <path d="M 50,12 A 35,35 0 0,1 50,68 A 35,35 0 0,1 50,12" />
        </g>
      </g>

      {/* 3 Colorful Dots */}
      <circle cx="28" cy="36" r="8" fill="#FF1493" /> {/* Pink */}
      <circle cx="72" cy="36" r="8" fill="#1B1464" /> {/* Dark Blue */}
      <circle cx="50" cy="78" r="8" fill="#F26522" /> {/* Orange */}

      {/* Text */}
      <text x="50" y="105" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" letterSpacing="-0.2" textAnchor="middle" fill="#000">
        Trust in Every Byte
      </text>
    </svg>
  );
};

