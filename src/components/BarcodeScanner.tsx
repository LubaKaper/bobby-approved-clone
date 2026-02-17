"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface BarcodeScannerProps {
  onScanSuccess: (barcode: string) => void;
  onScanError?: (error: string) => void;
}

export default function BarcodeScanner({
  onScanSuccess,
  onScanError,
}: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const hasScanned = useRef(false);

  useEffect(() => {
    const scannerId = "barcode-reader";

    // Small delay to ensure DOM element is mounted
    const timer = setTimeout(() => {
      const scanner = new Html5Qrcode(scannerId);
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 280, height: 160 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (hasScanned.current) return;
            hasScanned.current = true;
            scanner
              .stop()
              .then(() => onScanSuccess(decodedText))
              .catch(() => onScanSuccess(decodedText));
          },
          () => {
            // Scan frame errors are expected when no barcode is in view
          }
        )
        .then(() => setIsStarting(false))
        .catch((err: Error) => {
          setIsStarting(false);
          onScanError?.(`Camera access failed: ${err.message}`);
        });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full">
      <div id="barcode-reader" className="w-full h-full" />
      {isStarting && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm">Starting camera...</p>
          </div>
        </div>
      )}
    </div>
  );
}
