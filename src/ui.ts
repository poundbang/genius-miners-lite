import {
  button,
  copyable,
  divider,
  heading,
  panel,
  row,
  spinner,
  text,
} from '@metamask/snaps-sdk';

import { handleGetMinerTotalPps } from './chain';
import { Config } from './config';
import { buildDaysLeft, calcEarnings, calcROI } from './util';

/**
 * Function homePageUI - builds a homepage UI.
 * @param account - Account in Metamask.
 * @returns Interface id.
 */
export async function homePageUI(account: string) {
  return await snap.request({
    method: 'snap_createInterface',
    params: {
      ui: panel([
        heading('Hi fellow Genius!'),
        text(
          'We would like to show you a quick summary of your miners for the following account:',
        ),
        copyable(text(account)),
        text('If all is good, please continue. It should be a snap!'),
        button({
          value: '⚒️View Miners',
          name: 're-acct-btn',
          buttonType: 'button',
        }),
        button({
          value: '📍View Guide',
          variant: 'secondary',
          name: 're-legend-btn',
          buttonType: 'button',
        }),
        divider(),
        text(
          'To learn more about your miners visit [Genius dApp](https://start.geni.app)',
        ),
        divider(),
        text('_Brought to you by [Geni.best](https://geni.best)_ 😎'),
      ]),
    },
  });
}

/**
 * Builds a loader while miners are being fetched.
 * @param id - Interface id.
 * @returns Alert dialog.
 */
export async function fetchMinersUI(id: string) {
  return await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: panel([
        text({
          value: `Fetching miners`,
        }),
        spinner(),
      ]),
    },
  });
}

/**
 * Builds UI dialog for showing details of this snap and miner legend.
 * @returns Promise dialog.
 */
export async function guideMinersUI() {
  return await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([
        heading('Miner Information Legend'),
        divider(),
        text('💰-Principal (Geni)'),
        text('🍕-IQ-Shares (Share #)'),
        text('🏁-Start day'),
        text('🤞-Promise days'),
        text('⏰-Ending day'),
        text('👊-Earned (Geni)'),
        text('🟢-Miner in good standing'),
        text('🟠-Miner is in grace period'),
        text('🔴-Miner is late'),
        divider(),
        text({
          value:
            '_Example 🏁: 50, 🤞:500, ⏰: 550, 🍕: 400, 💰: 10000, 🟢 125 days left_',
          markdown: true,
        }),
        text(
          'Miner locked 10000 Geni, received 400 shares, started on day *50*, promised to run for *500* days, and ends on day *550*. It is in good standing, and ends in 125 days.',
        ),
      ]),
    },
  });
}

/**
 * Builds UI dialog for showing miners that were fetched form chain.
 * @param rows - Rows of miners with details.
 * @returns Promise dialog.
 */
export async function showMinersUI(rows: any) {
  return await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([...rows]),
    },
  });
}

/**
 * Builds UI dialog for showing No miners were fetched form chain.
 * @returns Promise dialog.
 */
export async function showNoMinersUI() {
  return await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([
        text(
          'No miners found for account. Check your settings or create some miners!',
        ),
      ]),
    },
  });
}

/**
 * Builds UI dialog for onInstall handler.
 * @returns Promise dialog.
 */
export async function onInstallUI() {
  return await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([
        heading('Installation successful'),
        text('The Genius Miners snap was installed successfully.'),
      ]),
    },
  });
}

/**
 * Builds UI dialog for onUpdate handler.
 * @returns Promise dialog.
 */
export async function onUpdateUI() {
  return await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([
        heading('Update successful'),
        text('The Genius Miners snap was updated successfully.'),
        text('New features added in this version: icons'),
      ]),
    },
  });
}

/**
 * Shows notification in MM log UI.
 * @param variant - Decoration of notification message.
 * @param source - Facility generating message.
 * @param message - Actual notice.
 * @returns Promise.
 */
export async function showNotifyUI(
  variant: string,
  source: string,
  message: string,
) {
  return await snap.request({
    method: 'snap_notify',
    params: {
      type: 'inApp',
      message: `${variant} ${source}, ${message}`,
    },
  });
}

/**
 * Builds a miner detail list for the UI.
 * @param currentGeniusDay - Genius day.
 * @param miners - A list of miner stores for each miner.
 * @returns Rows of UI entries.
 */
export async function buildMinerUI(currentGeniusDay: number, miners: any[]) {
  const rows: any[] = [];
  /* Miner record:
    'policy', 'auctioned', 'exodus', 'startDay', 'promiseDays', 'lemClaimDay',
    'shares', 'penaltyDelta', 'nonTransferable', 'ended', 'principal', 'debtIssueRate',
  */

  rows.push(heading(`📅 Genius Day: ${currentGeniusDay}`));
  rows.push(divider());
  for (const miner of miners[0]) {
    const minerR = miner.toString().split(',');

    console.log(minerR);
    // Skip ended, share reclaimed and auctioned miners
    if (minerR[1] === 'true' || minerR[9] !== '0' || miner[2] === 'true') {
      continue;
    }

    // Policy
    const minerPolicy = minerR[0] === 'true';

    // Principal [10] -> [0]
    const principal =
      Number(minerR[10]) / Math.pow(10, Config.chain.geniDecimals);

    // IQShares [6] -> [1]
    const iqShares =
      Number(minerR[6]) / Math.pow(10, Config.chain.shareDecimals);

    // StartDay [3] -> [2]
    const startDay = Number(minerR[3]);

    // Promise [4] -> [3]
    const promiseDays = Number(minerR[4]);

    // Start day + promise
    const willEnd = startDay + promiseDays;

    try {
      const daysLeftMsg = buildDaysLeft(
        startDay + promiseDays - currentGeniusDay,
      );

      const minerTotalPps = await handleGetMinerTotalPps(
        startDay,
        currentGeniusDay - 1,
        minerPolicy,
      );

      // Calculate earnings
      const earn = calcEarnings(iqShares, minerTotalPps);

      // Calculate ROI
      const roi = calcROI(earn, principal);

      // Build UI
      const node = row({
        label: `Days:🏁:${startDay}|🤞:${promiseDays}|⏰:${willEnd}|${daysLeftMsg}|
        💰:${principal.toLocaleString()} Geni|🍕:${iqShares.toLocaleString()}`,
        value: text({
          value: `Earned 👊:**${earn.toLocaleString()}** Geni @ ROI: _${roi.toLocaleUpperCase()}%_`,
          markdown: true,
        }),
      });
      rows.push(node);
      rows.push(divider());
    } catch (error) {
      console.error(error);
    }
  }
  return rows;
}
