/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shirt, 
  Sparkles, 
  HelpCircle, 
  Plus, 
  CheckCircle,
  HelpCircle as HelpIcon,
  ChevronRight,
  Info
} from 'lucide-react';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import ApparelCanvas from './components/ApparelCanvas';

import { ApparelModel, DesignLayer, VectorPreset } from './types';
import { APPAREL_MODELS, DESIGN_PRESETS } from './assets-data';

export default function App() {
  const [currentModel, setCurrentModel] = useState<ApparelModel>(APPAREL_MODELS[0]);
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF');
  const [layers, setLayers] = useState<DesignLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'editorial' | 'blueprint'>('editorial');
  
  // Interactive toast or notification helper
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pre-load a gorgeous design preset so the workspace isn't empty upon initial boot!
  useEffect(() => {
    const defaultSurfPreset = DESIGN_PRESETS[0]; // Pacific Surf Coast
    
    const initialLayer: DesignLayer = {
      id: 'initial-stamp-surf',
      type: 'shape',
      name: defaultSurfPreset.name,
      x: 50,                // centered
      y: 44,                // upper-chest standard
      width: 48,            // proportional
      height: 48 / defaultSurfPreset.aspectRatio,
      rotation: 0,
      opacity: 0.95,
      blendMode: 'multiply',  // blends perfectly on t-shirt cloth
      src: defaultSurfPreset.svgPath,
      textColor: defaultSurfPreset.defaultColor, // deep navy default
      aspectRatio: defaultSurfPreset.aspectRatio,
      isLocked: false
    };

    setLayers([initialLayer]);
    setSelectedLayerId(initialLayer.id);
    showToast('Mockup loaded with Pacific Surf Coast stamp!');
  }, []);

  // Show status feedback toasts
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3800);
  };

  // Add layout layer callbacks
  const handleAddImageLayer = (src: string, fileName: string) => {
    const id = `layer-${Date.now()}`;
    const newLayer: DesignLayer = {
      id,
      type: 'image',
      name: fileName.length > 22 ? fileName.substring(0, 20) + '...' : fileName,
      x: 50,
      y: 50,
      width: 40,
      height: 40,
      rotation: 0,
      opacity: 1.0,
      blendMode: 'normal',
      src,
      aspectRatio: 1.0, // default square, adjusts on load if needed
      isLocked: false
    };

    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(id);
    showToast(`Added uploaded design layer: "${newLayer.name}"`);
  };

  const handleAddTextLayer = (text: string, fontFamily: string, color: string) => {
    const id = `layer-${Date.now()}`;
    const newLayer: DesignLayer = {
      id,
      type: 'text',
      name: `Text: "${text.substring(0, 10)}${text.length > 10 ? '...' : ''}"`,
      x: 50,
      y: Math.min(80, 40 + (layers.length * 5)), // cascades slightly if multiple layers exist
      width: 60,
      height: 15,
      rotation: 0,
      opacity: 1.0,
      blendMode: 'normal',
      text,
      textColor: color,
      fontFamily,
      fontWeight: 'bold',
      fontStyle: 'normal',
      aspectRatio: 3.5, // flat widescreen bounding box for text
      isLocked: false
    };

    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(id);
    showToast(`Added custom typography layer!`);
  };

  const handleAddShapeLayer = (preset: VectorPreset) => {
    const id = `layer-${Date.now()}`;
    const newLayer: DesignLayer = {
      id,
      type: 'shape',
      name: preset.name,
      x: 50,
      y: 45,
      width: 44,
      height: 44 / preset.aspectRatio,
      rotation: 0,
      opacity: 0.95,
      blendMode: 'multiply',
      src: preset.svgPath,
      textColor: preset.defaultColor,
      aspectRatio: preset.aspectRatio,
      isLocked: false
    };

    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(id);
    showToast(`Stamped decorative graphic: "${preset.name}"`);
  };

  const handleUpdateLayer = (id: string, updates: Partial<DesignLayer>) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  const handleDeleteLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
    showToast('Deleted graphic layer from compile list.');
  };

  const handleSelectModel = (model: ApparelModel) => {
    setCurrentModel(model);
    setSelectedColor(model.defaultColor);
    showToast(`Switched active merchandise to ${model.name}`);
  };

  return (
    <div id="studio-applet-root" className="min-h-screen bg-gray-50 flex flex-col font-sans select-none antialiased">
      
      {/* 1. Sleek Main Top Branding Navigation header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4.5 flex flex-shrink-0 items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gray-900 rounded-2xl flex items-center justify-center text-white border border-gray-950 shadow-md">
            <Shirt className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-wider text-gray-900 uppercase">
                Memorabilia Mockup Studio
              </h1>
              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border border-emerald-200 tracking-widest leading-none">
                PRO ACTIVE
              </span>
            </div>
            <p className="text-[11px] font-medium text-gray-500 mt-0.5">
              Instant high-res print placement simulator for t-shirts, sweatshirts, hoodies, caps & tote bags.
            </p>
          </div>
        </div>

        {/* Dynamic status indicators bar */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-gray-400 uppercase">
          <div className="flex items-center gap-1.5 bg-gray-100/80 border border-gray-150 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            ACTIVE UNIT: <span className="text-gray-900">{currentModel.id}</span>
          </div>
          
          <div className="text-[10px] text-gray-400 font-mono tracking-wider">
            UTC: 2026-05-31
          </div>
        </div>
      </header>

      {/* 2. Central Tri-column Workspace Container */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* COLUMN 1: LEFT TOOLBOX (Select model, set custom colors, drag PNG, add curved text) */}
        <SidebarLeft
          currentModel={currentModel}
          onSelectModel={handleSelectModel}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          onAddImageLayer={handleAddImageLayer}
          onAddTextLayer={handleAddTextLayer}
          onAddShapeLayer={handleAddShapeLayer}
        />

        {/* COLUMN 2: CENTER SANDBOX (Display interactive t-shirt with bounding guide boxes) */}
        <ApparelCanvas
          currentModel={currentModel}
          selectedColor={selectedColor}
          layers={layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onUpdateLayer={handleUpdateLayer}
          onDeleteLayer={handleDeleteLayer}
          activeView={activeView}
          onChangeView={setActiveView}
        />

        {/* COLUMN 3: RIGHT PROPERTIES (Inspector parameters: scale, angle, blendModes, and high-res compilation downloads) */}
        <SidebarRight
          layers={layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onUpdateLayer={handleUpdateLayer}
          onDeleteLayer={handleDeleteLayer}
          currentModel={currentModel}
          selectedColor={selectedColor}
          activeView={activeView}
        />

        {/* ACTIVE FLOATING TOAST NOTIFICATION DECK */}
        {toastMessage && (
          <div 
            id="floating-system-toast"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 border border-gray-800 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold animate-bounce"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </main>

    </div>
  );
}
