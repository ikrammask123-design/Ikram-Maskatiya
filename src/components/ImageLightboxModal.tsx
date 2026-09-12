import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  productName?: string;
  currentColor?: string;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  productName = '',
  currentColor = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, images.length - 1)));
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex, images.length]);

  // Handle keyboard events (Esc to close, Arrow keys to navigate)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

  const goToPrev = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleToggleZoom = () => {
    if (zoomLevel > 1) {
      handleResetZoom();
    } else {
      setZoomLevel(2);
    }
  };

  // Drag to pan when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - panPosition.x, y: e.clientY - panPosition.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      id="image-lightbox-overlay"
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col justify-between select-none animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onMouseUp={handleMouseUp}
    >
      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between p-4 sm:px-6 bg-gradient-to-b from-black/80 to-transparent z-20">
        <div className="flex flex-col text-white max-w-[70%]">
          <span className="text-xs text-white/60 tracking-wider uppercase font-medium">
            HD Zoom View • {currentIndex + 1} of {images.length}
          </span>
          <h3 className="text-sm sm:text-base font-bold truncate text-white drop-shadow-sm">
            {productName}
          </h3>
          {currentColor && (
            <span className="text-[11px] text-pink-300 font-medium">
              Shade: {currentColor}
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Zoom In / Out Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-full px-2 py-1 border border-white/20">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-1.5 text-white/80 hover:text-white disabled:opacity-40 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-white font-mono px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="p-1.5 text-white/80 hover:text-white disabled:opacity-40 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {zoomLevel > 1 && (
              <button
                onClick={handleResetZoom}
                className="p-1.5 text-white/80 hover:text-white transition-colors border-l border-white/20 ml-1 pl-2"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            id="btn-close-lightbox"
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-black transition-all backdrop-blur-md shadow-lg"
            title="Close image view (Esc)"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Center Image Stage */}
      <div
        className="relative flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-6"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onDoubleClick={handleToggleZoom}
      >
        {/* Previous Image Arrow */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-black/50 hover:bg-white text-white hover:text-black transition-all backdrop-blur-md shadow-xl active:scale-95 cursor-pointer"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* The Enlarged Image */}
        <div
          className="relative max-w-full max-h-full transition-transform duration-150 flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{
            transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
            cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
          }}
        >
          <img
            src={currentImg}
            alt={`${productName} enlarged preview`}
            className="max-h-[75vh] sm:max-h-[82vh] max-w-[92vw] sm:max-w-[85vw] object-contain rounded-xl shadow-2xl pointer-events-none"
            loading="eager"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Next Image Arrow */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-black/50 hover:bg-white text-white hover:text-black transition-all backdrop-blur-md shadow-xl active:scale-95 cursor-pointer"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Double Click Hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white/80 text-[11px] px-3 py-1 rounded-full pointer-events-none sm:block hidden border border-white/10">
          Double-click or tap zoom to enlarge • Drag to pan
        </div>
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="p-3 sm:p-4 bg-gradient-to-t from-black/90 to-transparent flex justify-center items-center gap-2 sm:gap-3 overflow-x-auto z-20 max-w-full">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setZoomLevel(1);
                setPanPosition({ x: 0, y: 0 });
                setCurrentIndex(idx);
              }}
              className={`relative w-12 h-16 sm:w-14 sm:h-20 rounded-lg overflow-hidden shrink-0 transition-all border-2 ${
                currentIndex === idx
                  ? 'border-pink-500 scale-105 ring-2 ring-pink-500/50 shadow-lg'
                  : 'border-white/30 opacity-60 hover:opacity-100 hover:border-white'
              }`}
            >
              <img
                src={img}
                alt={`Thumb ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
