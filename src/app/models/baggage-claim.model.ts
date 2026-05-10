export type ClaimStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED';

export interface BaggageClaim {
  id: number;
  flightNumber: string;
  description: string;
  status: ClaimStatus;
  createdAt: string;
  updatedAt: string;
}
