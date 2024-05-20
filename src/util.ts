import { Config } from './config';

/**
 * Sleeps for `ms` milliseconds.
 * @param ms - Milliseconds.
 * @returns Promise.
 */
export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculates Miner earnings from TotalPPS.
 * @param iqShares - IQ Shares.
 * @param minerEarnings - Miner Total PPS.
 * @returns Miner earnings.
 */
export function calcEarnings(iqShares: number, minerEarnings: number) {
  return Number(
    (
      (iqShares * minerEarnings) /
      Math.pow(10, Config.chain.geniDecimals)
    ).toFixed(2),
  );
}

/**
 * Calculates Miner ROI from principal and PPS.
 * @param earn - Earned total PPS.
 * @param principal - Miner principal.
 * @returns Miner ROI.
 */
export function calcROI(earn: number, principal: number) {
  return ((earn * 100) / principal).toFixed(2);
}

/**
 * Builds miner days lef message.
 * @param daysLeft - Days Left.
 * @returns Days Left message.
 */
export function buildDaysLeft(daysLeft: number){
  let daysLeftMsg: string;
  switch (true) {
    case daysLeft >= Config.ui.dates.ok:
      daysLeftMsg = ['🟢', daysLeft, 'left'].join(' ');
      break;
    case daysLeft <= Config.ui.dates.late:
      // Code to execute if value equals 0
      daysLeftMsg = ['🔴', daysLeft, 'late'].join(' ');
      break;
    default:
      daysLeftMsg = ['🟠', daysLeft, 'grace'].join(' ');
      break;
  }
  return daysLeftMsg;
}
