export const Config = {
  ui: {
    dates: {
      late: -7,
      ok: 0,
    },
  },
  chain: {
    geniDecimals: 9,
    shareDecimals: 18,
    blockIdentifier: 'latest',
    contracts: {
      miners: {
        address: '0x4444444ffA9bD8AF854Ea4E353756b06472F4444',
        abi: [
          {
            inputs: [
              {
                internalType: 'address',
                name: 'owner',
                type: 'address',
              },
            ],
            name: 'getMiners',
            outputs: [
              {
                components: [
                  {
                    internalType: 'bool',
                    name: 'policy',
                    type: 'bool',
                  },
                  {
                    internalType: 'bool',
                    name: 'auctioned',
                    type: 'bool',
                  },
                  {
                    internalType: 'bool',
                    name: 'exodus',
                    type: 'bool',
                  },
                  {
                    internalType: 'uint16',
                    name: 'startDay',
                    type: 'uint16',
                  },
                  {
                    internalType: 'uint16',
                    name: 'promiseDays',
                    type: 'uint16',
                  },
                  {
                    internalType: 'uint16',
                    name: 'lemClaimDay',
                    type: 'uint16',
                  },
                  {
                    internalType: 'uint88',
                    name: 'rewardShares',
                    type: 'uint88',
                  },
                  {
                    internalType: 'uint96',
                    name: 'penaltyDelta',
                    type: 'uint96',
                  },
                  {
                    internalType: 'bool',
                    name: 'nonTransferable',
                    type: 'bool',
                  },
                  {
                    internalType: 'uint40',
                    name: 'ended',
                    type: 'uint40',
                  },
                  {
                    internalType: 'uint64',
                    name: 'principal',
                    type: 'uint64',
                  },
                  {
                    internalType: 'uint96',
                    name: 'debtIssueRate',
                    type: 'uint96',
                  },
                ],
                internalType: 'struct Miners.Miner[]',
                name: 'miners',
                type: 'tuple[]',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ],
      },
      calendar: {
        address: '0x44444489FA9588870d4e06003B516d54A2af4444',
        abi: [
          {
            inputs: [
              {
                internalType: 'uint256',
                name: 'startDay',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'lastServedDay',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'minerPolicy',
                type: 'bool',
              },
            ],
            name: 'minerTotalPps',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'getCurrentGeniusDay',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ],
      },
    },
  },
};
