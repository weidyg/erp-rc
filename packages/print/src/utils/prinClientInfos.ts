import { PrintClientType } from '../types';

export const prinClientInfos: Record<PrintClientType, { name: string; wsUrl: string; wssUrl?: string }> = {
  ['cainiao']: { name: '菜鸟', wsUrl: 'ws://localhost:13528', wssUrl: 'wss://localhost:13529' },
  ['doudian']: { name: '抖店', wsUrl: 'ws://localhost:13888', wssUrl: 'wss://localhost:13999' },
  ['pinduoduo']: { name: '拼多多', wsUrl: 'ws://localhost:5000', wssUrl: 'ws://localhost:18653' },
  ['kuaishou']: { name: ' 快手', wsUrl: 'ws://localhost:16888/ks/printer', wssUrl: 'wss://localhost:16889/ks/printer' },
  ['jingdong']: { name: '京东', wsUrl: 'ws://localhost:9113', wssUrl: '' },
};
