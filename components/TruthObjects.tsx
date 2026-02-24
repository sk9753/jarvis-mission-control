import { TruthObject } from "@/lib/types";

export default function TruthObjects({ truths }: { truths: TruthObject[] }) {
  const grouped = truths.reduce<Record<string, TruthObject[]>>((acc, t) => {
    (acc[t.category] ??= []).push(t);
    return acc;
  }, {});

  if (Object.keys(grouped).length === 0) return null;

  return (
    <section className="px-4 py-4">
      <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-3">Truth Objects</h2>
      <div className="space-y-3">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <h3 className="text-xs font-semibold text-blue-400 mb-1">{cat}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {items.map(t => (
                <div key={t.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 flex items-center gap-2">
                  <span className="text-[11px] text-[#888] font-mono">{t.key}</span>
                  <span className="text-[11px] text-[#e8e8e8] flex-1 truncate">{t.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
