import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { AddModuleInput, AdsetInput, RegionNameInput } from './adset.input';
import { AdSet, Tree } from './adset.dto/adset.interface';
import * as tree from '../../tree.json';
import { InjectModel } from '@nestjs/sequelize';
import Geolocation from 'src/modules/databases/sqlite/models/geolocation.model';
import ModuleModel from 'src/modules/databases/sqlite/models/module.model';
import Monetization from 'src/modules/databases/sqlite/models/monetization.model';
import MonetizationOption from 'src/modules/databases/sqlite/models/monetization.option.model';
import Push from 'src/modules/databases/sqlite/models/push.model';
import PushOption from 'src/modules/databases/sqlite/models/push.option.model';
import CalculateService from 'src/modules/calculate/calculate.service';
import Module from 'module';

@Injectable()
export default class AdsetService implements OnModuleInit {
  constructor(
    @InjectModel(Geolocation, 'sqlite')
    private readonly modelGeo: typeof Geolocation,
    @InjectModel(ModuleModel, 'sqlite')
    private readonly modelModule: typeof ModuleModel,
    @InjectModel(Push, 'sqlite')
    private readonly modelPush: typeof Push,
    @InjectModel(PushOption, 'sqlite')
    private readonly modelPushOption: typeof PushOption,
    @InjectModel(Monetization, 'sqlite')
    private readonly modelMonetization: typeof Monetization,
    @InjectModel(MonetizationOption, 'sqlite')
    private readonly modelMonetizationOption: typeof MonetizationOption,

    private readonly calculateService: CalculateService,
  ) {}
  async onModuleInit() {
    console.log(
      'Module initialized. I will using this to run creating test tree data',
    );
  }

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

  async config({ geo }: AdsetInput) {}

  async fulltree() {
    const all_geo = await this.modelGeo.findAll({
      attributes: ['id', 'region_name', 'probability'],
      include: [
        {
          attributes: ['id'],
          model: ModuleModel,
          include: [
            {
              attributes: ['id', 'probability'],
              model: Monetization,
              include: [
                {
                  attributes: ['id', 'name', 'probability'],
                  model: MonetizationOption,
                },
              ],
            },
            {
              attributes: ['id', 'probability'],
              model: Push,
              include: [
                {
                  attributes: ['id', 'name', 'probability'],
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
      probability = probability / (total_count + 1);
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
    return geo.destroy().then(async () => {
      // net make recalculate

      console.log(`Геолокация ${region_name} удалена`.red);

      const geos = await this.modelGeo.findAll();
      const new_probability =
        this.calculateService.recalculate_even_probability(geos.length);
      for (const geo of geos) {
        await geo
          .update({
            probability: new_probability,
          })
          .then(() => {
            console.log(
              `probability updated ${geo.region_name} = ` +
                `${new_probability}`,
            );
          });
      }
    });
  }

  async add_module({ region, type }: AddModuleInput) {
    const region_name = region.toLocaleUpperCase();
    const geo = await this.modelGeo.findOne({
      rejectOnEmpty: new NotFoundException(
        `Геолокация ${region_name} - не найдена или удалена`,
      ),
      where: {
        region_name,
      },
      include: [
        {
          model: ModuleModel,
        },
      ],
    });
    const r_geo_id = geo.id;
    const module = await this.modelModule.findOne({
      where: {
        r_geo_id,
      },
      include: [Push, Monetization],
    });
    if (!module) {
      return await this.modelModule
        .create({
          r_geo_id,
        })
        .then(async (result_module) => {
          //type coming from query url so it's typeof string value, this is why i am using == for compare
          if (type == 1) {
            return await this.recalc_and_create_push(result_module.id);
          }
          if (type == 2) {
            return await this.recalc_and_create_monetization(result_module.id);
          }
        });
    } else {
      console.log('Модуль уже создан. Проверяем тип.'.green);

      if (type == 1) {
        console.log('push'.yellow, module);
        if (module.dataValues.Push) {
          throw new Error('У данного модуля уже есть пуш.');
        } else {
          return await this.recalc_and_create_push(module);
        }
      }
      if (type == 2) {
        if (module.dataValues.Monetization) {
          throw new Error('У данного модуля уже есть монетизация.');
        } else {
          return await this.recalc_and_create_monetization(module.id);
        }
      }
    }
  }

  async recalc_and_create_push(module: ModuleModel) {
    let probability: number = 100;
    const monet_prob = module.Monetization?.probability;
    if (monet_prob) {
      probability = probability - monet_prob;
    }
    return await this.modelPush.create({
      r_module_id: module.id,
      probability,
    });
  }

  async recalc_and_create_monetization(module: ModuleModel) {
    let probability: number = 100;
    const push_prob = module.Push?.probability;
    if (push_prob) {
      probability = probability - push_prob;
    }
    return await this.modelMonetization.create({
      r_module_id: module.id,
      probability,
    });
  }

  async createOptionMonetization(
    name: string,
    probability: number,
    r_monetization_id: number,
  ) {
    return await this.modelMonetizationOption.create({
      name,
      probability,
      r_monetization_id,
    });
  }

  async createOptionPush(name: string, probability: number, r_push_id: number) {
    return await this.modelPushOption.create({
      name,
      probability,
      r_push_id,
    });
  }
}
