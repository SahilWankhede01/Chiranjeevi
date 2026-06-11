import React from 'react';

/**
 * MobileTable component
 * Swaps between a mobile card layout (< md) and a standard table layout (>= md).
 */
export default function MobileTable({
  headers,
  data,
  renderMobileCard,
  renderRow,
  tableClassName = "min-w-full divide-y divide-slate-100 dark:divide-zinc-800",
  theadClassName = "bg-slate-50/50 dark:bg-zinc-950/20",
  tbodyClassName = "divide-y divide-slate-100 dark:divide-zinc-800 text-xs text-slate-700 dark:text-zinc-400",
}) {
  return (
    <div>
      {/* Mobile Card View (< md) */}
      <div className="block md:hidden space-y-4 p-4">
        {data.map((item, index) => (
          <div 
            key={item._id || index} 
            className="bg-white dark:bg-zinc-900 border border-slate-105 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm relative space-y-3 hover:border-ayurveda-green-200 dark:hover:border-zinc-700 transition-colors"
          >
            {renderMobileCard(item, index)}
          </div>
        ))}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block overflow-x-auto text-left">
        <table className={tableClassName}>
          <thead className={theadClassName}>
            <tr>
              {headers.map((header, index) => {
                const label = typeof header === 'string' ? header : header.label;
                const isRight = typeof header === 'object' && header.align === 'right';
                return (
                  <th
                    key={index}
                    className={`px-5 py-4 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider ${
                      isRight ? 'text-right' : 'text-left'
                    }`}
                  >
                    {label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={tbodyClassName}>
            {data.map((item, index) => renderRow(item, index))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
