import { Service } from "typedi";
import {
  Between, EntityRepository, Repository
} from "typeorm";
import moment from "moment";

import { Journal } from "../entity";

@Service()
@EntityRepository(Journal)
export class JournalRepository extends Repository<Journal> {
  async findByDate(date: Date): Promise<Journal[]> {
    const start = moment(date).startOf("day").toDate();
    const end = moment(date).endOf("day").toDate();
    return this.findByDateBetween(start, end);
  }

  async findByDateBetween(start: Date, end: Date): Promise<Journal[]> {
    return this.find({ date: Between(start, end) });
  }
}
