import { ObjectId } from 'bson';
import { Service } from 'typedi';
import { CrudRepository } from '../odm';

export interface MemberModel {
  _id?: ObjectId;
  first: string;
  last: string;
}

@Service()
export class MemberRepository extends CrudRepository<MemberModel> {
  tableName() {
    return 'members';
  }
}
