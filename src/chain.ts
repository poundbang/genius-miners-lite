import { ethers } from 'ethers';

import { Config } from './config';
import { showNotifyUI } from './ui';

export const handleGetGeniusDay = async () => {
  const methGetCurrentGeniusDay = 'getCurrentGeniusDay';
  const methGetCurrentGeniusDayParam: string[] = [];

  const iface = new ethers.Interface(Config.chain.contracts.calendar.abi);

  const encodedData = iface.encodeFunctionData(
    methGetCurrentGeniusDay,
    methGetCurrentGeniusDayParam,
  );

  const resultData = await ethereum.request({
    method: 'eth_call',
    params: [
      {
        to: Config.chain.contracts.calendar.address,
        data: encodedData,
      },
      Config.chain.blockIdentifier,
    ],
  });

  try {
    const result = iface.decodeFunctionResult(
      methGetCurrentGeniusDay,
      resultData,
    );
    return Number(result[0]);
  } catch (error) {
    console.error('error: ', error);
    await showNotifyUI('🔴', 'Chain: Genius Day', error);
    return Number(0);
  }
};

export const handleGetMiners = async (account: string) => {
  const methGetMiners = 'getMiners(address)';
  const methGetMinersParam = [account];

  const iface = new ethers.Interface(Config.chain.contracts.miners.abi);

  const encodedData = iface.encodeFunctionData(
    methGetMiners,
    methGetMinersParam,
  );

  const resultData = await ethereum.request({
    method: 'eth_call',
    params: [
      {
        to: Config.chain.contracts.miners.address,
        data: encodedData,
      },
      Config.chain.blockIdentifier,
    ],
  });

  try {
    const result = iface.decodeFunctionResult(methGetMiners, resultData);
    return result.toArray();
  } catch (error) {
    console.error('error: ', error);
    await showNotifyUI('🔴', 'Chain: Genius Day', error);
  }

  return [];
};

export const handleGetMinerTotalPps = async (
  startDay: number,
  lastServedDay: number,
  minerPolicy: boolean,
) => {
  const methGetMinerEarnings = 'minerTotalPps(uint256,uint256,bool)';
  const methGetMinerEarningsParam = [startDay, lastServedDay, minerPolicy];

  console.log(methGetMinerEarningsParam);
  const iface = new ethers.Interface(Config.chain.contracts.calendar.abi);

  const encodedData = iface.encodeFunctionData(
    methGetMinerEarnings,
    methGetMinerEarningsParam,
  );
  console.warn(encodedData);
  const resultData = await ethereum.request({
    method: 'eth_call',
    params: [
      {
        to: Config.chain.contracts.calendar.address,
        data: encodedData,
      },
      Config.chain.blockIdentifier,
    ],
  });

  console.warn(resultData);
  const result = iface.decodeFunctionResult('minerTotalPps', resultData);

  return Number(result[0]);
};
