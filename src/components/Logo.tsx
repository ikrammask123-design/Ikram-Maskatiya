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
  // Strict square dimensions mapping
  const dimensions = {
    sm: { size: 28, text: 'text-base sm:text-lg', dot: 'w-1.5 h-1.5' },
    md: { size: 36, text: 'text-xl sm:text-2xl', dot: 'w-2 h-2' },
    lg: { size: 46, text: 'text-2xl sm:text-3xl', dot: 'w-2.5 h-2.5' },
    xl: { size: 58, text: 'text-3xl sm:text-4xl', dot: 'w-3 h-3' },
    '2xl': { size: 76, text: 'text-4xl sm:text-5xl', dot: 'w-3.5 h-3.5' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 select-none shrink-0 ${className}`}>
      {/* Brand Icon Artwork - Strict 1:1 Aspect Ratio Box */}
      <div
        className="shrink-0 flex items-center justify-center aspect-square overflow-hidden"
        style={{
          width: `${dimensions.size}px`,
          height: `${dimensions.size}px`,
          minWidth: `${dimensions.size}px`,
          minHeight: `${dimensions.size}px`,
        }}
      >
        <img
          src="/Gemini_Generated_Image_j96aohj96aohj96a-removebg-preview.png"
          alt="Zevioza Logo"
          width={dimensions.size}
          height={dimensions.size}
          className="w-full h-full object-contain aspect-square shrink-0 transition-transform duration-300 group-hover:scale-105"
          style={{
            aspectRatio: '1 / 1',
            objectFit: 'contain',
          }}
          loading="eager"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (!target.src.endsWith('/logo.png')) {
              target.src = '/logo.png';
            }
          }}
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col items-start leading-none shrink-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-bold tracking-wider sm:tracking-widest uppercase transition-colors whitespace-nowrap ${dimensions.text} ${textColor}`}
            >
              ZEVIOZA
            </span>
            <span className={`rounded-full bg-[#dbb46b] ${dimensions.dot} mb-0.5 shrink-0`} />
          </div>
          {withTagline && (
            <span
              className={`font-body text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase font-semibold mt-1 whitespace-nowrap ${subtextColor}`}
            >
              Haute Ethnic Couture
            </span>
          )}
        </div>
      )}
    </div>
  );
};
