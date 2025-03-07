import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { AddModuleInput, AdsetInput, RegionNameInput } from './adset.input';
import { AdSet, Tree } from './adset.dto/adset.interface';
import { InjectModel } from '@nestjs/sequelize';
import Geolocation from 'src/modules/databases/sqlite/models/geolocation.model';
import ModuleModel from 'src/modules/databases/sqlite/models/module.model';
import Monetization from 'src/modules/databases/sqlite/models/monetization.model';
import MonetizationOption from 'src/modules/databases/sqlite/models/monetization.option.model';
import Push from 'src/modules/databases/sqlite/models/push.model';
import PushOption from 'src/modules/databases/sqlite/models/push.option.model';
import CalculateService from 'src/modules/calculate/calculate.service';
import { round } from 'src/utils/round';

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

  async config({ geo }: AdsetInput) {
    const geo_module = await this.modelGeo.findOne({
      attributes: ['id', 'region_name', 'probability'],
      where: {
        region_name: geo.toLocaleUpperCase(),
      },
      include: [
        {
          attributes: ['id', 'r_geo_id'],
          model: ModuleModel,
          include: [
            {
              attributes: ['id', 'r_module_id', 'probability'],
              model: Push,
              include: [
                {
                  attributes: ['id', 'r_push_id', 'name', 'probability'],
                  limit: 1,
                  order: [['probability', 'DESC']],
                  model: PushOption,
                },
              ],
            },
            {
              attributes: ['id', 'r_module_id', 'probability'],
              model: Monetization,
              include: [
                {
                  attributes: [
                    'id',
                    'r_monetization_id',
                    'name',
                    'probability',
                  ],
                  limit: 1,
                  order: [['probability', 'DESC']],
                  model: MonetizationOption,
                },
              ],
            },
          ],
        },
      ],
    });
    return geo_module;
  }

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
  /**
   * Добавляет строку геолокации в общий пулл.
   * Перерасчитывает вероятности поровну соразмерно количеству строк в таблице 50/50 33/33/33 25/25/25/25
   */
  async add_geo(region: string) {
    let probability: number = 100;
    const region_name = region.toLocaleUpperCase();
    const all_geolocations = await this.modelGeo.findAll();
    const total_count = all_geolocations.length;
    if (total_count > 0) {
      probability = probability / (total_count + 1);
      console.log(region_name, probability);
      for (const geo of all_geolocations) {
        await geo.update({
          probability: round(probability),
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
      include: [{ model: Push }, { model: Monetization }],
    });
    if (!module) {
      console.log('МОДУЛЯ НЕ СУЩЕСТВУЕТ!'.red, 'Cоздаю новый модуль');
      return await this.modelModule
        .create({
          r_geo_id,
        })
        .then(async (result_module) => {
          await this.recalc_and_create(result_module, Number(type));
        });
    } else {
      console.log('Модуль уже создан. Проверяем тип.'.green);
      await this.recalc_and_create(module, Number(type));
    }
  }

  async recalc_and_create(module: ModuleModel, type: number) {
    let probability: number = 100;
    switch (type) {
      //Создаю пуш для родительского модуля
      case 1: {
        console.log('module', module);
        if (module.dataValues.Push) throw Error('Пуш у модуля уже существует');
        const monet_prob = module.dataValues.Monetization?.probability;
        console.log(monet_prob || 'Монетизация не найдена'.yellow);
        if (monet_prob) {
          //радномное число
          probability = round(Math.random() * 100);
          module.dataValues.Monetization!.update({
            probability: probability,
          });
          return await this.modelPush.create({
            probability: round(100 - probability),
            r_module_id: module.id,
          });
        }
        console.log('creating push with 100 probability');
        await this.modelPush.create({
          r_module_id: module.id,
          probability,
        });
      }
      // Создаю монетизацию для родительского модуля
      case 2: {
        if (module.dataValues.Monetization)
          throw Error('Монетизация у этого модуля уже есть');
        const push_prob = module.dataValues.Push?.probability;
        console.log(push_prob);
        if (push_prob) {
          //рандомное число
          probability = round(Math.random() * 100);
          module.dataValues.Push!.update({
            probability: probability,
          });
          return await this.modelMonetization.create({
            probability: round(100 - probability),
            r_module_id: module.id,
          });
        }
      }
    }
  }

  async recalc_and_create_push(module: ModuleModel) {
    let probability: number = 100;
    const monet_prob = module.Monetization?.probability;
    if (monet_prob) {
      console.log('monet_prob'.yellow, monet_prob);
      probability = probability - monet_prob;
    } else {
      probability = Math.random() * probability;
      console.log('Push - Math.random()', probability);
    }
    console.log('recalc_and_create_push'.yellow, module.id, probability);
    return await this.modelPush.create({
      r_module_id: module.id,
      probability: round(probability),
    });
  }

  async recalc_and_create_monetization(module: ModuleModel) {
    let probability: number = 100;
    const push_prob = module.Push?.probability;
    if (push_prob) {
      console.log('push_prob'.yellow, push_prob);
      probability = probability - push_prob;
    } else {
      probability = Math.random() * probability;
      console.log('Monet - Math.random()'.blue, probability);
    }
    console.log('recalc_and_create_monetization', module.id, probability);
    return await this.modelMonetization.create({
      r_module_id: module.id,
      probability: round(probability),
    });
  }

  async createOptionMonetization(name: string, r_monetization_id: number) {
    // checking monetization
    await this.modelMonetization.findOne({
      where: {
        id: r_monetization_id,
      },
      rejectOnEmpty: new Error(
        `ID монетизации = ${r_monetization_id} не валиден. Монетизация с таким id не найдена `,
      ),
    });
    // initialize probability
    let probability: number = 100;
    const remainingTotal = round(Math.random() * 100);
    probability -= remainingTotal;
    const options = await this.modelMonetizationOption.findAll();
    // if prev values exists
    if (options.length > 0) {
      for (let i = 0; i < options.length; i++) {
        const isLast = i === options.length - 1;
        const value = isLast ? probability : Math.random() * probability;
        probability -= value;
        const rv = round(value);
        console.log(options[i].id, rv);
        options[i].update({
          probability: rv,
        });
      }
      console.log('for new', remainingTotal);
      return await this.modelMonetizationOption.create({
        name,
        probability: round(remainingTotal),
        r_monetization_id,
      });
    }
    // if NO VALUES EXISTS taking 100 probability
    else {
      probability = 100;
      return await this.modelMonetizationOption.create({
        name,
        probability: round(probability),
        r_monetization_id,
      });
    }
  }

  async createOptionPush(name: string, r_push_id: number) {
    // checking monetization
    await this.modelPush.findOne({
      where: {
        id: r_push_id,
      },
      rejectOnEmpty: new Error(
        `ID пуша = ${r_push_id} не валиден. Пуш с таким id не найдена `,
      ),
    });
    // initialize probability
    let probability: number = 100;
    const remainingTotal = round(Math.random() * 100);
    probability -= remainingTotal;
    const options = await this.modelPushOption.findAll();
    // if prev values exists
    if (options.length > 0) {
      for (let i = 0; i < options.length; i++) {
        const isLast = i === options.length - 1;
        const value = isLast ? probability : Math.random() * probability;
        probability -= value;
        //options[i].probability = value;
        //options[i].save();
        const rv = round(value);
        options[i].update({
          probability: rv,
        });
      }
      console.log(remainingTotal);
      return await this.modelPushOption.create({
        name,
        probability: round(remainingTotal),
        r_push_id,
      });
    }
    // if NO VALUES EXISTS taking 100 probability
    else {
      probability = 100;
      return await this.modelPushOption.create({
        name,
        probability: round(probability),
        r_push_id,
      });
    }
  }
}
