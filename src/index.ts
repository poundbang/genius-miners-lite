import type {
  OnHomePageHandler,
  OnInstallHandler,
  OnUpdateHandler,
  OnUserInputHandler,
} from '@metamask/snaps-sdk';
import { UserInputEventType } from '@metamask/snaps-sdk';

import { handleGetGeniusDay, handleGetMiners } from './chain';
import {
  buildMinerUI,
  fetchMinersUI,
  guideMinersUI,
  homePageUI,
  onInstallUI,
  onUpdateUI,
  showMinersUI,
  showNoMinersUI,
  showNotifyUI,
} from './ui';

// Vars
let accounts;
let currentGeniusDay = 0;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const onHomePage: OnHomePageHandler = async () => {
  let homePageInterfaceId = '';
  try {
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    console.debug(accounts);

    if (accounts !== undefined && accounts !== null) {
      homePageInterfaceId = await homePageUI(accounts[0]);
    }
  } catch (error) {
    console.log(error);
    await showNotifyUI('🔴', 'Account Request', error);
  }
  return { id: homePageInterfaceId };
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  console.debug(`id: ${id}, event: ${JSON.stringify(event)}`);
  if (event.type === UserInputEventType.ButtonClickEvent) {
    if (event.name === 're-legend-btn') {
      await guideMinersUI();
    }
    if (event.name === 're-acct-btn') {
      // Show Miners UI loader
      await fetchMinersUI(id);

      // Get Genius day
      currentGeniusDay = await handleGetGeniusDay();

      // Get miner store information
      const miners = await handleGetMiners(accounts[0]);

      // Do we have any miners?
      // If so, get miner earnings and build miner detail UI
      if (miners.toString().length > 0) {
        const rows = await buildMinerUI(currentGeniusDay, miners);
        await showMinersUI(rows);
      } else {
        await showNoMinersUI();
      }
    }
  }
};

/**
 * Handle installation of the snap.
 */
export const onInstall: OnInstallHandler = async () => {
  await onInstallUI();
};

/**
 * Handle updates to the snap.
 */
export const onUpdate: OnUpdateHandler = async () => {
  await onUpdateUI();
};
