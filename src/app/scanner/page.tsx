"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import { findProductByBarcode } from "@/data/products";

const BarcodeScanner = dynamic(() => import("@/components/BarcodeScanner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm">Loading scanner...</p>
      </div>
    </div>
  ),
});

export default function ScannerPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [scannedNotFound, setScannedNotFound] = useState<string | null>(null);

  const handleScanSuccess = (barcode: string) => {
    const product = findProductByBarcode(barcode);
    if (product) {
      router.push(`/result/${barcode}`);
    } else {
      setScannedNotFound(barcode);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Scanner Area */}
      <div className="w-full h-full">
        <BarcodeScanner
          onScanSuccess={handleScanSuccess}
          onScanError={setError}
        />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top controls */}
        <div className="flex items-center justify-between p-4 pt-12 pointer-events-auto">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Bottom instruction */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center pointer-events-auto">
          <div className="bg-white rounded-full px-5 py-3 shadow-lg flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#00897B"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700 text-sm font-medium">
              Align the barcode inside the frame
            </span>
          </div>
        </div>
      </div>

      {/* Error modal */}
      {error && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-6 z-60">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-bobby-red-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#E53935"
                className="w-8 h-8"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Camera Access Required
            </h3>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-bobby-teal text-white px-6 py-2.5 rounded-full font-semibold"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* Not found modal */}
      {scannedNotFound && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-6 z-60">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#9CA3AF"
                className="w-8 h-8"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Product Not Found
            </h3>
            <p className="text-gray-500 text-sm mb-1">
              This barcode is not in our demo dataset.
            </p>
            <p className="text-gray-400 text-xs mb-4 font-mono">
              {scannedNotFound}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setScannedNotFound(null);
                  router.replace("/scanner");
                }}
                className="flex-1 bg-bobby-teal text-white py-2.5 rounded-full font-semibold"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-full font-semibold"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
