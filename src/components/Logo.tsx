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
      {/* Brand Icon Artwork from uploaded Gemini_Generated_Image_j96aohj96aohj96a-removebg-preview.png */}
      <img
        src="/Gemini_Generated_Image_j96aohj96aohj96a-removebg-preview.png"
        alt="Zevioza Logo"
        width={dimensions.icon}
        height={dimensions.icon}
        className="flex-shrink-0 object-contain transition-transform duration-300 group-hover:scale-105"
        style={{
          height: `${dimensions.icon}px`,
          width: 'auto',
          maxHeight: `${dimensions.icon}px`,
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
