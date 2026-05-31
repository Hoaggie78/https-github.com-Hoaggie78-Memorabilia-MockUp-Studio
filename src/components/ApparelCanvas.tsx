/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { 
  Move, 
  RotateCw, 
  Maximize2, 
  Trash2, 
  Grid, 
  Eye, 
  Cpu, 
  MapPin,
  Lock,
  Unlock,
  Sparkles
} from 'lucide-react';
import { ApparelModel, DesignLayer, VectorPreset } from '../types';

interface ApparelCanvasProps {
  currentModel: ApparelModel;
  selectedColor: string;
  layers: DesignLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<DesignLayer>) => void;
  onDeleteLayer: (id: string) => void;
  activeView: 'editorial' | 'blueprint';
  onChangeView: (view: 'editorial' | 'blueprint') => void;
}

export default function ApparelCanvas({
  currentModel,
  selectedColor,
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
  activeView,
  onChangeView
}: ApparelCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const printZoneRef = useRef<HTMLDivElement>(null);
  
  // Interaction tracking states
  const [activeAction, setActiveAction] = useState<'dragging' | 'resizing' | 'rotating' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialLayerState, setInitialLayerState] = useState<{ x: number, y: number, width: number, height: number, rotation: number } | null>(null);
  const [showGuides, setShowGuides] = useState(true);

  // Deselect on clicking empty canvas space
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || e.target === printZoneRef.current) {
      onSelectLayer(null);
    }
  };

  // Drag-and-placement event handlers using pure browser Pointer Events (super responsive on mobile + desktop!)
  const handlePointerDown = (
    e: React.PointerEvent,
    layerId: string,
    action: 'dragging' | 'resizing' | 'rotating'
  ) => {
    e.stopPropagation();
    
    const layer = layers.find(l => l.id === layerId);
    if (!layer || layer.isLocked) return;

    onSelectLayer(layerId);
    setActiveAction(action);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialLayerState({
      x: layer.x,
      y: layer.y,
      width: layer.width,
      height: layer.height,
      rotation: layer.rotation
    });

    // Capture the pointer to keep tracking even if the cursor wanders outside the bounding box
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeAction || !selectedLayerId || !initialLayerState || !printZoneRef.current) return;

    const layer = layers.find(l => l.id === selectedLayerId);
    if (!layer) return;

    const printBound = printZoneRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    if (activeAction === 'dragging') {
      // Convert pixel deltas to percentage bounds
      const pctDeltaX = (deltaX / printBound.width) * 100;
      const pctDeltaY = (deltaY / printBound.height) * 100;
      
      let newX = initialLayerState.x + pctDeltaX;
      let newY = initialLayerState.y + pctDeltaY;

      // Snapping to horizontal/vertical center alignment threads (snaps within 3% range)
      if (Math.abs(newX - 50) < 3.0) {
        newX = 50;
      }
      if (Math.abs(newY - 50) < 3.0) {
        newY = 50;
      }

      onUpdateLayer(selectedLayerId, {
        x: Math.max(-10, Math.min(110, newX)),
        y: Math.max(-10, Math.min(110, newY))
      });
    } 
    else if (activeAction === 'resizing') {
      // Calculate change in drag distance relative to scale factor
      const scaleMultiplier = 1 + (deltaX / printBound.width) * 2;
      const newWidth = Math.max(5, Math.min(100, initialLayerState.width * scaleMultiplier));
      const newHeight = newWidth / layer.aspectRatio;

      onUpdateLayer(selectedLayerId, {
        width: newWidth,
        height: newHeight
      });
    } 
    else if (activeAction === 'rotating') {
      // Rotate based on sweep angle from element center
      const layerCenterX = printBound.left + (layer.x / 100) * printBound.width;
      const layerCenterY = printBound.top + (layer.y / 100) * printBound.height;
      
      const angleRad = Math.atan2(e.clientY - layerCenterY, e.clientX - layerCenterX);
      const angleDeg = (angleRad * 180) / Math.PI + 90; // offset rotating angle for upright layouts
      
      onUpdateLayer(selectedLayerId, {
        rotation: Math.round((angleDeg + 360) % 360)
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeAction) {
      setActiveAction(null);
      setInitialLayerState(null);
      const target = e.currentTarget as HTMLElement;
      try {
        target.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Safe releases if already detached
      }
    }
  };

  // Custom Vector SVG Renderer backdrops where users can color every piece dynamically
  const renderVectorApparel = () => {
    const strokeCol = '#111827';
    const fillCol = selectedColor;

    switch (currentModel.type) {
      case 'tshirt':
        return (
          <svg viewBox="0 0 500 500" className="w-[450px] h-[450px] drop-shadow-lg filter transition-colors duration-300" style={{ shapeRendering: 'geometricPrecision' }}>
            {/* T-Shirt Silhouette Outline */}
            <path 
              d="M 150 70 C 180 70 200 85 250 85 C 300 85 320 70 350 70 L 440 100 L 400 190 L 360 175 L 360 440 L 140 440 L 140 175 L 100 190 L 60 100 Z" 
              fill={fillCol} 
              stroke={strokeCol} 
              strokeWidth="6" 
              strokeLinejoin="round"
            />
            {/* Sleeves stitch guides */}
            <path d="M 140 175 C 130 140 120 110 106 101" stroke={strokeCol} strokeWidth="2.5" fill="none" strokeDasharray="3,2" />
            <path d="M 360 175 C 370 140 380 110 394 101" stroke={strokeCol} strokeWidth="2.5" fill="none" strokeDasharray="3,2" />
            
            {/* Collar details */}
            <path d="M 194 71 C 210 93 290 93 306 71" stroke={strokeCol} strokeWidth="5.5" fill="none" />
            <path d="M 197 73 C 212 91 288 91 303 73" stroke={strokeCol} strokeWidth="2" fill="none" strokeDasharray="2,2"/>
            
            {/* Shading/Creases curves */}
            <path d="M 148 200 C 160 210 170 240 165 290" stroke={strokeCol} strokeWidth="2" opacity="0.15" fill="none" />
            <path d="M 352 200 C 340 210 330 240 335 290" stroke={strokeCol} strokeWidth="2" opacity="0.15" fill="none" />
            <path d="M 230 430 C 240 432 260 432 270 430" stroke={strokeCol} strokeWidth="2" opacity="0.15" fill="none" />
          </svg>
        );

      case 'sweatshirt':
        return (
          <svg viewBox="0 0 500 500" className="w-[450px] h-[450px] drop-shadow-lg filter transition-all" style={{ shapeRendering: 'geometricPrecision' }}>
            {/* Sweatshirt Outline with detailed ribs */}
            <path 
              d="M 160 80 C 190 80 210 92 250 92 C 290 92 310 80 340 80 L 450 140 L 420 400 L 380 390 L 370 430 L 130 430 L 120 390 L 80 400 L 50 140 Z" 
              fill={fillCol} 
              stroke={strokeCol} 
              strokeWidth="6.5" 
              strokeLinejoin="round"
            />
            {/* Ribbed waistband bottom */}
            <rect x="130" y="415" width="240" height="15" fill={fillCol} stroke={strokeCol} strokeWidth="3" />
            {/* Ribbed cuffs */}
            <path d="M 68 375 L 81 400" stroke={strokeCol} strokeWidth="4.5" />
            <path d="M 432 375 L 419 400" stroke={strokeCol} strokeWidth="4.5" />
            
            {/* Collar stitching */}
            <path d="M 197 81 C 210 98 290 98 303 81" stroke={strokeCol} strokeWidth="6" fill="none" />
            
            {/* Sweatshirt shoulder crease structures */}
            <path d="M 116 117 C 125 150 135 220 130 360" stroke={strokeCol} strokeWidth="2" strokeDasharray="4,2" fill="none" opacity="0.25"/>
            <path d="M 384 117 C 375 150 365 220 370 360" stroke={strokeCol} strokeWidth="2" strokeDasharray="4,2" fill="none" opacity="0.25"/>
          </svg>
        );

      case 'hoodie':
        return (
          <svg viewBox="0 0 500 500" className="w-[450px] h-[450px] drop-shadow-lg filter transition-all" style={{ shapeRendering: 'geometricPrecision' }}>
            {/* Hoodie Outline with pocket and hood hood outline */}
            <path 
              d="M 160 85 C 190 85 210 95 250 95 C 290 95 310 85 340 85 L 450 145 L 415 405 L 365 425 L 135 425 L 85 405 L 50 145 Z" 
              fill={fillCol} 
              stroke={strokeCol} 
              strokeWidth="6" 
              strokeLinejoin="round"
            />
            {/* Hood crossover fold on chest */}
            <path d="M 190 87 Q 250 140, 310 87" fill="none" stroke={strokeCol} strokeWidth="5" />
            <path d="M 180 84 C 180 30 320 30 320 84 Z" fill={fillCol} stroke={strokeCol} strokeWidth="4" />
            
            {/* Central Kangaroo pockets */}
            <path d="M 170 300 L 330 300 L 350 380 L 150 380 Z" fill={fillCol} stroke={strokeCol} strokeWidth="4.5" strokeLinejoin="round" />
            <path d="M 170 300 L 150 340 L 150 380" stroke={strokeCol} strokeWidth="4.5" fill="none"/>
            <path d="M 330 300 L 350 340 L 350 380" stroke={strokeCol} strokeWidth="4.5" fill="none"/>
            
            {/* Drawstrings dangling */}
            <path d="M 230 120 Q 235 170, 220 200" fill="none" stroke={strokeCol} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="220" cy="200" r="3.5" fill={strokeCol} />
            <path d="M 270 120 Q 265 180, 275 215" fill="none" stroke={strokeCol} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="275" cy="215" r="3.5" fill={strokeCol} />
          </svg>
        );

      case 'ballcap':
        return (
          <svg viewBox="0 0 500 500" className="w-[440px] h-[440px] drop-shadow-md filter transition-all" style={{ shapeRendering: 'geometricPrecision' }}>
            {/* Baseball cap profile views */}
            {/* Visor shield */}
            <path d="M 110 340 C 130 380 370 380 390 340" fill={fillCol} stroke={strokeCol} strokeWidth="6" strokeLinejoin="round" />
            <path d="M 130 345 C 160 375 340 375 370 345" stroke={strokeCol} strokeWidth="2.5" fill="none" strokeDasharray="4,2"/>
            
            {/* Back adjustment loop */}
            {/* Crown dome */}
            <path d="M 150 338 C 120 180 380 180 350 338 Z" fill={fillCol} stroke={strokeCol} strokeWidth="6" />
            
            {/* Six panels segment lines */}
            <path d="M 250 185 Q 210 260, 152 332" fill="none" stroke={strokeCol} strokeWidth="3" opacity="0.6"/>
            <path d="M 250 185 Q 250 260, 250 340" fill="none" stroke={strokeCol} strokeWidth="3" opacity="0.6"/>
            <path d="M 250 185 Q 290 260, 348 332" fill="none" stroke={strokeCol} strokeWidth="3" opacity="0.6"/>
            
            {/* Top eyelet buttons */}
            <circle cx="250" cy="180" r="10" fill={fillCol} stroke={strokeCol} strokeWidth="4.5" />
            <circle cx="205" cy="245" r="3" fill={strokeCol} />
            <circle cx="295" cy="245" r="3" fill={strokeCol} />
          </svg>
        );

      case 'totebag':
        return (
          <svg viewBox="0 0 500 500" className="w-[455px] h-[455px] drop-shadow-md filter transition-all" style={{ shapeRendering: 'geometricPrecision' }}>
            {/* Classic canvas tote bag */}
            {/* Double shoulder straps */}
            <path d="M 190 220 L 190 70 C 190 50 310 50 310 70 L 310 220" fill="none" stroke={strokeCol} strokeWidth="7.5" strokeLinecap="round"/>
            <path d="M 190 220 L 190 100 C 200 90 300 90 310 100 L 310 220" fill="none" stroke={strokeCol} strokeWidth="4" strokeLinecap="round" opacity="0.75"/>
            
            {/* Bag square body block */}
            <path d="M 120 220 L 380 220 L 360 450 L 140 450 Z" fill={fillCol} stroke={strokeCol} strokeWidth="6.5" strokeLinejoin="round" />
            
            {/* Strap stitching mount boxes */}
            <rect x="180" y="220" width="20" height="25" fill="none" stroke={strokeCol} strokeWidth="3" />
            <path d="M 180 220 L 200 245 M 200 220 L 180 245" stroke={strokeCol} strokeWidth="2.5" />
            <rect x="300" y="220" width="20" height="25" fill="none" stroke={strokeCol} strokeWidth="3" />
            <path d="M 300 220 L 320 245 M 320 220 L 300 245" stroke={strokeCol} strokeWidth="2.5" />
            
            {/* Side canvas folding texture creases */}
            <path d="M 148 240 Q 250 250, 352 240" stroke={strokeCol} strokeWidth="2" opacity="0.15" fill="none" />
            <path d="M 140 220 L 149 443" stroke={strokeCol} strokeWidth="1.5" opacity="0.35" fill="none" strokeDasharray="3,3" />
            <path d="M 360 220 L 351 443" stroke={strokeCol} strokeWidth="1.5" opacity="0.35" fill="none" strokeDasharray="3,3" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div id="canvas-main-viewport" className="flex-1 bg-gray-100 flex flex-col h-full overflow-hidden relative">
      
      {/* Control Toolbar Top Header bar */}
      <div className="flex items-center justify-between px-6 py-4.5 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-2 rounded-xl">
            <Grid className="w-4.5 h-4.5 text-gray-700" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-900 tracking-wider uppercase">Interactive Design Studio</h2>
            <p className="text-[10px] font-mono text-gray-400 uppercase mt-0.5">
              Target: {currentModel.name}
            </p>
          </div>
        </div>

        {/* Studio utilities: switches */}
        <div className="flex items-center gap-3">
          {/* Guide Snaps line view togglers */}
          <button
            id="toggle-guides-guide"
            onClick={() => setShowGuides(!showGuides)}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
              showGuides 
                ? 'bg-gray-900 text-white border-gray-950 shadow-2xs' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Print Guides
          </button>

          {/* Model toggle buttons */}
          <div className="bg-gray-50/70 p-1 rounded-xl border border-gray-150 flex gap-0.5">
            <button
              id="view-switch-editorial"
              onClick={() => onChangeView('editorial')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'editorial' 
                  ? 'bg-white text-gray-900 shadow-2xs font-bold' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              📸 Photo
            </button>
            <button
              id="view-switch-blueprint"
              onClick={() => onChangeView('blueprint')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'blueprint' 
                  ? 'bg-white text-gray-900 shadow-2xs font-bold' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              🎨 Vector
            </button>
          </div>
        </div>
      </div>

      {/* Main Sandbox Drop Area */}
      <div 
        ref={containerRef}
        onClick={handleCanvasClick}
        onPointerMove={handlePointerMove}
        className="flex-1 overflow-auto flex items-center justify-center p-8 relative cursor-default select-none"
      >
        {/* Helper Center Alignment snapping markers lines (Guides visible if dragging near center) */}
        {showGuides && activeAction === 'dragging' && (
          <>
            {/* Center Vertical guide line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] border-l border-dashed border-sky-400 pointer-events-none z-30" />
            {/* Center Horizontal guide line */}
            <div className="absolute left-0 right-0 top-1/2 h-[1px] border-t border-dashed border-sky-400 pointer-events-none z-30" />
          </>
        )}

        {/* The Outer Studio Sandbox Container Frame (Always 3:4 portrait or proportional canvas card block) */}
        <div 
          id="visual-mockup-frame" 
          className="relative w-[480px] h-[580px] bg-white rounded-3xl shadow-xl flex items-center justify-center overflow-hidden border border-gray-150/80 transition-all duration-300"
          style={{
            // When in user selected Hex color, we can slightly tint the backdrop of the Editorial photo if needed! But default to clean studio background.
          }}
        >
          {/* VIEWPORT CANVAS DECK A: EDITORIAL PHOTOS (Using photorealistic models with CSS fabric adjustments) */}
          {activeView === 'editorial' ? (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center p-2 transition-all">
              {/* If white shirt image is loaded, we can tint the color underneath if the garment represents transparency or just display photorealistic card */}
              <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                <img
                  src={currentModel.frontUrl}
                  alt={currentModel.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform"
                  style={{
                    // Special visual tinting filters using color-presets!
                    // If the user chooses black/charcoal/navy, we apply realistic hue-rotate, brightness, or contrasts to simulate deep cotton textures!
                    // This creates an extraordinary natural clothing render!
                    filter: selectedColor === '#FFFFFF' 
                      ? 'none' 
                      : selectedColor === '#111827'
                      ? 'brightness(0.18) contrast(1.1) saturate(0.2)'
                      : selectedColor === '#374151'
                      ? 'brightness(0.35) contrast(1.05) saturate(0.2)'
                      : selectedColor === '#D1D5DB'
                      ? 'brightness(0.85) contrast(0.95) saturate(0.1)'
                      : selectedColor === '#1E3A8A'
                      ? 'sepia(0.6) hue-rotate(185deg) brightness(0.4) saturate(2.4)'
                      : selectedColor === '#064E3B'
                      ? 'sepia(0.5) hue-rotate(90deg) brightness(0.28) saturate(1.8)'
                      : selectedColor === '#701A1A'
                      ? 'sepia(0.7) hue-rotate(310deg) brightness(0.35) saturate(2.0)'
                      : selectedColor === '#F3E5D8'
                      ? 'sepia(0.2) hue-rotate(10deg) brightness(0.9) saturate(0.7)'
                      : selectedColor === '#D97706'
                      ? 'sepia(0.7) hue-rotate(15deg) brightness(0.75) saturate(2.5)'
                      : selectedColor === '#EC4899'
                      ? 'sepia(0.5) hue-rotate(290deg) brightness(0.8) saturate(2.2)'
                      : 'none' // fallbacks
                  }}
                />
                
                {/* Vintage dark vignetting for photo frames */}
                <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent to-black/5" />
              </div>
            </div>
          ) : (
            /* VIEWPORT CANVAS DECK B: VECTOR DESIGN BLUEPRINT (Extremely precise vector contours) */
            <div 
              style={{ backgroundColor: '#F8FAFC' }}
              className="absolute inset-0 w-full h-full flex items-center justify-center transition-all"
            >
              {renderVectorApparel()}
            </div>
          )}

          {/* PRINT AREA BOUNDING BOX (Aligned dynamically based on % parameters in types.ts) */}
          <div
            ref={printZoneRef}
            id="print-zone-frame"
            className={`absolute border transition-colors z-20 ${
              showGuides 
                ? 'border-dashed border-gray-400 bg-black/[0.015]' 
                : 'border-transparent bg-none'
            }`}
            style={{
              top: `${currentModel.frontPrintArea.top}%`,
              left: `${currentModel.frontPrintArea.left}%`,
              width: `${currentModel.frontPrintArea.width}%`,
              height: `${currentModel.frontPrintArea.height}%`,
            }}
          >
            {/* Safe printing labels inside */}
            {showGuides && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] uppercase font-bold text-gray-400 font-mono tracking-wider bg-white px-2 py-0.5 rounded border border-gray-150 shadow-3xs flex items-center gap-1 select-none pointer-events-none whitespace-nowrap">
                <MapPin className="w-2.5 h-2.5 text-blue-500" />
                {currentModel.frontPrintArea.label}
              </div>
            )}

            {/* RENDER ACTIVE PRINTING DESIGN LAYERS STACK */}
            {layers.map((layer) => {
              const isSelected = selectedLayerId === layer.id;
              
              return (
                <div
                  key={layer.id}
                  id={`design-layer-instance-${layer.id}`}
                  onPointerDown={(e) => handlePointerDown(e, layer.id, 'dragging')}
                  className={`absolute group select-none pointer-events-auto leading-none ${
                    isSelected ? 'z-40' : 'z-30 cursor-grab hover:ring-2 hover:ring-emerald-300 rounded'
                  }`}
                  style={{
                    left: `${layer.x}%`,
                    top: `${layer.y}%`,
                    width: `${layer.width}%`,
                    transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                    opacity: layer.opacity,
                    // Advanced color blending styles!
                    // Normal = standard print overlay
                    // Multiply = screenprint inks blending on white fabric
                    // Screen = light ink prints on black hoodie
                    mixBlendMode: layer.blendMode,
                    transition: activeAction ? 'none' : 'transform 75ms ease-out',
                  }}
                >
                  {/* Layer Selection Box Overlay Frame */}
                  {isSelected && showGuides && (
                    <div className="absolute -inset-2.5 border-2 border-emerald-500 rounded-lg pointer-events-none">
                      {/* Active Label coordinate indicator */}
                      <span className="absolute -bottom-5 right-0 bg-emerald-600 font-semibold text-white font-mono text-[8.5px] px-1 rounded shadow-3xs pointer-events-none">
                        X:{Math.round(layer.x)}% Y:{Math.round(layer.y)}%
                      </span>
                    </div>
                  )}

                  {/* ACTIVE MULTI-MODAL CONTENT */}
                  {layer.type === 'image' && (
                    <img
                      src={layer.src}
                      alt={layer.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto select-none pointer-events-none blocker"
                      style={{ 
                        display: 'block',
                        // If color tints are selected on png, we can blend filters
                      }}
                    />
                  )}

                  {layer.type === 'text' && (
                    <div 
                      className="w-full text-center whitespace-normal select-none pointer-events-none"
                      style={{
                        fontFamily: `${layer.fontFamily}, sans-serif`,
                        fontSize: '32px', // fallback base height
                        fontWeight: layer.fontWeight || 'bold',
                        fontStyle: layer.fontStyle || 'normal',
                        color: layer.textColor || '#000000',
                        letterSpacing: `${layer.letterSpacing || 0}em`,
                        lineHeight: layer.lineHeight || 1.1,
                      }}
                    >
                      {layer.text}
                    </div>
                  )}

                  {layer.type === 'shape' && layer.src && (
                    /* Preset Vector Badge shapes elements with real-time fillColor mapping */
                    <div 
                      className="w-full text-current select-none pointer-events-none"
                      style={{ color: layer.textColor || '#111827' }}
                      dangerouslySetInnerHTML={{ __html: layer.src }}
                    />
                  )}

                  {/* ROTATE, SCALE AND DELETE CONTROL HANDLE BUBBLES (Only visible if item is selected and not locked!) */}
                  {isSelected && showGuides && !layer.isLocked && (
                    <>
                      {/* Trash Delete Bubble (Top-left handle corner) */}
                      <button
                        id={`delete-handle-${layer.id}`}
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          onDeleteLayer(layer.id);
                        }}
                        className="absolute -top-5 -left-5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-650 text-white flex items-center justify-center shadow-md border border-white cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                        title="Remove Design Layer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Rotate Drag Bubble (Top-right handle corner) */}
                      <div
                        id={`rotate-handle-${layer.id}`}
                        onPointerDown={(e) => handlePointerDown(e, layer.id, 'rotating')}
                        onPointerUp={handlePointerUp}
                        className="absolute -top-5 -right-5 w-6 h-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md border border-white cursor-grab hover:scale-110 active:scale-95 transition-transform"
                        title="Rotate Overlay"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </div>

                      {/* Scale Resize Drag Bubble (Bottom-right handle corner) */}
                      <div
                        id={`resize-handle-${layer.id}`}
                        onPointerDown={(e) => handlePointerDown(e, layer.id, 'resizing')}
                        onPointerUp={handlePointerUp}
                        className="absolute -bottom-5 -right-5 w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-md border border-white cursor-se-resize hover:scale-110 active:scale-95 transition-transform"
                        title="Scale Dimensions"
                      >
                        <Maximize2 className="w-3.5 h-3.5 rotate-90" />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid Coordinates Footer Ribbon bar */}
      <div className="px-6 py-3 bg-white border-t border-gray-200 flex items-center justify-between text-[11px] font-mono text-gray-400 uppercase">
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-gray-500" /> Active Overlays: {layers.length}
        </span>
        {selectedLayerId ? (
          <span className="text-emerald-600 font-bold flex items-center gap-1.5 animate-pulse">
            <Cpu className="w-3.5 h-3.5" /> Adjusting Selected Layer
          </span>
        ) : (
          <span>Drag elements directly on canvas to reposition</span>
        )}
      </div>
    </div>
  );
}
