import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  withTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'text-[#6d0026]',
  subtextColor = 'text-[#8a7174]',
  withTagline = false,
}) => {
  // Dimensions mapping
  const dimensions = {
    sm: { icon: 28, text: 'text-lg', dot: 'w-1.5 h-1.5' },
    md: { icon: 38, text: 'text-2xl sm:text-3xl', dot: 'w-2 h-2' },
    lg: { icon: 48, text: 'text-3xl sm:text-4xl', dot: 'w-2.5 h-2.5' },
    xl: { icon: 60, text: 'text-4xl sm:text-5xl', dot: 'w-3 h-3' },
    '2xl': { icon: 80, text: 'text-5xl sm:text-6xl', dot: 'w-3.5 h-3.5' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Rose Gold Flowing Drape Silhouette Icon (Vectorized exactly from uploaded brand artwork) */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="roseGoldGrad1" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f3c8bc" />
            <stop offset="25%" stopColor="#d49685" />
            <stop offset="50%" stopColor="#b96d5b" />
            <stop offset="75%" stopColor="#e4b0a2" />
            <stop offset="100%" stopColor="#8d493a" />
          </linearGradient>
          <linearGradient id="roseGoldGrad2" x1="140" y1="30" x2="30" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e9b7a9" />
            <stop offset="40%" stopColor="#c57f6d" />
            <stop offset="80%" stopColor="#964e3d" />
            <stop offset="100%" stopColor="#693023" />
          </linearGradient>
          <linearGradient id="roseGoldGrad3" x1="60" y1="50" x2="120" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f9dfd7" />
            <stop offset="35%" stopColor="#cca091" />
            <stop offset="70%" stopColor="#a35f4f" />
            <stop offset="100%" stopColor="#e2aca0" />
          </linearGradient>
          <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#6d0026" floodOpacity="0.15" />
          </filter>
        </defs>

        <g filter="url(#softGlow)">
          {/* 1. Hair Flowing strands to the left */}
          <path
            d="M87 31 C82 25, 73 24, 64 30 C58 33, 55 36, 52 44 C56 39, 63 36, 70 36 C77 36, 81 39, 87 41 C82 43, 76 43, 70 47 C65 50, 61 55, 60 62 C63 56, 68 53, 75 51 C82 49, 87 46, 91 38 C90 35, 89 33, 87 31 Z"
            fill="url(#roseGoldGrad1)"
          />

          {/* 2. Head Silhouette & Graceful Neckline */}
          <path
            d="M85 36 C87 34, 91 36, 93 40 C95 44, 93 49, 89 53 C86 56, 83 58, 81 63 C80 60, 81 57, 83 54 C86 50, 87 46, 86 42 C85 39, 84 37, 85 36 Z"
            fill="url(#roseGoldGrad2)"
          />

          {/* 3. Upper Torso & Arm Contour */}
          <path
            d="M89 53 C94 57, 98 63, 98 70 C96 71, 93 68, 90 64 C86 59, 82 56, 78 57 C72 58, 66 65, 61 74 C66 68, 72 63, 77 64 C82 65, 85 71, 84 78 C83 83, 79 88, 75 92 C80 87, 84 81, 86 75 C88 68, 89 60, 89 53 Z"
            fill="url(#roseGoldGrad3)"
          />

          {/* 4. Main Body Swirling Ribbon (Waist to lower curves) */}
          <path
            d="M82 63 C86 70, 88 79, 86 89 C83 100, 75 109, 64 116 C53 123, 44 125, 41 117 C39 109, 44 102, 53 96 C63 90, 75 88, 85 89 C73 89, 61 93, 51 100 C43 106, 40 114, 43 120 C47 127, 58 126, 70 119 C82 112, 90 101, 92 88 C94 77, 91 68, 86 62 L82 63 Z"
            fill="url(#roseGoldGrad1)"
          />

          {/* 5. Lower Saree Drape Ribbon Loop (Spiraling base) */}
          <path
            d="M65 116 C73 124, 84 135, 91 143 C93 145, 90 148, 86 149 C80 150, 74 146, 72 138 C70 130, 74 123, 80 118 C83 115, 87 114, 91 116 C86 116, 81 118, 77 122 C73 126, 71 133, 73 139 C76 146, 82 148, 87 146 C92 144, 93 140, 88 135 C83 129, 73 121, 65 116 Z"
            fill="url(#roseGoldGrad2)"
          />

          {/* 6. Dynamic Flowing Ribbon Skirt Flare on Right */}
          <path
            d="M93 84 C95 95, 98 108, 102 121 C104 128, 108 135, 117 138 C124 140, 131 135, 133 130 C125 133, 117 130, 112 124 C107 116, 104 104, 102 91 C100 83, 98 76, 94 70 C96 74, 97 79, 93 84 Z"
            fill="url(#roseGoldGrad3)"
          />

          {/* 7. Inner Silhouette Shadow Depth Arc */}
          <path
            d="M95 91 C101 106, 107 122, 118 134 C112 130, 106 121, 101 108 C97 97, 95 87, 94 78 C95 82, 95 87, 95 91 Z"
            fill="url(#roseGoldGrad1)"
            opacity="0.85"
          />
        </g>
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col items-start leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-bold tracking-widest uppercase transition-colors ${dimensions.text} ${textColor}`}
            >
              ZEVIOZA
            </span>
            <span className={`rounded-full bg-[#dbb46b] ${dimensions.dot} mb-0.5`} />
          </div>
          {withTagline && (
            <span
              className={`font-body text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-semibold mt-1 ${subtextColor}`}
            >
              Haute Ethnic Couture
            </span>
          )}
        </div>
      )}
    </div>
  );
};
