import { Injectable, NotFoundException } from '@nestjs/common';
import { AdsetInput, RegionNameInput } from './adset.input';
import { AdSet, Tree } from './adset.dto/adset.interface';
import * as tree from '../../tree.json';
import { InjectModel } from '@nestjs/sequelize';
import Geolocation from 'src/modules/databases/sqlite/models/geolocation.model';
import Module from 'src/modules/databases/sqlite/models/module.model';
import Monetization from 'src/modules/databases/sqlite/models/monetization.model';
import MonetizationOption from 'src/modules/databases/sqlite/models/monetization.option.model';
import Push from 'src/modules/databases/sqlite/models/push.model';
import PushOption from 'src/modules/databases/sqlite/models/push.option.model';

@Injectable()
export default class AdsetService {
  constructor(
    @InjectModel(Geolocation, 'sqlite')
    private readonly modelGeo: typeof Geolocation,
  ) {}

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

  async config({ geo }: AdsetInput) {
    
  }

  async fulltree() {
    const all_geo = await this.modelGeo.findAll({
      attributes: ['id', 'region_name', 'probability'],
      include: [
        {
          model: Module,
          include: [
            {
              model: Monetization,
              include: [
                {
                  model: MonetizationOption,
                },
              ],
            },
            {
              model: Push,
              include: [
                {
                  model: PushOption,
                },
              ],
            },
          ],
        },
      ],
    });
    return all_geo;
  }

  async addgeo(region: string) {
    let probability: number = 100;
    const region_name = region.toLocaleUpperCase();
    const all_geolocations = await this.modelGeo.findAll();
    console.log(
      'ALL'.yellow,
      all_geolocations.map((res) => res.dataValues),
    );
    const total_count = all_geolocations.length;
    if (total_count > 0) {
      probability = probability / total_count;
      console.log(region_name, probability);
      for (const geo of all_geolocations) {
        await geo
          .update({
            probability,
          })
          .then((res) => {
            console.log(
              'Probability of Region ' + `${res.region_name}`.yellow,
              ' been updated to ' + `${probability}`.yellow,
            );
          });
      }
    }
    return await this.modelGeo.create({
      region_name,
      probability,
    });
  }

  async deletegeo({ region }: RegionNameInput) {
    const region_name = region.toLocaleUpperCase();
    const geo = await this.modelGeo.findOne({
      where: {
        region_name,
      },
      rejectOnEmpty: new NotFoundException(
        `Геолокация ${region_name} - не найдена или удалена`,
      ),
    });
    return geo.destroy().then(() => {
      // net make recalculate
      console.log(`Геолокация ${region_name} удалена`.red);
    });
  }
}
