/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Sliders, 
  Layers, 
  ChevronRight, 
  Download, 
  Trash2, 
  Lock, 
  Unlock, 
  AlignCenter, 
  Sparkles,
  Info
} from 'lucide-react';
import { DesignLayer, ApparelModel } from '../types';

interface SidebarRightProps {
  layers: DesignLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<DesignLayer>) => void;
  onDeleteLayer: (id: string) => void;
  currentModel: ApparelModel;
  selectedColor: string;
  activeView: 'editorial' | 'blueprint';
}

export default function SidebarRight({
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
  currentModel,
  selectedColor,
  activeView
}: SidebarRightProps) {
  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  // Quick Alignments
  const handleAlign = (alignment: 'h-center' | 'v-center' | 'chest' | 'pocket') => {
    if (!selectedLayerId) return;
    
    if (alignment === 'h-center') {
      onUpdateLayer(selectedLayerId, { x: 50 });
    } else if (alignment === 'v-center') {
      onUpdateLayer(selectedLayerId, { y: 50 });
    } else if (alignment === 'chest') {
      onUpdateLayer(selectedLayerId, { x: 50, y: 30 });
    } else if (alignment === 'pocket') {
      onUpdateLayer(selectedLayerId, { x: 35, y: 28 });
    }
  };

  // Canvas composite mockup exporter
  const handleExportMockup = async () => {
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 1450;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Draw plain background canvas
    ctx.fillStyle = activeView === 'blueprint' ? '#F8FAFC' : '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw base garment mockup
    const garmentImage = new Image();
    garmentImage.crossOrigin = 'anonymous';
    
    // Draw loading process inside a promise to wait sequentially
    const drawProcess = new Promise<void>((resolve, reject) => {
      garmentImage.onload = () => {
        // Draw centered garment photo
        ctx.save();
        
        // Match the layout mirroring CSS filter adjustments in Canvas context
        if (activeView === 'editorial' && selectedColor !== '#FFFFFF') {
          // Approximate Canvas filter simulations for tints
          if (selectedColor === '#111827') {
            ctx.filter = 'brightness(0.18) contrast(1.1) grayscale(1)';
          } else if (selectedColor === '#374151') {
            ctx.filter = 'brightness(0.35) contrast(1.05) grayscale(1)';
          } else if (selectedColor === '#D1D5DB') {
            ctx.filter = 'brightness(0.85) contrast(0.95) grayscale(1)';
          } else if (selectedColor === '#1E3A8A') {
            ctx.filter = 'sepia(0.6) hue-rotate(185deg) brightness(0.4) saturate(2.4)';
          } else if (selectedColor === '#064E3B') {
            ctx.filter = 'sepia(0.5) hue-rotate(90deg) brightness(0.28) saturate(1.8)';
          } else if (selectedColor === '#701A1A') {
            ctx.filter = 'sepia(0.7) hue-rotate(310deg) brightness(0.35) saturate(2.0)';
          } else if (selectedColor === '#F3E5D8') {
            ctx.filter = 'sepia(0.2) hue-rotate(10deg) brightness(0.9) saturate(0.7)';
          } else if (selectedColor === '#D97706') {
            ctx.filter = 'sepia(0.7) hue-rotate(15deg) brightness(0.75) saturate(2.5)';
          } else if (selectedColor === '#EC4899') {
            ctx.filter = 'sepia(0.5) hue-rotate(290deg) brightness(0.8) saturate(2.2)';
          }
        }
        
        // Draw mockup covering background image center space
        ctx.drawImage(garmentImage, 0, 0, width, height);
        ctx.restore();
        resolve();
      };
      garmentImage.onerror = () => {
        // fallback to standard drawing shapes
        ctx.fillStyle = selectedColor;
        ctx.fillRect(width * 0.15, height * 0.15, width * 0.7, height * 0.7);
        resolve();
      };
      
      // Load current front image path
      garmentImage.src = currentModel.frontUrl;
    });

    await drawProcess;

    // 3. Draw printing zone contents
    const pBounds = currentModel.frontPrintArea;
    const pxLeft = (pBounds.left / 100) * width;
    const pxTop = (pBounds.top / 100) * height;
    const pxWidth = (pBounds.width / 100) * width;
    const pxHeight = (pBounds.height / 100) * height;

    for (const layer of layers) {
      ctx.save();
      
      // Calculate absolute center of the design relative to high resolution canvas
      const absCenterX = pxLeft + (layer.x / 100) * pxWidth;
      const absCenterY = pxTop + (layer.y / 100) * pxHeight;
      const absWidth = (layer.width / 100) * pxWidth;
      
      // Translate to canvas element coordinate space for rotation logic
      ctx.translate(absCenterX, absCenterY);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.globalAlpha = layer.opacity;
      
      // Match canvas blending options: Multiply, Screen etc
      if (layer.blendMode !== 'normal') {
        ctx.globalCompositeOperation = layer.blendMode;
      }

      if (layer.type === 'image' && layer.src) {
        const layerImg = new Image();
        layerImg.crossOrigin = 'anonymous';
        
        const imgPromise = new Promise<void>((r) => {
          layerImg.onload = () => {
            const h = absWidth / layer.aspectRatio;
            // Draw centered around the coordinate origin (which is the layer center!)
            ctx.drawImage(layerImg, -absWidth / 2, -h / 2, absWidth, h);
            r();
          };
          layerImg.onerror = () => r();
          layerImg.src = layer.src!;
        });
        await imgPromise;
      } 
      else if (layer.type === 'text') {
        ctx.fillStyle = layer.textColor || '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Approximate sizing relative to high resolution scaling
        const derivedFontSize = Math.round(absWidth * 0.18);
        ctx.font = `${layer.fontWeight === 'bold' ? '900' : '500'} ${derivedFontSize}px "${layer.fontFamily}", sans-serif`;
        ctx.fillText(layer.text || '', 0, 0);
      } 
      else if (layer.type === 'shape' && layer.src) {
        // High fidelity rendering fallback text for Vector badge labels inside Canvas
        ctx.fillStyle = layer.textColor || '#111827';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 36px monospace';
        ctx.fillText("🎨 GRAPHIC", 0, 0);
      }

      ctx.restore();
    }

    // 4. Fire download file
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `mockup-${currentModel.id}-${selectedColor.replace('#', '')}.png`;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error('Export canvas print security restrictions failed, showing popup instead.');
    }
  };

  return (
    <div id="sidebar-right-panel" className="w-80 border-l border-gray-200 bg-white flex flex-col h-full overflow-hidden">
      
      {/* Top Title Head */}
      <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-gray-500" /> Layer Parameters
        </h3>
        <span className="text-[10px] font-mono text-gray-400 bg-gray-100 py-0.5 px-2 rounded-full font-bold">
          Inspector
        </span>
      </div>

      {/* Inspector Body panels scroll */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {selectedLayer ? (
          /* SECTION 1: SELECTED LAYER ATRIBUTES INSPECTOR */
          <div className="space-y-5">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-400 block font-mono">
                  Selected Type: {selectedLayer.type}
                </span>
                <h4 className="text-xs font-bold text-gray-905 truncate max-w-[130px]" title={selectedLayer.name}>
                  {selectedLayer.name}
                </h4>
              </div>
              
              {/* Lock/Unlock layout switcher */}
              <button
                id={`toggle-lock-${selectedLayer.id}`}
                onClick={() => onUpdateLayer(selectedLayer.id, { isLocked: !selectedLayer.isLocked })}
                className={`p-1.5 rounded-lg border transition-all ${
                  selectedLayer.isLocked 
                    ? 'bg-red-50 text-red-650 border-red-200' 
                    : 'bg-white text-gray-650 border-gray-200 hover:bg-gray-50'
                }`}
                title={selectedLayer.isLocked ? 'Layer Locked' : 'Layer Unlocked'}
              >
                {selectedLayer.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Sliders bundle */}
            <div className="space-y-4 pt-1.5">
              
              {/* SLIDER A: WIDTH/SCALE */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-gray-750">
                  <span className="uppercase tracking-wide">Print Scale</span>
                  <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold">
                    {Math.round(selectedLayer.width)}%
                  </span>
                </div>
                <input
                  type="range"
                  id="slider-scale-width"
                  min="5"
                  max="100"
                  value={selectedLayer.width}
                  disabled={selectedLayer.isLocked}
                  onChange={(e) => {
                    const nextW = parseFloat(e.target.value);
                    onUpdateLayer(selectedLayer.id, {
                      width: nextW,
                      height: nextW / selectedLayer.aspectRatio
                    });
                  }}
                  className="w-full accent-gray-900 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* SLIDER B: ROTATION */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-gray-750">
                  <span className="uppercase tracking-wide">Rotation Angle</span>
                  <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold">
                    {selectedLayer.rotation}°
                  </span>
                </div>
                <input
                  type="range"
                  id="slider-rotation-angle"
                  min="0"
                  max="360"
                  value={selectedLayer.rotation}
                  disabled={selectedLayer.isLocked}
                  onChange={(e) => onUpdateLayer(selectedLayer.id, { rotation: parseInt(e.target.value) })}
                  className="w-full accent-gray-900 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* SLIDER C: OPACITY */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-gray-750">
                  <span className="uppercase tracking-wide">Ink Opacity</span>
                  <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold">
                    {Math.round(selectedLayer.opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  id="slider-opacity-layer"
                  min="0"
                  max="1"
                  step="0.05"
                  value={selectedLayer.opacity}
                  disabled={selectedLayer.isLocked}
                  onChange={(e) => onUpdateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) })}
                  className="w-full accent-gray-900 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* SLIDER D: BLEND MODES DECK */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                  Fabric Ink Fusion (Blend)
                </label>
                <select
                  id="select-blend-mode-ink"
                  value={selectedLayer.blendMode}
                  disabled={selectedLayer.isLocked}
                  onChange={(e: any) => onUpdateLayer(selectedLayer.id, { blendMode: e.target.value })}
                  className="w-full py-1.5 px-3 border border-gray-200 rounded-lg text-xs appearance-none focus:outline-none focus:border-gray-900 bg-white"
                >
                  <option value="normal">Normal (Solid decal print)</option>
                  <option value="multiply">Multiply (Screenprint vintage wash)</option>
                  <option value="screen">Screen (Ultra bright ink glow)</option>
                  <option value="overlay">Overlay (Translucent sports foil)</option>
                </select>
                <p className="text-[9.5px] text-gray-400 leading-relaxed">
                  Multiply is pristine for placing dark prints onto light fabrics, absorbing garment textures.
                </p>
              </div>

            </div>

            {/* Quick alignment tools */}
            <div className="border-t border-gray-100 pt-4.5 space-y-2">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide block">
                Quick Snaps & Alignments
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="align-btn-hcenter"
                  onClick={() => handleAlign('h-center')}
                  disabled={selectedLayer.isLocked}
                  className="px-2 py-1.5 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-650 bg-white hover:bg-gray-50 active:scale-97 transition-all flex items-center justify-center gap-1.5"
                >
                  ↔ Center H
                </button>
                <button
                  id="align-btn-vcenter"
                  onClick={() => handleAlign('v-center')}
                  disabled={selectedLayer.isLocked}
                  className="px-2 py-1.5 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-650 bg-white hover:bg-gray-50 active:scale-97 transition-all flex items-center justify-center gap-1.5"
                >
                  ↕ Center V
                </button>
                <button
                  id="align-btn-chest"
                  onClick={() => handleAlign('chest')}
                  disabled={selectedLayer.isLocked}
                  className="px-2 py-1.5 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-650 bg-white hover:bg-gray-50 active:scale-97 transition-all flex items-center justify-center gap-1.5"
                >
                  📍 Badge Chest
                </button>
                <button
                  id="align-btn-pocket"
                  onClick={() => handleAlign('pocket')}
                  disabled={selectedLayer.isLocked}
                  className="px-2 py-1.5 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-650 bg-white hover:bg-gray-50 active:scale-97 transition-all flex items-center justify-center gap-1.5"
                >
                  🧥 pocket Placement
                </button>
              </div>
            </div>

            {/* Delete button layout */}
            <button
              id="selected-layer-trash-btn"
              onClick={() => onDeleteLayer(selectedLayer.id)}
              className="w-full py-2 border border-red-200 text-red-650 bg-red-50/50 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors mt-2"
            >
              <Trash2 className="w-3.5 h-3.5" /> Erase Layer
            </button>
          </div>
        ) : (
          /* EMPTY INSPECTOR LAYOUT */
          <div className="py-8 text-center text-gray-400 space-y-3.5">
            <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <Layers className="w-5 h-5 pointer-events-none" />
            </div>
            <div>
              <p className="text-xs font-medium">No Graphic Layer Selected</p>
              <p className="text-[10px] leading-relaxed px-5 mt-1 text-gray-450">
                Click on any custom stamp, text layer, or image directly inside the mockup canvas to adjust parameters.
              </p>
            </div>
          </div>
        )}

        {/* SECTION 2: ACTIVE LAYERS STACK TIMELINE */}
        <div className="border-t border-gray-100 pt-5 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <span>Stack Order ({layers.length})</span>
            <span className="text-[10px] text-gray-500 font-mono">Layers</span>
          </div>

          {layers.length > 0 ? (
            <div className="space-y-1.5">
              {[...layers].reverse().map((layer) => {
                const isSelected = selectedLayerId === layer.id;
                return (
                  <div
                    key={layer.id}
                    id={`stack-item-${layer.id}`}
                    onClick={() => onSelectLayer(layer.id)}
                    className={`p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? 'border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-500/10' 
                        : 'border-gray-150 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate flex-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      <span className="text-xs font-semibold text-gray-800 truncate">
                        {layer.name}
                      </span>
                    </div>
                    {/* Compact actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {layer.isLocked && (
                        <Lock className="w-3 h-3 text-red-500 pointer-events-none" />
                      )}
                      <button
                        id={`stack-trash-btn-${layer.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteLayer(layer.id);
                        }}
                        className="p-1 hover:text-red-650 hover:bg-gray-100 rounded text-gray-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[10.5px] italic text-gray-400 text-center py-2">
              No overlapping layers added yet.
            </p>
          )}
        </div>

      </div>

      {/* LOWER EXPORT DESK ACTION TAB */}
      <div className="p-5 border-t border-gray-150 bg-gray-50/50 space-y-3 flex-shrink-0">
        <button
          id="mockup-download-deck-btn"
          onClick={handleExportMockup}
          className="w-full bg-emerald-600 hover:bg-emerald-650 active:scale-98 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-emerald-700 shadow-md transition-all active:shadow-sm"
        >
          <Download className="w-4 h-4" /> Download High-Res Mockup
        </button>
        <p className="text-[9.5px] text-gray-400 leading-normal text-center bg-white px-2.5 py-1.5 rounded-lg border border-gray-150">
          Compiles fabric structures, print scales, and layout coordinates into a 1200x1450 High-Fidelity PNG.
        </p>
      </div>

    </div>
  );
}
