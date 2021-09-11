import { Model } from 'objection';
import { Service } from 'typedi';

@Service()
export class Member extends Model {
  static tableName = 'members';
}
