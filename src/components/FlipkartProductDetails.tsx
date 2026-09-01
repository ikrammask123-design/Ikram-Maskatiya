import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, FileText, Settings, ShieldAlert, CheckCircle2, Factory } from 'lucide-react';
import { Product } from '../types';
import { extractProductDetails } from '../utils/productDetails';

interface FlipkartProductDetailsProps {
  product: Product;
}

type TabType = 'showcase' | 'specifications' | 'description' | 'manufacturing';

export const FlipkartProductDetails: React.FC<FlipkartProductDetailsProps> = ({ product }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('specifications');
  const [showAllSpecs, setShowAllSpecs] = useState<boolean>(false);

  const details = extractProductDetails(product);

  const visibleSpecs = showAllSpecs ? details.generalSpecs : details.generalSpecs.slice(0, 7);

  return (
    <div
      id={`flipkart-details-section-${product.id}`}
      className="mt-6 bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-xs"
    >
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 sm:px-5 py-3.5 bg-white hover:bg-neutral-50/80 flex items-center justify-between border-b border-[#e5e7eb] transition-colors text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-base text-[#111827] tracking-tight">
            All details
          </span>
          <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
            {details.generalSpecs.length} specs
          </span>
        </div>
        <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 transition-colors">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-5 animate-fadeIn">
          {/* Flipkart-Style Horizontal Tab Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none border-b border-neutral-100">
            <button
              type="button"
              onClick={() => setActiveTab('showcase')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'showcase'
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              Showcase
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('specifications')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'specifications'
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              Specifications
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'description'
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              Description
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('manufacturing')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'manufacturing'
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              Manufacturing & Care
            </button>
          </div>

          {/* TAB 1: SPECIFICATIONS (Flipkart Grid) */}
          {activeTab === 'specifications' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h4 className="font-bold text-sm text-[#111827] mb-2.5">
                  General Details
                </h4>

                <div className="border-t border-[#f0f0f0] divide-y divide-[#f0f0f0]">
                  {visibleSpecs.map((spec, index) => (
                    <div
                      key={index}
                      className="py-2.5 grid grid-cols-12 gap-2 text-xs items-start"
                    >
                      <span className="col-span-5 text-neutral-500 font-normal">
                        {spec.label}
                      </span>
                      <span className="col-span-7 text-[#111827] font-medium break-words">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                {details.generalSpecs.length > 7 && (
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setShowAllSpecs(!showAllSpecs)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-[#111827] hover:text-[#6d0026] bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer border border-neutral-200"
                    >
                      <span>{showAllSpecs ? 'See less' : 'See more'}</span>
                      {showAllSpecs ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SHOWCASE */}
          {activeTab === 'showcase' && (
            <div className="space-y-3 animate-fadeIn">
              <h4 className="font-bold text-sm text-[#111827] mb-2">
                Product Highlights & Assurance
              </h4>
              <div className="space-y-2 text-xs text-neutral-700">
                {details.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2 bg-neutral-50 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
                <div className="flex items-start gap-2.5 p-2 bg-[#fff8f8] rounded-lg border border-[#ffd9dd]">
                  <Sparkles className="w-4 h-4 text-[#6d0026] shrink-0 mt-0.5" />
                  <span className="text-[#6d0026] font-medium">
                    Hand-inspected authenticity guarantee with direct weaver craft heritage.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DESCRIPTION */}
          {activeTab === 'description' && (
            <div className="space-y-3 animate-fadeIn text-xs text-neutral-700 leading-relaxed">
              <h4 className="font-bold text-sm text-[#111827] mb-1">
                About this Product
              </h4>
              <p className="text-neutral-600">{product.description}</p>
              {product.weave && (
                <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200/60">
                  <span className="font-semibold text-neutral-900 block mb-0.5">
                    Weave & Craft Technique:
                  </span>
                  <p className="text-neutral-600">{product.weave}</p>
                </div>
              )}
              <div className="p-2.5 bg-[#fcf9f8] rounded-lg border border-[#debfc2]/40">
                <span className="font-semibold text-[#6d0026] block mb-0.5">
                  Styling Suggestion:
                </span>
                <p className="text-[#574144]">
                  Pair with classic jhumkas, delicate metallic heels, and an embroidered clutch for weddings, festivities, and evening parties.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: MANUFACTURING & CARE */}
          {activeTab === 'manufacturing' && (
            <div className="space-y-3 animate-fadeIn">
              <h4 className="font-bold text-sm text-[#111827] mb-2">
                Manufacturing, Packaging and Import Info
              </h4>
              <div className="border-t border-[#f0f0f0] divide-y divide-[#f0f0f0] text-xs">
                <div className="py-2.5 grid grid-cols-12 gap-2">
                  <span className="col-span-5 text-neutral-500">Generic Name</span>
                  <span className="col-span-7 text-[#111827] font-medium">{product.categoryLabel} / Ethnic Apparel</span>
                </div>
                <div className="py-2.5 grid grid-cols-12 gap-2">
                  <span className="col-span-5 text-neutral-500">Country of Origin</span>
                  <span className="col-span-7 text-[#111827] font-medium">India</span>
                </div>
                <div className="py-2.5 grid grid-cols-12 gap-2">
                  <span className="col-span-5 text-neutral-500">Brand / Manufacturer</span>
                  <span className="col-span-7 text-[#111827] font-medium">{details.brand}</span>
                </div>
                <div className="py-2.5 grid grid-cols-12 gap-2">
                  <span className="col-span-5 text-neutral-500">Net Quantity</span>
                  <span className="col-span-7 text-[#111827] font-medium">{details.contentsCount}</span>
                </div>
                <div className="py-2.5 grid grid-cols-12 gap-2">
                  <span className="col-span-5 text-neutral-500">Wash & Care</span>
                  <span className="col-span-7 text-[#111827] font-medium text-[#6d0026]">{details.washCare}</span>
                </div>
                <div className="py-2.5 grid grid-cols-12 gap-2">
                  <span className="col-span-5 text-neutral-500">Customer Support</span>
                  <span className="col-span-7 text-[#111827] font-medium">contact@zevioza.com | Toll-Free: 1800-ZEVIOZA</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
