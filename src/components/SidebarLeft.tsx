/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Shirt, 
  Palette, 
  Type, 
  UploadCloud, 
  Stamp, 
  Plus, 
  Sparkles,
  Info,
  Layers,
  ChevronDown
} from 'lucide-react';
import { ApparelModel, MockupColor, VectorPreset, FontOption } from '../types';
import { APPAREL_MODELS, GOOGLE_FONTS, DESIGN_PRESETS } from '../assets-data';

interface SidebarLeftProps {
  currentModel: ApparelModel;
  onSelectModel: (model: ApparelModel) => void;
  selectedColor: string;
  onSelectColor: (colorHex: string) => void;
  onAddImageLayer: (src: string, name: string) => void;
  onAddTextLayer: (text: string, fontFamily: string, color: string) => void;
  onAddShapeLayer: (preset: VectorPreset) => void;
}

type TabType = 'apparel' | 'graphics' | 'text' | 'upload';

export default function SidebarLeft({
  currentModel,
  onSelectModel,
  selectedColor,
  onSelectColor,
  onAddImageLayer,
  onAddTextLayer,
  onAddShapeLayer
}: SidebarLeftProps) {
  const [activeTab, setActiveTab] = useState<TabType>('apparel');
  
  // Custom text input states
  const [textInput, setTextInput] = useState('DESIGN CLUB');
  const [selectedFont, setSelectedFont] = useState('Space Grotesk');
  const [textColor, setTextColor] = useState('#111827');
  
  // Custom color roller helper
  const [customColorInput, setCustomColorInput] = useState('#FFFFFF');
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          onAddImageLayer(event.target.result, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // File loading helper converts local file to data URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="sidebar-left-panel" className="w-80 border-r border-gray-200 bg-white flex flex-col h-full overflow-hidden">
      {/* Navigation Panels */}
      <div className="grid grid-cols-4 border-b border-gray-100 bg-gray-50/70 p-1.5 gap-1">
        {(['apparel', 'graphics', 'text', 'upload'] as TabType[]).map((tab) => {
          const isActive = activeTab === tab;
          let label = '';
          let IconComp = Shirt;
          if (tab === 'apparel') { label = 'Apparel'; IconComp = Shirt; }
          if (tab === 'graphics') { label = 'Stamps'; IconComp = Stamp; }
          if (tab === 'text') { label = 'Text'; IconComp = Type; }
          if (tab === 'upload') { label = 'Upload'; IconComp = UploadCloud; }

          return (
            <button
              key={tab}
              id={`left-tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg transition-all text-[11px] font-medium leading-none gap-1.5 ${
                isActive 
                  ? 'bg-white text-gray-900 shadow-xs ring-1 ring-black/5 font-semibold' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              <IconComp className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Central Interactive Panels */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* PANEL A: APPAREL DIRECTORY */}
        {activeTab === 'apparel' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                1. Select Memorabilia
              </h3>
              <div className="space-y-2.5">
                {APPAREL_MODELS.map((model) => {
                  const isSelected = model.id === currentModel.id;
                  return (
                    <button
                      key={model.id}
                      id={`model-button-${model.id}`}
                      onClick={() => onSelectModel(model)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 relative ${
                        isSelected 
                          ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-950/5' 
                          : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/20'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-gray-100 flex-shrink-0">
                        <Shirt className="w-5 h-5 text-gray-700" />
                      </div>
                      <div className="truncate flex-1">
                        <h4 className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                          {model.name}
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                          )}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{model.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COLOR ROLLER DECK */}
            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" /> 2. Color Workspace
                </h3>
                <span className="text-[10px] text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                  {selectedColor}
                </span>
              </div>

              {/* Color Presets Bubble Deck */}
              <div className="grid grid-cols-5 gap-2.5">
                {currentModel.presetColors.map((color) => {
                  const isSelected = selectedColor.toLowerCase() === color.hex.toLowerCase();
                  return (
                    <button
                      key={color.name}
                      id={`color-preset-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => {
                        onSelectColor(color.hex);
                        setCustomColorInput(color.hex);
                      }}
                      className={`h-9 rounded-lg border relative flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'border-gray-900 scale-105 shadow-xs ring-2 ring-black/10' 
                          : 'border-gray-300 hover:scale-103'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={`${color.name} (${color.hex})`}
                    >
                      {isSelected && (
                        <div className={`w-1.5 h-1.5 rounded-full ${color.isDark ? 'bg-white' : 'bg-gray-900'}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom hex color selector */}
              <div className="mt-4 flex items-center gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="custom-color-hex-text"
                    value={customColorInput}
                    onChange={(e) => {
                      setCustomColorInput(e.target.value);
                      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                        onSelectColor(e.target.value);
                      }
                    }}
                    placeholder="#FFFFFF"
                    className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 font-mono"
                  />
                  <div 
                    className="absolute left-2.5 top-2.5 w-3.5 h-3.5 rounded border border-gray-200 shadow-xs"
                    style={{ backgroundColor: customColorInput }}
                  />
                </div>
                
                <input
                  type="color"
                  id="custom-color-palette"
                  value={customColorInput}
                  onChange={(e) => {
                    const chosen = e.target.value.toUpperCase();
                    setCustomColorInput(chosen);
                    onSelectColor(chosen);
                  }}
                  className="w-9 h-8 rounded-lg cursor-pointer border border-gray-200"
                />
              </div>
            </div>

            {/* Print Guides Description Box */}
            <div className="bg-blue-50/50 rounded-xl p-3.5 border border-blue-100 flex gap-2.5">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">Canvas Multiplier Guide</h5>
                <p className="text-[11px] text-blue-700/80 leading-relaxed mt-1">
                  We use photographic-overlay fabric physics. Colors dynamically blend realistic garment shadows and folds for high-fidelity previews.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PANEL B: EMBEDDED STAMP BADGES */}
        {activeTab === 'graphics' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Built-In Graphic Stamps
              </h3>
              <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
                Choose a handcrafted vector design preset to stamp onto your garment template. Fully scalabe and colorizable!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {DESIGN_PRESETS.map((preset) => {
                return (
                  <button
                    key={preset.id}
                    id={`stamp-preset-${preset.id}`}
                    onClick={() => onAddShapeLayer(preset)}
                    className="flex flex-col items-center justify-between p-3 border border-gray-100 hover:border-gray-900 rounded-xl hover:bg-gray-50 bg-white transition-all text-left gap-2 shadow-xs group"
                  >
                    {/* SVG preview rendering inside container */}
                    <div className="w-20 h-20 flex items-center justify-center p-1 bg-gray-50 rounded-lg border border-gray-100 group-hover:bg-white transition-colors">
                      <svg 
                        viewBox="0 0 200 200" 
                        style={{ color: preset.defaultColor }}
                        className="w-full h-full text-current"
                        dangerouslySetInnerHTML={{ __html: preset.svgPath }}
                      />
                    </div>
                    <div className="text-center w-full">
                      <h5 className="text-[10px] font-semibold text-gray-900 truncate">{preset.name}</h5>
                      <span className="text-[9px] uppercase font-bold text-gray-400 font-mono tracking-wider">
                        {preset.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PANEL C: CUSTOM DESIGN TYPOGRAPHY */}
        {activeTab === 'text' && (
          <div className="space-y-4.5">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                Custom Typography
              </h3>
              <p className="text-[11px] text-gray-500 mb-4">
                Add structured editable text overlays. Pick from display-grade Google fonts.
              </p>
            </div>

            {/* Plain text input box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                Text Layer Wording
              </label>
              <textarea
                id="design-text-word-input"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="type letters here..."
                rows={2}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 font-semibold"
              />
            </div>

            {/* Font choice drop-down */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                Font Family Pairings
              </label>
              <div className="relative">
                <select
                  id="design-text-font-dropdown"
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full pr-8 pl-3 py-2 text-xs border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-gray-900 bg-white"
                >
                  {GOOGLE_FONTS.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label} ({font.category})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Text color selector bar */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                Ink Color
              </label>
              <div className="flex gap-2">
                <div className="flex-1 grid grid-cols-6 gap-1">
                  {['#111827', '#FFFFFF', '#EF4444', '#3B82F6', '#10B981', '#F59E0B'].map((col) => (
                    <button
                      key={col}
                      id={`text-color-preset-${col}`}
                      onClick={() => setTextColor(col)}
                      className={`h-6 rounded border ${
                        textColor === col ? 'border-black scale-105' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  id="text-color-palette"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-7 h-6 cursor-pointer rounded border border-gray-200"
                />
              </div>
            </div>

            {/* Spawn overlay button */}
            <button
              id="spawn-text-layer-btn"
              onClick={() => {
                if (textInput.trim() !== '') {
                  onAddTextLayer(textInput, selectedFont, textColor);
                }
              }}
              className="w-full bg-gray-900 hover:bg-gray-850 active:scale-98 text-white py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-black shadow-xs transition-all mt-4"
            >
              <Plus className="w-3.5 h-3.5" /> Stamp Text Layer
            </button>
          </div>
        )}

        {/* PANEL D: PORTFOLIO PNG FILE UPLOAD */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                Upload PNG Elements
              </h3>
              <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
                Add transparent PNG design logos or custom prints. Scale them freely to showcase exact alignment.
              </p>
            </div>

            {/* Interactive Dropbox Container */}
            <div
              id="upload-dropzone-interactive"
              onClick={triggerFileSelect}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => {
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  processFile(file);
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group ${
                isDragging 
                  ? 'border-emerald-500 bg-emerald-50/50 scale-102 ring-2 ring-emerald-500/10' 
                  : 'border-gray-300 hover:border-gray-500 bg-gray-50/50 hover:bg-gray-50'
              }`}
            >
              <div className="p-3 bg-white border border-gray-100 rounded-xl shadow-xs group-hover:scale-105 transition-transform">
                <UploadCloud className={`w-6 h-6 transition-colors ${isDragging ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
              </div>
              <h4 className="text-xs font-semibold text-gray-900 mt-3.5">
                {isDragging ? 'Drop your PNG file here!' : 'Drag print designs here'}
              </h4>
              <p className="text-[10px] text-gray-400 mt-1">
                Supports PNG, JPG, or SVG vectors
              </p>
              
              <button
                id="select-file-trigger-btn"
                type="button"
                className="mt-4 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation(); // prevent clicking panel again
                  triggerFileSelect();
                }}
              >
                Browse Folders
              </button>
              
              <input 
                ref={fileInputRef}
                type="file" 
                id="hidden-file-input"
                accept="image/*"
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>

            {/* Prepackaged simulation PNGs for quick click-to-load checks */}
            <div className="border-t border-gray-100 pt-4 space-y-2.5">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-yellow-500" /> Need testing files? Try these template layers
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    name: 'Sunset Hawaii.png',
                    icon: '🌅',
                    generate: () => 'data:image/svg+xml;utf8,' + encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF416C" /><stop offset="100%" stop-color="#FF4B2B" /></linearGradient>
                        <circle cx="50" cy="50" r="42" fill="url(#sg)" />
                        <path d="M 50,85 C 45,65 35,50 15,45" stroke="#111827" stroke-width="3" fill="none" stroke-linecap="round" />
                        <path d="M 50,85 C 53,60 62,45 80,40" stroke="#111827" stroke-width="3" fill="none" stroke-linecap="round" />
                        <path d="M 15,45 Q 15,35 5,30 M 15,45 Q 25,35 25,25 M 80,40 Q 82,30 92,25" stroke="#111827" stroke-width="2.5" fill="none" stroke-linecap="round" />
                        <text x="50" y="85" font-family="sans-serif" font-weight="900" font-size="7" fill="#FFFFFF" text-anchor="middle">HAWAII</text>
                      </svg>`)
                  },
                  {
                    name: 'Rocker Skull.png',
                    icon: '💀',
                    generate: () => 'data:image/svg+xml;utf8,' + encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <rect width="100" height="100" fill="none"/>
                        <circle cx="50" cy="45" r="28" fill="#111827" />
                        <rect x="36" y="55" width="28" height="24" rx="6" fill="#111827" />
                        <circle cx="40" cy="42" r="7" fill="#FFFFFF" />
                        <circle cx="60" cy="42" r="7" fill="#FFFFFF" />
                        <polygon points="50,52 46,58 54,58" fill="#FFFFFF" />
                        <rect x="42" y="66" width="3" height="8" rx="1" fill="#FFFFFF" />
                        <rect x="48" y="66" width="3" height="8" rx="1" fill="#FFFFFF" />
                        <rect x="54" y="66" width="3" height="8" rx="1" fill="#FFFFFF" />
                        <path d="M 22,45 C 22,15 78,15 78,45" fill="none" stroke="#F59E0B" stroke-width="5" />
                        <rect x="16" y="38" width="10" height="18" rx="3" fill="#F59E0B" />
                        <rect x="74" y="38" width="10" height="18" rx="3" fill="#F59E0B" />
                      </svg>`)
                  },
                  {
                    name: 'Neon Flower.png',
                    icon: '🌸',
                    generate: () => 'data:image/svg+xml;utf8,' + encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <g transform="translate(50,50)">
                          <circle cx="0" cy="0" r="10" fill="#3B82F6" />
                          <path d="M 0,0 C -25,-25 25,-25 0,0" fill="#10B981" opacity="0.8"/>
                          <path d="M 0,0 C 25,-25 25,25 0,0" fill="#EF4444" opacity="0.8"/>
                          <path d="M 0,0 C 25,25 -25,25 0,0" fill="#F59E0B" opacity="0.8"/>
                          <path d="M 0,0 C -25,25 -25,-25 0,0" fill="#EC4899" opacity="0.8"/>
                          <circle cx="0" cy="0" r="15" fill="none" stroke="#FFFFFF" stroke-width="2" />
                        </g>
                      </svg>`)
                  }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    id={`test-demo-upload-${idx}`}
                    onClick={() => {
                      onAddImageLayer(item.generate(), item.name);
                    }}
                    className="flex flex-col items-center justify-center p-2.5 bg-white border border-gray-150 hover:border-gray-950 hover:bg-gray-50 rounded-xl transition-all shadow-3xs"
                  >
                    <span className="text-lg mb-1 leading-none">{item.icon}</span>
                    <span className="text-[9px] font-bold text-gray-600 truncate w-full text-center">
                      {item.name.split('.')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Design specifications hints box */}
            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 space-y-2">
              <h5 className="text-[10px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-gray-500" /> File Guidelines
              </h5>
              <ul className="text-[10px] text-gray-500 space-y-1 list-disc pl-4 leading-relaxed">
                <li>Higher resolution PNGs yield superior mockups.</li>
                <li>Ensure transparent channels for ink simulation.</li>
                <li>Try selecting standard apparel blend modes after stamps.</li>
              </ul>
            </div>
          </div>
        )}

      </div>

      {/* Footer Branding Panel */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/30 text-center text-[10px] text-gray-400 font-mono">
        PREVIEW CONSOLE • V2.0
      </div>
    </div>
  );
}
