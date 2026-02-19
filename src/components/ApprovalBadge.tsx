"use client";

interface ApprovalBadgeProps {
  approved: boolean;
  showDisclaimer?: boolean;
}

export default function ApprovalBadge({ approved, showDisclaimer }: ApprovalBadgeProps) {
  return (
    <div
      className={`px-5 py-4 rounded-2xl ${
        approved ? "bg-bobby-green-light" : "bg-bobby-red-light"
      }`}
    >
      <h2
        className={`text-2xl font-bold ${
          approved ? "text-bobby-green" : "text-bobby-red"
        }`}
      >
        {approved ? "Bobby Approved" : "Not Bobby Approved"}
      </h2>
      {showDisclaimer && (
        <p className="text-xs text-gray-400 mt-2">
          Some flags are best-effort based on label wording.
        </p>
      )}
    </div>
  );
}
