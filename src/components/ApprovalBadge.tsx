"use client";

interface ApprovalBadgeProps {
  approved: boolean;
}

export default function ApprovalBadge({ approved }: ApprovalBadgeProps) {
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
    </div>
  );
}
