import { ModelCtor } from 'sequelize-typescript';
import Module from './module.model';
import Monetization from './monetization.model';
import PushOption from './push.option.model';
import Geolocation from './geolocation.model';
import Push from './push.model';
import MonetizationOption from './monetization.option.model';

export const models: ModelCtor[] = [
  Module,
  Monetization,
  MonetizationOption,
  Push,
  PushOption,
  Geolocation,
];
