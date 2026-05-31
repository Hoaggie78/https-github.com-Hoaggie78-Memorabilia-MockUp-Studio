/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ApparelType = 'tshirt' | 'sweatshirt' | 'hoodie' | 'ballcap' | 'totebag';

export interface PrintArea {
  top: number;    // % from top of container
  left: number;   // % from left of container
  width: number;  // % width of container
  height: number; // % height of container
  label: string;  // e.g. "Chest Print Zone (12\" x 16\")"
}

export interface ApparelModel {
  id: string;
  type: ApparelType;
  name: string;
  description: string;
  // White garments work best for CSS tint overlay multipliers
  frontUrl: string;
  backUrl?: string;
  frontPrintArea: PrintArea;
  backPrintArea?: PrintArea;
  defaultColor: string;
  presetColors: MockupColor[];
}

export interface MockupColor {
  name: string;
  hex: string;
  isDark: boolean;
}

export type LayerType = 'image' | 'text' | 'shape';

export interface DesignLayer {
  id: string;
  type: LayerType;
  name: string;
  
  // Coordinates and dimensions
  x: number;          // % center relative to the print area bounds (0 to 100)
  y: number;          // % center relative to the print area bounds (0 to 100)
  width: number;      // % width relative to the print zone
  height: number;     // % height relative to the print zone
  rotation: number;   // Degrees (0-360)
  opacity: number;    // 0 to 1
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'luminosity';
  
  // Image properties
  src?: string;       // URL (data URL or external URL)
  colorTint?: string; // Optional overlay color tint
  aspectRatio: number;// width / height
  
  // Text properties
  text?: string;
  textColor?: string;
  fontFamily?: string;
  fontWeight?: 'normal' | 'medium' | 'bold' | 'black';
  fontStyle?: 'normal' | 'italic';
  letterSpacing?: number; // em
  lineHeight?: number;
  curve?: number;       // arc factor (0 if flat, curve degree)
  
  // Shape/Symbol properties
  shapeType?: 'badge_circle' | 'badge_shield' | 'star' | 'circle' | 'square' | 'banner' | 'accent_line';
  
  // Interaction states
  isLocked?: boolean;
}

export interface VectorPreset {
  id: string;
  category: 'graphics' | 'retro' | 'sports' | 'shapes' | 'creatives';
  name: string;
  svgPath: string;
  defaultColor: string;
  aspectRatio: number;
}

export interface FontOption {
  value: string;
  label: string;
  category: 'sans' | 'serif' | 'display' | 'mono';
}
