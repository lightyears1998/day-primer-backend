import { Service } from "typedi";
import {
  Between, EntityRepository, Repository
} from "typeorm";
import moment from "moment";

import { Journal } from "../entity";

@Service()
@EntityRepository(Journal)
export class JournalRepository extends Repository<Journal> {
  async findByDay(day: Date): Promise<Journal[]> {
    const start = moment(day).startOf("day").toDate();
    const end = moment(day).endOf("day").toDate();
    return this.find({ date: Between(start, end) });
  }
}
