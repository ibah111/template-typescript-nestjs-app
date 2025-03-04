import { Injectable } from '@nestjs/common';
import { round } from 'src/utils/round';

@Injectable()
export default class CalculateService {
  //const randomElement = array[Math.floor(Math.random() * array.length)];

  public recalculate_even_probability(total_count: number): number {
    let even_probability: number = 100;
    if (total_count > 0) {
      even_probability = even_probability / (total_count + 1);
      return even_probability;
    }
    return round(even_probability);
  }
}
