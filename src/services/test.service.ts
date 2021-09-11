import { Service } from 'typedi';
import { Member } from '../model/member.model';

@Service()
export class TestService {
  test() {
    return true;
  }

  testMembers() {
    return Member.query();
  }
}
