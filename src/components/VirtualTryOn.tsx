
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { X, Camera, Sparkles, Wand2, Check, ArrowLeft, Upload, RefreshCw, User as UserIcon, Image as ImageIcon } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface VirtualTryOnProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

type Mode = 'menu' | 'upload' | 'camera' | 'presets';

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [mode, setMode] = useState<Mode>('menu');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [recentPhotos, setRecentPhotos] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Model Presets for "Materials" variety
  const modelPresets = [
    { id: 'm1', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1020&auto=format&fit=crop', label: 'Classic' },
    { id: 'm2', url: 'https://images.unsplash.com/photo-1539109132381-31a15b2974aa?q=80&w=1000&auto=format&fit=crop', label: 'Elegant' },
    { id: 'm3', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1000&auto=format&fit=crop', label: 'Minimalist' }
  ];

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setMode('menu');
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setMode('camera');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1440 } } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setMode('menu');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setUserImage(dataUrl);
        setRecentPhotos(prev => [dataUrl, ...prev.slice(0, 4)]);
        stopCamera();
        setMode('menu');
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setUserImage(dataUrl);
        setRecentPhotos(prev => [dataUrl, ...prev.slice(0, 4)]);
        setMode('menu');
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchImageAsBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.readAsDataURL(blob);
    });
  };

  const runVirtualTryOn = async () => {
    if (!userImage) return;
    
    setIsProcessing(true);
    setProcessStep('Analyzing body geometry...');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const userImageBase64 = userImage.split(',')[1];
      const productImageBase64 = await fetchImageAsBase64(product.images[0]);
      
      setProcessStep('Simulating fabric drape...');
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: userImageBase64,
                mimeType: 'image/jpeg',
              },
            },
            {
              text: `You are an elite virtual fashion engineer and photorealistic image synthesizer specializing in digital apparel replacement.
Your task is to photorealistically REPLACE all existing clothing on the person in the USER PHOTO with the garment from the PRODUCT IMAGE.

PRODUCT: ${product.name} (${product.category})
DETAILS: ${product.details.join(', ')}

EXACT TECHNICAL REQUIREMENTS:
1. COMPLETE CLOTHING REPLACEMENT: You MUST completely hide and remove all visible original clothing on the person. The person's existing clothes should not peek through, outline, or create bulk under the new garment.
2. ANATOMICAL FITTING: The ${product.name} must conform perfectly to the person's unique body shape, size, and pose. For dresses, ensure the fit is natural across the shoulders, bust, waist, and hips without any distortion or warping.
3. NATURAL DRAPING & PHYSICS: Simulate gravity correctly. The fabric should drape naturally over the body, showing realistic folds and creases at joints (elbows, waist, hips).
4. PHOTOREALISTIC LIGHTING: Perfectly match the lighting of the garment to the environment in the USER PHOTO. Ensure highlights and shadows on the fabric are consistent with the ambient light source and intensity in the original photo.
5. CONTACT SHADOWS: Create realistic micro-shadows where the fabric touches the skin or layers over itself to ground the garment in the scene.
6. PRESERVATION: Keep the person's face, hair, hands, feet, and original background 100% intact. Only replace the clothing area.

OUTPUT: Return the final high-resolution composite image where the person is naturally wearing the new ${product.name} with no traces of their previous outfit.`,
            },
            {
              inlineData: {
                data: productImageBase64,
                mimeType: 'image/jpeg'
              }
            }
          ],
        },
      });

      setProcessStep('Synchronizing lighting...');
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setTryOnResult(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error('Virtual Try-On Error:', error);
      setProcessStep('Error in processing. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-6xl h-full max-h-[92vh] overflow-hidden flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-700 rounded-sm">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 md:px-10 border-b border-zinc-100 bg-white z-10">
          <div className="flex items-center gap-4">
            <Sparkles size={20} className="text-zinc-900" />
            <div>
              <h2 className="font-serif text-2xl tracking-tight leading-none">LUXE Virtual Concierge</h2>
              <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mt-2 font-bold">Photo Materials & AI Synthesis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors focus:outline-none">
            <X size={24} strokeWidth={1} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white">
          
          {/* Section 01: Photo Materials Selection */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 border-r border-zinc-100 flex flex-col overflow-y-auto">
            <div className="mb-10 flex justify-between items-end">
              <div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 block font-bold mb-3">01 / Source Material</span>
                <h3 className="font-serif text-3xl">Digital Silhouette</h3>
              </div>
              {userImage && (
                <button onClick={() => { setUserImage(null); setMode('menu'); }} className="text-[9px] uppercase tracking-widest font-bold text-zinc-400 hover:text-black transition-colors flex items-center gap-2">
                  <RefreshCw size={10} /> Reset Source
                </button>
              )}
            </div>

            <div className="flex-1 flex flex-col">
              {userImage ? (
                <div className="relative flex-1 bg-zinc-50 rounded-lg overflow-hidden border border-zinc-100 group">
                  <img src={userImage} className="w-full h-full object-contain animate-in fade-in duration-700" alt="Active source material" />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setMode('menu')} className="bg-white/90 backdrop-blur px-6 py-3 text-[9px] uppercase tracking-widest font-bold shadow-xl hover:bg-black hover:text-white transition-all">Change Material</button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-6">
                  {mode === 'menu' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                      <button 
                        onClick={startCamera}
                        className="flex flex-col items-center justify-center p-12 border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-black transition-all group rounded-sm"
                      >
                        <Camera size={32} strokeWidth={1} className="mb-6 text-zinc-400 group-hover:text-black transition-colors" />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Live Capture</span>
                        <span className="text-[8px] text-zinc-400 mt-2 tracking-widest">Use Camera</span>
                      </button>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center p-12 border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-black transition-all group rounded-sm"
                      >
                        <Upload size={32} strokeWidth={1} className="mb-6 text-zinc-400 group-hover:text-black transition-colors" />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Upload Material</span>
                        <span className="text-[8px] text-zinc-400 mt-2 tracking-widest">JPG, PNG, WEBP</span>
                      </button>
                      <button 
                        onClick={() => setMode('presets')}
                        className="md:col-span-2 flex items-center justify-center p-8 border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-black transition-all group rounded-sm gap-6"
                      >
                        <UserIcon size={24} strokeWidth={1} className="text-zinc-400 group-hover:text-black transition-colors" />
                        <div className="text-left">
                          <span className="text-[10px] uppercase tracking-[0.3em] font-bold block">Use Model Preset</span>
                          <span className="text-[8px] text-zinc-400 tracking-widest">Select from our editorial models</span>
                        </div>
                      </button>
                    </div>
                  )}

                  {mode === 'camera' && (
                    <div className="flex-1 bg-black rounded-lg overflow-hidden relative border border-zinc-800 shadow-2xl">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale brightness-110" />
                      <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none" />
                      <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8">
                        <button onClick={() => { stopCamera(); setMode('menu'); }} className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
                          <ArrowLeft size={20} />
                        </button>
                        <button onClick={capturePhoto} className="w-20 h-20 bg-white rounded-full border-4 border-zinc-300 active:scale-95 transition-all flex items-center justify-center">
                          <div className="w-14 h-14 border border-black rounded-full" />
                        </button>
                        <div className="w-12 h-12" />
                      </div>
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  )}

                  {mode === 'presets' && (
                    <div className="flex-1 flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
                      <div className="flex items-center gap-4 mb-4">
                        <button onClick={() => setMode('menu')} className="p-2 hover:bg-zinc-100 rounded-full transition-all">
                          <ArrowLeft size={18} />
                        </button>
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold">Editorial Models</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {modelPresets.map(model => (
                          <button 
                            key={model.id} 
                            onClick={() => { setUserImage(model.url); setMode('menu'); }}
                            className="flex flex-col gap-3 group"
                          >
                            <div className="aspect-[3/4] overflow-hidden rounded-sm border border-zinc-100">
                              <img src={model.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt={model.label} />
                            </div>
                            <span className="text-[8px] uppercase tracking-widest font-bold text-zinc-400 group-hover:text-black">{model.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Materials Gallery */}
                  {recentPhotos.length > 0 && mode === 'menu' && (
                    <div className="mt-12 pt-12 border-t border-zinc-100">
                      <div className="flex items-center gap-3 mb-6">
                        <RefreshCw size={12} className="text-zinc-300" />
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400">Recently Used Materials</h4>
                      </div>
                      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {recentPhotos.map((photo, i) => (
                          <button 
                            key={i} 
                            onClick={() => setUserImage(photo)}
                            className="w-16 h-20 flex-shrink-0 bg-zinc-50 border border-zinc-100 rounded-sm overflow-hidden hover:border-black transition-all"
                          >
                            <img src={photo} className="w-full h-full object-cover" alt={`Recent ${i}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          {/* Section 02: AI Synthesis Area */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col bg-zinc-50/30 overflow-y-auto">
            <div className="mb-10">
              <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 block font-bold mb-3">02 / AI Tailoring</span>
              <h3 className="font-serif text-3xl">Synthesis Result</h3>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center border border-zinc-100 bg-white rounded-lg relative overflow-hidden min-h-[400px] shadow-sm">
              {isProcessing ? (
                <div className="text-center animate-in fade-in duration-500">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 border-t-2 border-zinc-900 rounded-full animate-spin mx-auto" />
                    <Sparkles size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-900 animate-pulse" />
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-zinc-900 animate-pulse">{processStep}</p>
                </div>
              ) : tryOnResult ? (
                <div className="relative h-full w-full animate-in zoom-in-95 duration-1000">
                  <img src={tryOnResult} className="w-full h-full object-contain" alt="Final tailored visualization" />
                  <div className="absolute top-8 right-8 bg-black text-white px-5 py-2.5 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 shadow-2xl">
                    <Check size={14} /> AI Tailored Preview
                  </div>
                </div>
              ) : (
                <div className="text-center px-12 opacity-40">
                  <div className="mb-12 flex justify-center gap-6 items-center">
                    <div className="w-24 h-32 bg-zinc-100 rounded flex items-center justify-center">
                      <UserIcon size={24} className="text-zinc-300" />
                    </div>
                    <PlusIcon size={16} className="text-zinc-200" />
                    <div className="w-24 h-32 overflow-hidden rounded shadow-sm">
                      <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                    </div>
                  </div>
                  <Wand2 size={40} strokeWidth={1} className="mx-auto mb-6 text-zinc-200" />
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-300">Awaiting Material Synthesis</p>
                </div>
              )}
            </div>

            <div className="mt-10 space-y-4">
              {!tryOnResult ? (
                <button 
                  onClick={runVirtualTryOn}
                  disabled={!userImage || isProcessing}
                  className="w-full bg-black text-white py-6 text-[10px] uppercase tracking-[0.5em] font-bold hover:bg-zinc-800 transition-all shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                >
                  {isProcessing ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Synthesizing Experience...</>
                  ) : (
                    <>Run AI Tailoring <Wand2 size={14} className="group-hover:rotate-12 transition-transform" /></>
                  )}
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => { onAddToCart(product); onClose(); }}
                    className="bg-black text-white py-6 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-800 transition-all shadow-2xl"
                  >
                    Add Piece to Bag
                  </button>
                  <button 
                    onClick={() => { setTryOnResult(null); }}
                    className="border border-zinc-200 py-6 text-[10px] uppercase tracking-[0.4em] font-bold hover:border-black transition-all"
                  >
                    Tweak Parameters
                  </button>
                </div>
              )}
              <p className="text-[9px] text-center text-zinc-300 uppercase tracking-[0.2em] font-light pt-4">Your source photo remains locally in your browser session.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Icon for Layout
const PlusIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default VirtualTryOn;
