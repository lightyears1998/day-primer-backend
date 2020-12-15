import { Service } from "typedi";
import {
  Between, EntityRepository, Repository
} from "typeorm";
import moment from "moment";

import { Summary } from "../entity";

@Service()
@EntityRepository(Summary)
export class SummaryRepository extends Repository<Summary> {
  async findByDay(day: Date): Promise<Summary[]> {
    const start = moment(day).startOf("day").toDate();
    const end = moment(day).endOf("day").toDate();
    return this.find({ date: Between(start, end) });
  }
}
