export type AlgorithmType = 'LRU' | 'FIFO' | 'Optimal';

export interface PageState {
  pageNumber: number;
  frameIndex: number | null;
  isFault: boolean;
  isHit: boolean;
}

export interface SimulationStep {
  reference: number;
  frames: (number | null)[];
  fault: boolean;
  hit: boolean;
  evictedPage: number | null;
  description: string;
}

export interface SimulationResult {
  steps: SimulationStep[];
  totalFaults: number;
  totalHits: number;
  hitRatio: number;
}
