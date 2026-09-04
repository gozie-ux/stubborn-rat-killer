import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = ''
}) => {
  // Dimension mapping
  const sizeMap = {
    sm: { width: 44, height: 44, shieldWidth: 44, shieldHeight: 44 },
    md: { width: 56, height: 56, shieldWidth: 56, shieldHeight: 56 },
    lg: { width: 80, height: 80, shieldWidth: 80, shieldHeight: 80 },
    xl: { width: 140, height: 140, shieldWidth: 140, shieldHeight: 140 },
    hero: { width: 280, height: 280, shieldWidth: 280, shieldHeight: 280 }
  };

  const { width, height } = sizeMap[size];

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 500 500"
        width={width}
        height={height}
        className="filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] select-none transition-transform duration-300 hover:scale-105"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic Silver 3D Gradient */}
          <linearGradient id="silver3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="75%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          {/* Silver Bevel Edge */}
          <linearGradient id="silverBevel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#cbd5e1" />
            <stop offset="70%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Red Shield Metallic Brushed Gradient */}
          <radialGradient id="redBrushedShield" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ff2a2a" />
            <stop offset="30%" stopColor="#e50914" />
            <stop offset="70%" stopColor="#990000" />
            <stop offset="95%" stopColor="#570000" />
            <stop offset="100%" stopColor="#300000" />
          </radialGradient>

          {/* Gold Brass Metallic 3D Gradient */}
          <linearGradient id="goldBrass3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="20%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#eab308" />
            <stop offset="70%" stopColor="#ca8a04" />
            <stop offset="85%" stopColor="#854d0e" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          {/* Dark Engraved Gold for Pests */}
          <linearGradient id="engravedPest" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#422006" />
            <stop offset="50%" stopColor="#291403" />
            <stop offset="100%" stopColor="#1a0c02" />
          </linearGradient>

          {/* Drop Shadow Filter */}
          <filter id="shadow3D" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.85" />
          </filter>

          {/* Text Emboss Shadow */}
          <filter id="embossText" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="2" floodColor="#000000" floodOpacity="0.9" />
          </filter>
        </defs>

        {/* Outer Silver Bevel Shield Base */}
        <path
          d="M 120 70 Q 250 50 380 70 Q 395 190 395 280 C 395 380 250 450 250 450 C 250 450 105 380 105 280 Q 105 190 120 70 Z"
          fill="url(#silverBevel)"
          filter="url(#shadow3D)"
        />

        {/* Inner Silver Rim */}
        <path
          d="M 126 77 Q 250 58 374 77 Q 388 190 388 277 C 388 371 250 439 250 439 C 250 439 112 371 112 277 Q 112 190 126 77 Z"
          fill="#0f172a"
        />

        {/* Vibrant Red Shield Body */}
        <path
          d="M 130 82 Q 250 64 370 82 Q 382 190 382 274 C 382 364 250 430 250 430 C 250 430 118 364 118 274 Q 118 190 130 82 Z"
          fill="url(#redBrushedShield)"
        />

        {/* Shield Highlights & Surface Sheen */}
        <path
          d="M 132 86 Q 250 70 368 86 Q 375 160 375 220 C 320 200 200 210 125 220 Q 125 160 132 86 Z"
          fill="white"
          opacity="0.12"
        />

        {/* 3D Top Arched Text: STUBBORN */}
        <g filter="url(#embossText)">
          <text
            x="250"
            y="145"
            textAnchor="middle"
            fill="url(#silver3D)"
            stroke="#1e293b"
            strokeWidth="3"
            fontWeight="900"
            fontSize="54"
            fontFamily="'Impact', 'Arial Black', 'Outfit', sans-serif"
            letterSpacing="3"
          >
            STUBBORN
          </text>
        </g>

        {/* 3D Second Row Text: RAT */}
        <g filter="url(#embossText)">
          <text
            x="250"
            y="200"
            textAnchor="middle"
            fill="url(#silver3D)"
            stroke="#1e293b"
            strokeWidth="2.5"
            fontWeight="900"
            fontSize="50"
            fontFamily="'Impact', 'Arial Black', 'Outfit', sans-serif"
            letterSpacing="4"
          >
            RAT
          </text>
        </g>

        {/* Golden Lightning Bolt Left */}
        <polygon
          points="130,120 220,285 180,285 240,390 160,260 200,260"
          fill="url(#goldBrass3D)"
          stroke="#78350f"
          strokeWidth="1.5"
          filter="url(#shadow3D)"
        />

        {/* Golden Lightning Bolt Right */}
        <polygon
          points="370,120 280,285 320,285 260,390 340,260 300,260"
          fill="url(#goldBrass3D)"
          stroke="#78350f"
          strokeWidth="1.5"
          filter="url(#shadow3D)"
        />

        {/* Central Golden Brass Oval Medallion */}
        <ellipse
          cx="250"
          cy="330"
          rx="98"
          ry="55"
          fill="url(#goldBrass3D)"
          stroke="#5c3806"
          strokeWidth="4"
          filter="url(#shadow3D)"
        />

        {/* Medallion Inner Ring */}
        <ellipse
          cx="250"
          cy="330"
          rx="91"
          ry="48"
          fill="none"
          stroke="#854d0e"
          strokeWidth="1.5"
        />

        {/* --- PEST ENGRAVINGS INSIDE GOLD MEDALLION --- */}

        {/* 1. Large Sewer Rat (Left Side) */}
        <g fill="url(#engravedPest)" stroke="#1a0c02" strokeWidth="0.5">
          {/* Body */}
          <ellipse cx="205" cy="324" rx="20" ry="12" transform="rotate(-10 205 324)" />
          {/* Head & Snout */}
          <polygon points="222,318 238,321 224,328" />
          {/* Ear */}
          <ellipse cx="218" cy="314" rx="3.5" ry="4.5" />
          {/* Eye */}
          <circle cx="228" cy="320" r="1.2" fill="#eab308" />
          {/* Long Whiskers */}
          <line x1="236" y1="322" x2="246" y2="319" stroke="#291403" strokeWidth="0.8" />
          <line x1="236" y1="323" x2="246" y2="324" stroke="#291403" strokeWidth="0.8" />
          {/* Paws */}
          <ellipse cx="200" cy="336" rx="5" ry="2.5" />
          <ellipse cx="220" cy="334" rx="4" ry="2.5" />
          {/* Curled Tail */}
          <path
            d="M 186 324 Q 170 335 174 346 Q 180 354 195 348"
            fill="none"
            stroke="url(#engravedPest)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* 2. German Cockroach (Top Right Center) */}
        <g fill="url(#engravedPest)" stroke="#1a0c02" strokeWidth="0.5">
          {/* Thorax / Shield */}
          <ellipse cx="270" cy="310" rx="9" ry="6" transform="rotate(35 270 310)" />
          {/* Abdomen / Wings */}
          <ellipse cx="278" cy="320" rx="14" ry="7" transform="rotate(45 278 320)" />
          {/* Head */}
          <circle cx="264" cy="303" r="3" />
          {/* Long Antennae */}
          <path d="M 263 301 Q 250 286 244 280" fill="none" stroke="#291403" strokeWidth="1" />
          <path d="M 264 300 Q 268 284 274 278" fill="none" stroke="#291403" strokeWidth="1" />
          {/* Jointed Legs */}
          <line x1="268" y1="308" x2="255" y2="304" stroke="#291403" strokeWidth="1" />
          <line x1="272" y1="314" x2="256" y2="316" stroke="#291403" strokeWidth="1" />
          <line x1="276" y1="322" x2="262" y2="328" stroke="#291403" strokeWidth="1" />
          <line x1="273" y1="306" x2="288" y2="300" stroke="#291403" strokeWidth="1" />
          <line x1="278" y1="314" x2="294" y2="312" stroke="#291403" strokeWidth="1" />
          <line x1="284" y1="322" x2="300" y2="324" stroke="#291403" strokeWidth="1" />
        </g>

        {/* 3. Coiled Snake (Far Right) */}
        <g fill="none" stroke="url(#engravedPest)" strokeWidth="4.5" strokeLinecap="round">
          {/* S-shaped coiled body */}
          <path d="M 298 356 Q 312 358 318 348 Q 324 336 312 330 Q 302 324 305 315 Q 308 308 316 310" />
          {/* Snake Head */}
          <path d="M 314 309 L 319 308 L 318 313 Z" fill="url(#engravedPest)" stroke="#1a0c02" strokeWidth="1" />
        </g>

        {/* 4. Bedbug Cluster (Center Bottom) */}
        <g fill="url(#engravedPest)" stroke="#1a0c02" strokeWidth="0.5">
          {/* Large Bedbug */}
          <ellipse cx="235" cy="354" rx="8" ry="10" />
          <circle cx="235" cy="344" r="3" />
          {/* Segments */}
          <line x1="228" y1="350" x2="242" y2="350" stroke="#ca8a04" strokeWidth="0.6" />
          <line x1="228" y1="354" x2="242" y2="354" stroke="#ca8a04" strokeWidth="0.6" />
          <line x1="229" y1="358" x2="241" y2="358" stroke="#ca8a04" strokeWidth="0.6" />

          {/* Medium Bedbug */}
          <ellipse cx="254" cy="356" rx="6.5" ry="8" />
          <circle cx="254" cy="348" r="2.5" />
          {/* Segments */}
          <line x1="249" y1="353" x2="259" y2="353" stroke="#ca8a04" strokeWidth="0.5" />
          <line x1="249" y1="357" x2="259" y2="357" stroke="#ca8a04" strokeWidth="0.5" />

          {/* Small Bedbug Left */}
          <ellipse cx="196" cy="352" rx="6" ry="7.5" transform="rotate(-15 196 352)" />
          <circle cx="195" cy="344" r="2.2" />
        </g>

        {/* Right Side Vertical Phone & Company Branding */}
        <g transform="translate(372, 280) rotate(90)" className="select-none">
          {/* Phone Icon */}
          <circle cx="-65" cy="-6" r="6" fill="#ca8a04" />
          <path
            d="M -67 -8 C -68 -6 -68 -4 -66 -2 L -64 -4 L -65 -5 L -64 -6 Z"
            fill="black"
          />
          {/* Phone Number */}
          <text
            x="-54"
            y="-2"
            fill="#ffffff"
            fontWeight="900"
            fontSize="13"
            fontFamily="'Outfit', 'Arial Black', sans-serif"
            letterSpacing="1.5"
          >
            08089854753
          </text>
          {/* KILLAPEST RESOURCES */}
          <text
            x="-54"
            y="12"
            fill="#facc15"
            fontWeight="900"
            fontSize="9"
            fontFamily="'Outfit', sans-serif"
            letterSpacing="1.5"
          >
            KILLAPEST RESOURCES
          </text>
        </g>

        {/* Bottom Red Plate with 3D Silver "KILLER" */}
        <g filter="url(#embossText)">
          <text
            x="250"
            y="420"
            textAnchor="middle"
            fill="url(#silver3D)"
            stroke="#1e293b"
            strokeWidth="3"
            fontWeight="900"
            fontSize="48"
            fontFamily="'Impact', 'Arial Black', 'Outfit', sans-serif"
            letterSpacing="4"
          >
            KILLER
          </text>
        </g>

        {/* 3D Chrome Text Below Shield: COMPLETE EXTERMINATION SOLUTIONS */}
        <text
          x="250"
          y="488"
          textAnchor="middle"
          fill="url(#silver3D)"
          stroke="#334155"
          strokeWidth="1.2"
          fontWeight="900"
          fontSize="17"
          fontFamily="'Outfit', 'Arial Black', sans-serif"
          letterSpacing="2.5"
        >
          COMPLETE EXTERMINATION SOLUTIONS
        </text>
      </svg>

      {showSubtitle && (
        <span className="text-[11px] font-black uppercase tracking-widest text-yellow-400 font-['Outfit'] mt-1 drop-shadow-md">
          Complete Extermination Solutions
        </span>
      )}
    </div>
  );
};
