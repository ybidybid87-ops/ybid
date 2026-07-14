type SummaryCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  children?: React.ReactNode;
};

export default function SummaryCard({
  icon,
  label,
  value,
  children,
}: SummaryCardProps) {
  return (
    <div
      className="
        flex items-center justify-between
        rounded-[28px]
        border
        border-slate-200
        bg-white
        p-6
        shadow-lg
      "
    >
      <div className="flex items-center gap-5">
        {icon}

        <div>
          <p className="text-sm text-slate-500">{label}</p>

          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
      </div>

      {children}
    </div>
  );
}