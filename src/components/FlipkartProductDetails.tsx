import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, CheckCircle, Shield } from 'lucide-react';
import { Product } from '../types';

interface FlipkartProductDetailsProps {
  product: Product;
}

export const FlipkartProductDetails: React.FC<FlipkartProductDetailsProps> = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Extract specs
  const specs = product.specs || {};
  const entries: [string, string][] = [];

  if (product.fabric) entries.push(['Fabric', product.fabric]);
  if (product.weave) entries.push(['Weave / Work', product.weave]);
  if (product.color) entries.push(['Primary Color', product.color]);
  if (product.pattern) entries.push(['Pattern', product.pattern]);
  if (product.stitchingType) entries.push(['Stitching Type', product.stitchingType]);
  if (product.lehengaFabric) entries.push(['Lehenga Fabric', product.lehengaFabric]);
  if (product.choliFabric) entries.push(['Choli / Blouse Fabric', product.choliFabric]);
  if (product.dupattaFabric) entries.push(['Dupatta Fabric', product.dupattaFabric]);
  if (product.salesPackage) entries.push(['Sales Package', product.salesPackage]);
  if (product.includesBlousePiece) entries.push(['Blouse Piece', 'Included (Unstitched)']);

  // Add any custom specs
  Object.entries(specs).forEach(([k, v]) => {
    if (v && !entries.some(([existingKey]) => existingKey.toLowerCase() === k.toLowerCase())) {
      entries.push([k, String(v)]);
    }
  });

  // Fallbacks if entries are few
  if (!entries.some(([k]) => k.toLowerCase().includes('wash') || k.toLowerCase().includes('care'))) {
    entries.push(['Wash Care', 'Dry Clean Recommended for longevity and zari luster']);
  }
  if (!entries.some(([k]) => k.toLowerCase().includes('origin'))) {
    entries.push(['Country of Origin', 'India (Handcrafted in Surat)']);
  }

  return (
    <div className="mb-5 rounded-xl border border-[#debfc2]/40 bg-white overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-[#fcf9f8] hover:bg-[#f6f3f2] flex items-center justify-between text-left transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#6d0026]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#1c1b1b]">
            Product Specifications & Details
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#6d0026] font-semibold">
          <span>{isOpen ? 'Collapse' : 'All Details'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-[#debfc2]/30 space-y-3 animate-fadeIn text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {entries.map(([key, value]) => (
              <div
                key={key}
                className="p-2.5 rounded-lg bg-[#fdf9f7] border border-[#debfc2]/30 flex flex-col justify-center"
              >
                <span className="text-[10.5px] uppercase font-bold text-[#8a7174] tracking-wider mb-0.5">
                  {key}
                </span>
                <span className="font-semibold text-[#1c1b1b] text-xs">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#debfc2]/20 flex items-center justify-between text-[11px] text-[#574144] flex-wrap gap-2">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> 100% Genuine Handloom & Silk Guaranteed
            </span>
            <span className="flex items-center gap-1 text-[#891738] font-medium">
              <Shield className="w-3.5 h-3.5" /> Hand-Inspected Quality Check
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
