import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Journal, User } from "../entity";
import { JournalRepository } from "../repo";

@Service()
export class JournalService {
  @InjectRepository()
  private readonly journalRepository!: JournalRepository

  async accessibleBy(journal: Journal, user: User): Promise<boolean> {
    const journalOwner = await this.journalRepository.loadOwner(journal);
    return journalOwner.userId === user.userId;
  }
}
