import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Lock, ArrowLeft } from 'lucide-react';

export const DeveloperPlaceholderPage = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F5EFE4] flex items-center justify-center p-4">
      <div className="bg-[#FAF7F0] border border-[#67523C]/20 rounded-3xl p-8 max-w-md w-full text-center shadow-cafe-lg">
        <div className="w-16 h-16 rounded-2xl bg-[#312219] text-[#D2C6A6] flex items-center justify-center mx-auto mb-4 shadow-cafe-sm">
          <Terminal className="w-8 h-8" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86C3E]">
          Stage 3 Boundary
        </span>
        <h1 className="font-serif font-bold text-2xl text-[#312219] mt-1 mb-2">
          Developer Suite Scaffolding
        </h1>
        <p className="text-xs text-[#5B5146] leading-relaxed mb-6">
          Path: <code className="bg-[#D2C6A6]/40 px-2 py-0.5 rounded text-[#312219] font-mono">{location.pathname}</code>
          <br /><br />
          Stage 1 focuses exclusively on the complete customer experience. Developer menu management, table/QR generation, branding configuration, and client administration will be built in Stage 3.
        </p>

        <div className="space-y-3">
          <Link
            to="/menu"
            className="w-full py-3.5 rounded-xl bg-[#67523C] hover:bg-[#493725] text-[#F5EFE4] font-semibold text-sm flex items-center justify-center space-x-2 transition shadow-cafe-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Customer Menu</span>
          </Link>
          <Link
            to="/welcome"
            className="block text-xs font-semibold text-[#5B5146] hover:text-[#312219] underline"
          >
            Go to Customer Welcome Page
          </Link>
        </div>
      </div>
    </div>
  );
};

