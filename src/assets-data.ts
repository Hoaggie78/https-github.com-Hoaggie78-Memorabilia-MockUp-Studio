/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApparelModel, MockupColor, VectorPreset, FontOption } from './types';

export const REFRESH_COOLDOWN_MS = 1000;

export const COLOR_PRESETS: MockupColor[] = [
  { name: 'Studio White', hex: '#FFFFFF', isDark: false },
  { name: 'Core Black', hex: '#111827', isDark: true },
  { name: 'Heather Gray', hex: '#D1D5DB', isDark: false },
  { name: 'Charcoal', hex: '#374151', isDark: true },
  { name: 'Deep Navy', hex: '#1E3A8A', isDark: true },
  { name: 'Forest Green', hex: '#064E3B', isDark: true },
  { name: 'Rich Burgundy', hex: '#701A1A', isDark: true },
  { name: 'Desert Sand', hex: '#F3E5D8', isDark: false },
  { name: 'Mustard Gold', hex: '#D97706', isDark: false },
  { name: 'Dusty Pink', hex: '#EC4899', isDark: false },
];

export const GOOGLE_FONTS: FontOption[] = [
  { value: 'Inter', label: 'Inter (Modern Sans)', category: 'sans' },
  { value: 'Space Grotesk', label: 'Space Grotesk (Tech Display)', category: 'display' },
  { value: 'Playfair Display', label: 'Playfair (Classic Serif)', category: 'serif' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono (Sleek Mono)', category: 'mono' },
  { value: 'Cinzel', label: 'Cinzel (Elegant Roman)', category: 'serif' },
  { value: 'Cabinet Grotesk', label: 'Cabinet (Bold Swiss)', category: 'display' },
  { value: 'Bangers', label: 'Bangers (Vintage Comic)', category: 'display' },
  { value: 'Pacifico', label: 'Pacifico (Retro Script)', category: 'creatives' as any },
];

// Rich, stunning SVG Vector Paths for Stamps/Badges so users can decorate instantly
export const DESIGN_PRESETS: VectorPreset[] = [
  {
    id: 'surf-badge',
    category: 'retro',
    name: 'Pacific Surf Coast',
    aspectRatio: 1,
    defaultColor: '#1E3A8A',
    svgPath: `
      <g>
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" stroke-width="6"/>
        <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4,4"/>
        <!-- Waves -->
        <path d="M 40 100 Q 70 80, 100 100 T 160 100" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
        <path d="M 50 120 Q 75 105, 100 120 T 150 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <!-- Sun -->
        <circle cx="100" cy="70" r="22" fill="none" stroke="currentColor" stroke-width="4"/>
        <line x1="100" y1="36" x2="100" y2="44" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <line x1="100" y1="96" x2="100" y2="104" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <line x1="66" y1="70" x2="74" y2="70" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <line x1="126" y1="70" x2="134" y2="70" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <!-- Typography -->
        <path id="curve-top" d="M 35 100 A 65 65 0 0 1 165 100" fill="none" stroke="none"/>
        <path id="curve-bottom" d="M 165 100 A 65 65 0 0 1 35 100" fill="none" stroke="none"/>
        <text font-family="Inter, sans-serif" font-size="12" font-weight="900" letter-spacing="4" fill="currentColor">
          <textPath href="#curve-top" startOffset="50%" text-anchor="middle">PACIFIC COAST</textPath>
        </text>
        <text font-family="Inter, sans-serif" font-size="11" font-weight="900" letter-spacing="4" fill="currentColor">
          <textPath href="#curve-bottom" startOffset="50%" text-anchor="middle">EST. 1984</textPath>
        </text>
      </g>
    `
  },
  {
    id: 'mountain-adventure',
    category: 'graphics',
    name: 'Wilderness Summit',
    aspectRatio: 1,
    defaultColor: '#064E3B',
    svgPath: `
      <g>
        <polygon points="100,50 145,130 55,130" fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/>
        <polygon points="100,75 125,120 75,120" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
        <path d="M 100,50 L 100,130" stroke="currentColor" stroke-width="2" stroke-dasharray="3,3"/>
        <circle cx="140" cy="65" r="12" fill="none" stroke="currentColor" stroke-width="4"/>
        {/* Pine trees */}
        <polygon points="65,130 60,115 70,115" fill="currentColor"/>
        <polygon points="135,130 130,110 140,110" fill="currentColor"/>
        {/* Banner */}
        <rect x="40" y="140" width="120" height="24" rx="4" fill="none" stroke="currentColor" stroke-width="4"/>
        <text x="100" y="156" font-family="monospace" font-size="11" font-weight="bold" fill="currentColor" text-anchor="middle" letter-spacing="1">
          STAY WILD
        </text>
      </g>
    `
  },
  {
    id: 'retro-badge',
    category: 'creatives',
    name: 'Retro Cafe',
    aspectRatio: 1,
    defaultColor: '#D97706',
    svgPath: `
      <g>
        <polygon points="100,20 180,60 180,140 100,180 20,140 20,60" fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/>
        <polygon points="100,28 170,63 170,135 100,170 30,135 30,63" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-dasharray="4,4"/>
        <text x="100" y="70" font-family="'Playfair Display', serif" font-size="14" font-weight="900" fill="currentColor" text-anchor="middle" letter-spacing="3">
          VINTAGE
        </text>
        <line x1="45" y1="85" x2="155" y2="85" stroke="currentColor" stroke-width="3"/>
        <text x="100" y="115" font-family="'Space Grotesk', sans-serif" font-size="28" font-weight="bold" fill="currentColor" text-anchor="middle" letter-spacing="1">
          ROAST
        </text>
        <line x1="45" y1="128" x2="155" y2="128" stroke="currentColor" stroke-width="3"/>
        <text x="100" y="152" font-family="monospace" font-size="12" font-weight="900" fill="currentColor" text-anchor="middle" letter-spacing="5">
          COFFEE
        </text>
      </g>
    `
  },
  {
    id: 'varsity-athletic',
    category: 'sports',
    name: 'Varsity Athletics',
    aspectRatio: 1.25,
    defaultColor: '#701A1A',
    svgPath: `
      <g>
        <text x="100" y="90" font-family="Bangers, Impact, sans-serif" font-size="85" font-weight="900" fill="currentColor" text-anchor="middle">
          M
        </text>
        <text x="100" y="115" font-family="Inter, sans-serif" font-size="13" font-weight="900" fill="currentColor" text-anchor="middle" letter-spacing="8">
          CHAMPION
        </text>
        <path d="M 30,130 L 170,130" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
        <path d="M 50,138 L 150,138" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </g>
    `
  }
];

export const APPAREL_MODELS: ApparelModel[] = [
  {
    id: 'tshirt',
    type: 'tshirt',
    name: 'Premium Cotton T-Shirt',
    description: 'Classic crewneck heavy heavyweight t-shirt mockup with a structured double-stitched collar.',
    frontUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    backUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', // We can mirror or reuse with tag
    defaultColor: '#FFFFFF',
    frontPrintArea: {
      top: 24,
      left: 30,
      width: 40,
      height: 48,
      label: 'Standard Chest Print Area (12" x 16")'
    },
    backPrintArea: {
      top: 22,
      left: 28,
      width: 44,
      height: 52,
      label: 'Back Plate Print Area (14" x 18")'
    },
    presetColors: COLOR_PRESETS,
  },
  {
    id: 'sweatshirt',
    type: 'sweatshirt',
    name: 'Heavy Crew Sweatshirt',
    description: 'Relaxed fit fleece crewneck with thick ribbed finishes at collar, cuffs, and bottom hem.',
    frontUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    defaultColor: '#FFFFFF',
    frontPrintArea: {
      top: 25,
      left: 28,
      width: 44,
      height: 44,
      label: 'Sweatshirt Plate Zone (13" x 13")'
    },
    presetColors: COLOR_PRESETS,
  },
  {
    id: 'hoodie',
    type: 'hoodie',
    name: 'Over-sized Streetwear Hoodie',
    description: 'Thick heavy pullover hoodie with dropped shoulders and double-lined central hood structure.',
    frontUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
    defaultColor: '#D1D5DB', // heather gray
    frontPrintArea: {
      top: 35,
      left: 32,
      width: 36,
      height: 30,
      label: 'Hoodie Chest Zone (12" x 10" - Above Pocket)'
    },
    presetColors: COLOR_PRESETS,
  },
  {
    id: 'ballcap',
    type: 'ballcap',
    name: 'Classic Twill Ballcap',
    description: 'Structured 6-panel canvas baseball cap with matching eyelets and curved visor.',
    frontUrl: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80',
    defaultColor: '#FFFFFF',
    frontPrintArea: {
      top: 36,
      left: 35,
      width: 30,
      height: 20,
      label: 'Cap Panel Center Zone (5.5" x 2.75")'
    },
    presetColors: COLOR_PRESETS,
  },
  {
    id: 'totebag',
    type: 'totebag',
    name: 'Organic Canvas Tote Bag',
    description: 'Flat-lying heavy canvas utility shopping bag with box-stitched matching dual handles.',
    frontUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    defaultColor: '#FFFFFF',
    frontPrintArea: {
      top: 22,
      left: 24,
      width: 52,
      height: 52,
      label: 'Tote Canvas Zone (11" x 11")'
    },
    presetColors: COLOR_PRESETS,
  }
];
