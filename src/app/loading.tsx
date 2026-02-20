export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/bp-logo.jpeg" alt="Bobby Approved" className="w-full h-full object-cover" />
    </div>
  );
}
