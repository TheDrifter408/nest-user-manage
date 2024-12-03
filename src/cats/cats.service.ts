import { Injectable } from '@nestjs/common';

export type Cat = {
  id: number;
  name: string;
};

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [
    {
      id: 1,
      name: 'cat 1',
    },
    {
      id: 2,
      name: 'cat 2',
    },
    {
      id: 3,
      name: 'cat 3',
    },
  ];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }

  findOne(id: number): Cat | string {
    const cat = this.cats.find((cat) => cat.id === id);
    if (cat) {
      return cat;
    }
    return 'Not found';
  }
}
