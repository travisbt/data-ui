import { max as d3Max } from 'd3-array';
import caseInsensitiveSort from './caseInsensitiveSort';

/*
 * Computes the bin and value domains from numeric or categorical bins
 */
export default function computeDomainsFromBins({ binsByIndex, binType, valueKey }) {
  let binDomain;
  let valueDomain;

  Object.values(binsByIndex).forEach(bins => {
    const currValueMax = d3Max(bins, d => d[valueKey]);
    if (valueDomain) {
      valueDomain[1] = Math.max(currValueMax, valueDomain[1]);
    } else {
      valueDomain = [0, currValueMax];
    }

    if (binType === 'numeric') {
      if (binDomain) {
        binDomain[0] = Math.min(bins[0].bin0, binDomain[0]);
        binDomain[1] = Math.max(bins[bins.length - 1].bin1, binDomain[1]);
      } else {
        binDomain = [bins[0].bin0, bins[bins.length - 1].bin1];
      }
    } else {
      if (!binDomain) binDomain = {}; // use lookup to avoid lots of Array scans
      bins.forEach(bin => {
        binDomain[bin.bin] = true;
      });
    }
  });

  if (!Array.isArray(binDomain)) {
    binDomain = Object.keys(binDomain).sort(caseInsensitiveSort);
  }

  return { binDomain, valueDomain };
}
