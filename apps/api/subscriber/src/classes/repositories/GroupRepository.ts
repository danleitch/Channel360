import { Group, GroupDoc } from "@models/group";
import { BaseRepository } from "./BaseRepository";

export class GroupRepository extends BaseRepository<GroupDoc> {
  constructor() {
    super(Group);
  }
}

export default new GroupRepository();
