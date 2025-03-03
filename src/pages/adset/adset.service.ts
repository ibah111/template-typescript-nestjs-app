import { Injectable } from '@nestjs/common';
import { AdsetInput } from './adset.input';
import { AdSet, Tree } from './adset.dto/adset.interface';
import * as tree from '../../tree.json';

@Injectable()
export default class AdsetService {
  private readonly tree: Tree = tree;

  private selectNode(options: { name: string; probability: number }[]): string {
    const total = options.reduce((sum, opt) => sum + opt.probability, 0);
    const rand = Math.random() * total;
    let cumulative = 0;
    for (const opt of options) {
      cumulative += opt.probability;
      if (rand < cumulative) {
        return opt.name;
      }
    }
    return options[0].name; // fallback
  }

  generateAdSet({ geo }: AdsetInput): AdSet {
    const adSet: AdSet = {
      adset_id: Math.floor(Math.random() * 90000) + 10000,
      modules: [{ type: 'geo', name: geo }],
    };

    const geoNode = this.tree.root.geo[geo];
    if (!geoNode) {
      throw new Error('Geo not found');
    }

    for (const [moduleType, moduleData] of Object.entries(geoNode.modules)) {
      if (Math.random() * 100 < moduleData.probability) {
        const selectedOption = this.selectNode(moduleData.options);
        adSet.modules.push({ type: moduleType, name: selectedOption });
      }
    }

    return adSet;
  }
}
