'use client';
import { useEffect, useState } from 'react';
import { getUserContributions } from '@/app/lib/server/actions/users/getContributions.action';
import type { ScoreBreakdownRow } from '@/app/lib/shared/score';

type Contributions = {
  name: string;
  score: number;
  breakdown: ScoreBreakdownRow[];
};

export const ModalUserContributions = ({ idUser, name }: { idUser: string; name: string }) => {
  const [contributions, setContributions] = useState<Contributions | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getUserContributions({ idUser }).then((result) => {
      if (!active) return;
      if (result.error) setError(result.error);
      else setContributions(result.data);
    });
    return () => {
      active = false;
    };
  }, [idUser]);

  return (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg truncate">
          <b>{name}</b>
        </h2>
        {contributions && (
          <span className="text-(--dark-cyan) font-bold whitespace-nowrap">
            {contributions.score} {contributions.score === 1 ? 'pt' : 'pts'}
          </span>
        )}
      </div>
      {!contributions && !error && <p className="text-sm text-slate-300">Cargando aportes...</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}
      {contributions && (
        <>
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 text-xs uppercase tracking-wide text-slate-400 border-b border-slate-600 pb-1">
            <span>Aporte</span>
            <span className="w-16 text-right">Cantidad</span>
            <span className="w-16 text-right">Puntos</span>
          </div>
          <ul className="flex flex-col">
            {contributions.breakdown.map((row) => (
              <li
                key={row.key}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-1.5 border-b border-slate-700/50 last:border-0"
              >
                <span className="truncate">{row.label}</span>
                <span className="w-16 text-right text-slate-300 tabular-nums">
                  {row.quantity} <span className="text-slate-500">× {row.unitPoints}</span>
                </span>
                <span className="w-16 text-right tabular-nums">
                  {row.points > 0 ? (
                    <b className="text-(--dark-cyan)">
                      {row.points} {row.points === 1 ? 'pt' : 'pts'}
                    </b>
                  ) : (
                    <span className="text-slate-500">0 pts</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};
