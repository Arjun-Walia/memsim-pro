import { AlgorithmType, SimulationResult, SimulationStep } from '../types';

export function simulate(
  references: number[],
  frameCount: number,
  algorithm: AlgorithmType
): SimulationResult {
  const steps: SimulationStep[] = [];
  let frames: (number | null)[] = Array(frameCount).fill(null);
  let faults = 0;
  let hits = 0;

  // Track LRU or FIFO order
  // For LRU: index is frame, value is last access time
  const accessTimes: number[] = Array(frameCount).fill(-1);
  // For FIFO: index is frame, value is load time
  const loadTimes: number[] = Array(frameCount).fill(-1);

  references.forEach((ref, time) => {
    const existingIndex = frames.indexOf(ref);
    let isHit = false;
    let isFault = false;
    let evictedPage: number | null = null;

    if (existingIndex !== -1) {
      // Hit
      hits++;
      isHit = true;
      if (algorithm === 'LRU') {
        accessTimes[existingIndex] = time;
      }
    } else {
      // Fault
      faults++;
      isFault = true;
      
      const emptyIndex = frames.indexOf(null);
      if (emptyIndex !== -1) {
        // Free frame available
        frames[emptyIndex] = ref;
        accessTimes[emptyIndex] = time;
        loadTimes[emptyIndex] = time;
      } else {
        // Eviction needed
        let evictIndex = 0;

        if (algorithm === 'FIFO') {
          evictIndex = loadTimes.indexOf(Math.min(...loadTimes));
        } else if (algorithm === 'LRU') {
          evictIndex = accessTimes.indexOf(Math.min(...accessTimes));
        } else if (algorithm === 'Optimal') {
          let farthestUse = -1;
          for (let i = 0; i < frameCount; i++) {
            const nextUse = references.slice(time + 1).indexOf(frames[i]!);
            if (nextUse === -1) {
              evictIndex = i;
              break;
            }
            if (nextUse > farthestUse) {
              farthestUse = nextUse;
              evictIndex = i;
            }
          }
        }

        evictedPage = frames[evictIndex];
        frames[evictIndex] = ref;
        accessTimes[evictIndex] = time;
        loadTimes[evictIndex] = time;
      }
    }

    steps.push({
      reference: ref,
      frames: [...frames],
      fault: isFault,
      hit: isHit,
      evictedPage,
      description: isHit 
        ? `Page ${ref} hit in Frame ${frames.indexOf(ref)}`
        : evictedPage !== null 
          ? `Page ${ref} loaded, Page ${evictedPage} evicted from Frame ${frames.indexOf(ref)}`
          : `Page ${ref} loaded into Frame ${frames.indexOf(ref)}`
    });
  });

  return {
    steps,
    totalFaults: faults,
    totalHits: hits,
    hitRatio: references.length > 0 ? (hits / references.length) * 100 : 0
  };
}
