import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, Download, ExternalLink, Coffee, Printer, Check, Copy } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export const DeveloperQRCodesPage = () => {
  const [searchParams] = useSearchParams();
  const selectedTokenParam = searchParams.get('selected');
  const { tables, restaurant } = useRestaurant();

  const [activeToken, setActiveToken] = useState(() => {
    return selectedTokenParam || tables[0]?.qrToken || 'tbl-patio-04';
  });

  const [copiedToken, setCopiedToken] = useState(null);
  const cardCanvasRef = useRef(null);

  const currentTable = tables.find(t => t.qrToken === activeToken) || tables[0];
  const baseUrl = window.location.origin;
  const qrTargetUrl = `${baseUrl}/t/${currentTable.qrToken}`;

  const handleCopyLink = (token) => {
    const url = `${baseUrl}/t/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleDownloadPNG = () => {
    const canvas = document.getElementById(`qr-canvas-${currentTable.qrToken}`);
    if (!canvas) return;

    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `QR_${restaurant.name.replace(/\s+/g, '_')}_${currentTable.tableNumber.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86C3E] block">
          QR Tent Cards & Print Engine
        </span>
        <h1 className="font-serif font-bold text-2xl text-[#312219]">
          Table QR Code Generator
        </h1>
        <p className="text-xs text-[#5B5146] mt-0.5">
          Generate, test, and download high-resolution QR tent cards for physical acrylic dining stands.
        </p>
      </div>

      {/* Main 2-Column Layout: Table Selector on Left, Print Card Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table Selector Column (Left 5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe-sm space-y-3">
          <h3 className="font-serif font-bold text-base text-[#312219]">
            Select Dining Table ({tables.length})
          </h3>
          <p className="text-xs text-[#5B5146]">
            Each table possesses an unpredictable secure token mapping directly to its dining session.
          </p>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {tables.map(table => {
              const isSelected = table.qrToken === currentTable.qrToken;

              return (
                <div
                  key={table.id}
                  onClick={() => setActiveToken(table.qrToken)}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#67523C] text-white border-[#67523C] shadow-cafe-sm'
                      : 'bg-[#FAF7F0] hover:bg-white text-[#312219] border-[#67523C]/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-serif font-bold text-xs ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#D2C6A6]/40 text-[#67523C]'
                    }`}>
                      {table.tableNumber.replace(/\D/g, '') || '01'}
                    </div>
                    <div>
                      <span className="font-bold block">{table.tableNumber}</span>
                      <span className={`text-[11px] ${isSelected ? 'text-[#D2C6A6]' : 'text-[#5B5146]'}`}>
                        {table.section}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink(table.qrToken);
                      }}
                      className={`p-1.5 rounded-lg border transition ${
                        isSelected
                          ? 'border-white/20 hover:bg-white/10 text-white'
                          : 'border-[#67523C]/15 hover:bg-white text-[#5B5146]'
                      }`}
                      title="Copy Scannable URL"
                    >
                      {copiedToken === table.qrToken ? (
                        <Check className="w-3.5 h-3.5 text-[#3F6E4D]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={`/t/${table.qrToken}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`p-1.5 rounded-lg border transition ${
                        isSelected
                          ? 'border-white/20 hover:bg-white/10 text-white'
                          : 'border-[#67523C]/15 hover:bg-white text-[#5B5146]'
                      }`}
                      title="Test Scan Landing"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Printable Stand Preview Column (Right 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#312219]">
              Printable Stand Card Preview
            </h3>
            <button
              onClick={handleDownloadPNG}
              className="px-4 py-2 rounded-xl bg-[#67523C] hover:bg-[#493725] text-white text-xs font-semibold flex items-center space-x-1.5 shadow-cafe-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res PNG</span>
            </button>
          </div>

          {/* Physical Stand Tent Preview Card */}
          <motion.div
            key={currentTable.qrToken}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FAF7F0] rounded-3xl p-8 border-2 border-[#67523C]/20 shadow-cafe-lg text-center max-w-sm mx-auto relative overflow-hidden"
          >
            {/* Top Logo */}
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#67523C] text-[#F5EFE4] flex items-center justify-center shadow-xs mb-2">
              <Coffee className="w-6 h-6" />
            </div>

            <h4 className="font-serif font-extrabold text-xl text-[#312219] tracking-tight">
              {restaurant.name}
            </h4>
            <p className="text-[10px] text-[#A86C3E] uppercase tracking-wider font-semibold mb-4">
              {restaurant.tagline}
            </p>

            {/* Table Badge */}
            <div className="bg-[#67523C] text-white py-1.5 px-4 rounded-full inline-block text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
              {currentTable.tableNumber} • {currentTable.section}
            </div>

            {/* QR Code Canvas */}
            <div className="bg-white p-4 rounded-2xl border-2 border-[#67523C]/15 shadow-sm inline-block mx-auto mb-4">
              <QRCodeCanvas
                id={`qr-canvas-${currentTable.qrToken}`}
                value={qrTargetUrl}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#312219"
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="space-y-1">
              <span className="font-bold text-xs text-[#312219] block">
                Point Phone Camera to Scan & Order
              </span>
              <p className="text-[11px] text-[#5B5146] leading-tight">
                No app download required • Instant live ordering
              </p>
            </div>

            {/* Bottom Footer on Card */}
            <div className="mt-5 pt-3 border-t border-[#67523C]/10 text-[9px] text-[#5B5146]/80 font-mono">
              TOKEN: {currentTable.qrToken}
            </div>
          </motion.div>

          {/* Quick Target URL Box */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#67523C]/15 text-xs text-[#5B5146] flex items-center justify-between">
            <div className="truncate mr-2">
              <span className="text-[10px] font-bold uppercase text-[#A86C3E] block">Encoded Target URL:</span>
              <span className="font-mono text-xs text-[#312219] truncate">{qrTargetUrl}</span>
            </div>
            <a
              href={qrTargetUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#FAF7F0] hover:bg-[#D2C6A6]/30 text-[#67523C] font-semibold text-xs whitespace-nowrap transition flex items-center space-x-1"
            >
              <span>Test Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

