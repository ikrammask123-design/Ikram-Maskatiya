import { Product } from '../types';

export interface ProductSpecItem {
  label: string;
  value: string;
}

export interface ProductDetailsData {
  brand: string;
  packageContains: string;
  idealFor: string;
  lengthType: string;
  brandColor: string;
  occasion: string;
  pattern: string;
  type: string;
  fabric: string;
  fit: string;
  neck: string;
  sleeve: string;
  color: string;
  contentsCount: string;
  styleCode: string;
  countryOfOrigin: string;
  manufacturer: string;
  washCare: string;
  generalSpecs: ProductSpecItem[];
  highlights: string[];
}

/**
 * Parses pipe-separated craftDetails strings (e.g. "Brand: VANKAR | Ideal For: Women | ...")
 * or falls back to intelligent extraction from standard product properties.
 */
export function extractProductDetails(product: Product): ProductDetailsData {
  const rawCraft = product.craftDetails || '';
  const parsedMap: Record<string, string> = {};

  // Parse pipe or semicolon separated key-values
  if (rawCraft.includes(':') && (rawCraft.includes('|') || rawCraft.includes(';'))) {
    const delimiter = rawCraft.includes('|') ? '|' : ';';
    const parts = rawCraft.split(delimiter);
    for (const part of parts) {
      const colIdx = part.indexOf(':');
      if (colIdx !== -1) {
        const key = part.substring(0, colIdx).trim().toLowerCase();
        const val = part.substring(colIdx + 1).trim();
        if (key && val) {
          parsedMap[key] = val;
        }
      }
    }
  }

  // Helper to lookup parsed map by key patterns
  const findValue = (...keys: string[]): string | undefined => {
    for (const k of keys) {
      const normalized = k.toLowerCase();
      for (const [mapKey, mapVal] of Object.entries(parsedMap)) {
        if (mapKey === normalized || mapKey.includes(normalized)) {
          return mapVal;
        }
      }
    }
    return undefined;
  };

  // Derive Brand
  let brand =
    findValue('brand', 'manufacturer') ||
    (product.name.toLowerCase().includes('miss chase')
      ? 'Miss Chase'
      : product.name.toLowerCase().includes('tckty')
      ? 'tckty'
      : product.name.includes('HOUSE OF SETHIA')
      ? 'HOUSE OF SETHIA'
      : product.name.includes('VANKAR')
      ? 'VANKAR'
      : product.name.includes('DARIKA')
      ? 'DARIKA'
      : product.name.includes('Varanga')
      ? 'Varanga'
      : product.name.includes('MADHURAM')
      ? 'MADHURAM'
      : product.name.includes('Styli')
      ? 'Styli'
      : product.name.includes('HITKCREATION') || product.name.includes('FAB CARE')
      ? 'HITKCREATION'
      : product.name.includes('ZIBLON')
      ? 'ZIBLON'
      : product.name.includes('Sixsigma')
      ? 'Sixsigma'
      : product.name.includes('Sandykart')
      ? 'Sandykart'
      : product.name.includes('BHOJALCREATION')
      ? 'BHOJALCREATION'
      : product.name.includes('Kedar Fab')
      ? 'Kedar Fab'
      : 'Zevioza Heritage');

  // Derive Package Contains / Sales Package
  let packageContains =
    findValue('package contains', 'sales package', 'pack of', 'contents', 'number of contents in sales package') ||
    (product.category === 'sarees'
      ? '1 Saree with Unstitched Blouse Piece'
      : product.category === 'kurtis'
      ? product.name.toLowerCase().includes('set') || product.name.toLowerCase().includes('anarkali set')
        ? '1 Kurti, 1 Palazzo/Pant, 1 Dupatta'
        : '1 Kurta'
      : product.category === 'dresses'
      ? product.name.toLowerCase().includes('lehenga') || product.name.toLowerCase().includes('choli')
        ? '1 Lehenga, 1 Choli, 1 Dupatta/Cape'
        : product.name.toLowerCase().includes('dupatta')
        ? '1 Gown Dress, 1 Dupatta'
        : '1 Dress'
      : product.category === 'accessories'
      ? product.name.toLowerCase().includes('choker')
        ? '1 Choker Necklace, 1 Pair of Jhumkas'
        : product.name.toLowerCase().includes('potli')
        ? '1 Potli Bag'
        : '1 Jewellery Item'
      : '1 Item');

  // Derive Ideal For
  const idealFor = findValue('ideal for') || 'Women';

  // Derive Length Type
  let lengthType =
    findValue('length type', 'length') ||
    (product.category === 'sarees'
      ? '5.5 m Saree + 0.8 m Blouse'
      : product.name.toLowerCase().includes('high low')
      ? 'Hip Length / High-Low'
      : product.name.toLowerCase().includes('maxi') || product.name.toLowerCase().includes('gown') || product.name.toLowerCase().includes('lehenga')
      ? 'Maxi / Floor Length'
      : product.name.toLowerCase().includes('short')
      ? 'Short / Hip Length'
      : 'Calf Length');

  // Derive Brand Color
  const brandColor =
    findValue('brand color', 'color') ||
    product.color ||
    'Multicolor';

  // Derive Occasion
  let occasion =
    findValue('occasion', 'occasions') ||
    (product.category === 'sarees' || product.category === 'bridal'
      ? 'Festive, Wedding & Party'
      : product.name.toLowerCase().includes('casual') || product.name.toLowerCase().includes('daily')
      ? 'Casual & Daily Wear'
      : product.category === 'dresses'
      ? 'Evening Party, Wedding & Festive'
      : product.category === 'accessories'
      ? 'Festive, Party & Celebrations'
      : 'Festive & Party');

  // Derive Pattern / Work
  let pattern =
    findValue('pattern', 'weave', 'surface styling', 'fashion trend') ||
    product.weave ||
    (product.name.toLowerCase().includes('embroidered')
      ? 'Embroidered'
      : product.name.toLowerCase().includes('print')
      ? 'Printed'
      : product.name.toLowerCase().includes('zari')
      ? 'Zari Weave'
      : 'Handcrafted Artisan Work');

  // Derive Type / Silhouette
  let type =
    findValue('type', 'shape', 'style') ||
    (product.category === 'sarees'
      ? 'Traditional Handloom Saree'
      : product.name.toLowerCase().includes('high low')
      ? 'High Low'
      : product.name.toLowerCase().includes('anarkali')
      ? 'Anarkali'
      : product.name.toLowerCase().includes('straight')
      ? 'Straight'
      : product.name.toLowerCase().includes('lehenga')
      ? 'Lehenga with Jacket'
      : product.name.toLowerCase().includes('cape')
      ? 'Cape Sleeve Maxi'
      : product.name.toLowerCase().includes('choker')
      ? 'Choker & Jhumka Set'
      : 'Ethnic Designer Wear');

  // Derive Fabric
  const fabric =
    findValue('fabric', 'material composition', 'material') ||
    product.fabric ||
    'Premium Blend';

  // Derive Fit
  const fit =
    findValue('fit', 'model fit') ||
    (product.category === 'sarees'
      ? 'Free Size / Draped'
      : 'Regular');

  // Derive Neck
  let neck =
    findValue('neck') ||
    (product.name.toLowerCase().includes('v neck') || product.description.toLowerCase().includes('v neck') || product.description.toLowerCase().includes('v-neck')
      ? 'V Neck'
      : product.name.toLowerCase().includes('round neck') || product.description.toLowerCase().includes('round neck')
      ? 'Round Neck'
      : product.name.toLowerCase().includes('sweetheart') || product.description.toLowerCase().includes('sweetheart')
      ? 'Sweetheart Neck'
      : product.name.toLowerCase().includes('boat neck') || product.description.toLowerCase().includes('boat neck')
      ? 'Boat Neck'
      : product.name.toLowerCase().includes('collar') || product.name.toLowerCase().includes('choker')
      ? 'Choker / Collar Neck'
      : product.category === 'sarees' || product.category === 'accessories'
      ? 'NA'
      : 'Round Neck');

  // Derive Sleeve
  let sleeve =
    findValue('sleeve', 'sleeve length', 'sleeves', 'sleeve styling') ||
    (product.name.toLowerCase().includes('cape') || product.description.toLowerCase().includes('cape')
      ? 'Cape Sleeves'
      : product.name.toLowerCase().includes('full sleeve') || product.description.toLowerCase().includes('full sleeve')
      ? 'Full Sleeve'
      : product.description.toLowerCase().includes('three-quarter') || product.description.toLowerCase().includes('3/4')
      ? 'Three-Quarter Sleeves'
      : product.description.toLowerCase().includes('sleeveless')
      ? 'Sleeveless'
      : product.category === 'sarees' || product.category === 'accessories'
      ? 'Unstitched / NA'
      : 'Full Sleeve');

  // Derive Style Code
  let styleCode =
    findValue('style code', 'style') ||
    (product.id.toUpperCase().replace(/^ZV-/, ''));

  // Number of contents
  const contentsCount =
    findValue('number of contents in sales package', 'net quantity', 'net qty', 'number of items') ||
    'Pack of 1';

  // Wash Care
  const washCare =
    findValue('fabric care', 'wash care', 'care') ||
    (fabric.toLowerCase().includes('silk') || fabric.toLowerCase().includes('georgette') || fabric.toLowerCase().includes('organza') || product.category === 'bridal'
      ? 'Dry Clean Recommended for long-lasting sheen'
      : 'Gentle Hand Wash in Cold Water with Mild Detergent');

  // Highlights / Showcase points
  const highlights = [
    `100% Genuine ${fabric} Fabric with Certified Craftsmanship`,
    `Authentic ${pattern} tailored for ${occasion}`,
    product.includesBlousePiece ? 'Includes coordinated 0.8m running blouse piece' : 'Flattering precision tailored silhouette with all-day comfort drape',
    'Pre-shrunk, skin-friendly dyes with superior color fastness',
    'Quality checked at 3 artisanal inspection points prior to dispatch',
  ];

  // Compile general specifications array matching Flipkart's clean 2-column key-value structure
  const generalSpecs: ProductSpecItem[] = [];

  // If specific lehenga specs are defined, place them first
  if (product.lehengaFabric || product.specs?.['Lehenga Fabric']) {
    generalSpecs.push({
      label: 'Lehenga Fabric',
      value: product.lehengaFabric || product.specs?.['Lehenga Fabric'] || '',
    });
  }
  if (product.choliFabric || product.specs?.['Choli Fabric']) {
    generalSpecs.push({
      label: 'Choli Fabric',
      value: product.choliFabric || product.specs?.['Choli Fabric'] || '',
    });
  }
  if (product.dupattaFabric || product.specs?.['Dupatta Fabric']) {
    generalSpecs.push({
      label: 'Dupatta Fabric',
      value: product.dupattaFabric || product.specs?.['Dupatta Fabric'] || '',
    });
  }
  if (product.stitchingType || product.specs?.['Stitching Type']) {
    generalSpecs.push({
      label: 'Stitching Type',
      value: product.stitchingType || product.specs?.['Stitching Type'] || '',
    });
  }
  if (product.pattern || product.specs?.['Pattern']) {
    generalSpecs.push({
      label: 'Pattern',
      value: product.pattern || product.specs?.['Pattern'] || pattern,
    });
  }
  if (product.salesPackage || product.specs?.['Sales Package']) {
    generalSpecs.push({
      label: 'Sales Package',
      value: product.salesPackage || product.specs?.['Sales Package'] || packageContains,
    });
  }

  generalSpecs.push(
    { label: 'Package contains', value: packageContains },
    { label: 'Brand', value: brand },
    { label: 'Ideal For', value: idealFor },
    { label: 'Length Type', value: lengthType },
    { label: 'Brand Color', value: brandColor },
    { label: 'Occasion', value: occasion },
    { label: 'Pattern', value: pattern },
    { label: 'Type', value: type },
    { label: 'Fabric', value: fabric },
    { label: 'Fit', value: fit },
  );

  if (neck && neck !== 'NA') {
    generalSpecs.push({ label: 'Neck', value: neck });
  }

  if (sleeve && sleeve !== 'NA') {
    generalSpecs.push({ label: 'Sleeve', value: sleeve });
  }

  const dressShape = findValue('dress shape', 'shape');
  if (dressShape) {
    generalSpecs.push({ label: 'Dress Shape', value: dressShape });
  }

  const suitableFor = findValue('suitable for');
  if (suitableFor) {
    generalSpecs.push({ label: 'Suitable For', value: suitableFor });
  }

  const detailPlacement = findValue('detail placement');
  if (detailPlacement) {
    generalSpecs.push({ label: 'Detail Placement', value: detailPlacement });
  }

  const beltIncluded = findValue('belt included');
  if (beltIncluded) {
    generalSpecs.push({ label: 'Belt Included', value: beltIncluded });
  }

  const fabricCare = findValue('fabric care');
  if (fabricCare) {
    generalSpecs.push({ label: 'Fabric Care', value: fabricCare });
  }

  generalSpecs.push(
    { label: 'Color', value: product.color || brandColor },
    { label: 'Number of Contents in Sales Package', value: contentsCount },
    { label: 'Style Code', value: styleCode },
    { label: 'Country of Origin', value: 'India' }
  );

  return {
    brand,
    packageContains,
    idealFor,
    lengthType,
    brandColor,
    occasion,
    pattern,
    type,
    fabric,
    fit,
    neck,
    sleeve,
    color: product.color || brandColor,
    contentsCount,
    styleCode,
    countryOfOrigin: 'India',
    manufacturer: brand,
    washCare,
    generalSpecs,
    highlights,
  };
}
