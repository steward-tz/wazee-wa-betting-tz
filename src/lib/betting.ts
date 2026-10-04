export type TicketStatus = "PENDING" | "WON" | "LOST" | "VOID" | "CANCELLED";
export type SelectionStatus = TicketStatus;
export type MarketKey = "1X2" | "DOUBLE_CHANCE" | "OVER_UNDER" | "BTTS" | "DRAW_NO_BET" | "HANDICAP" | "HALF_TIME" | "FULL_TIME";

export type Selection = {
  id?: string;
  matchId: string;
  market: MarketKey;
  line?: number | null;
  prediction: string;
  odds: number;
  status?: SelectionStatus;
  homeTeam: string;
  awayTeam: string;
  kickoffAt: string;
  leagueName?: string;
};

export function calculateTotalOdds(selections: Pick<Selection, "odds">[]) {
  return Number(selections.reduce((total, item) => total * Number(item.odds || 1), 1).toFixed(2));
}

export function canEditTicket(kickoffDates: string[]) {
  return kickoffDates.every((date) => new Date(date).getTime() > Date.now());
}

export function deriveTicketStatus(statuses: SelectionStatus[]): TicketStatus {
  if (!statuses.length) return "PENDING";
  if (statuses.includes("CANCELLED")) return "CANCELLED";
  const active = statuses.filter((status) => status !== "VOID");
  if (!active.length) return "VOID";
  if (active.includes("LOST")) return "LOST";
  if (active.includes("PENDING")) return "PENDING";
  return "WON";
}
