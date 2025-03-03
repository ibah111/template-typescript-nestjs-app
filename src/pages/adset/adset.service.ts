import { Injectable } from '@nestjs/common';
import { AdsetInput } from './adset.input';

@Injectable()
export default class AdsetService {
  constructor() {}

  public async config(body: AdsetInput) {}
}
