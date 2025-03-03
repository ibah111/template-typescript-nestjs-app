import { Injectable } from '@nestjs/common';

@Injectable()
export default class CalculateService {
  //const randomElement = array[Math.floor(Math.random() * array.length)];

  public recalculate_even_probability(total_count: number): number {
    let even_probability: number = 100;
    if (total_count > 0) {
      even_probability = even_probability / total_count;
      return even_probability;
    }
    return even_probability;
  }
}
