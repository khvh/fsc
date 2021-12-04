import { Inject, Service } from 'typedi';
import { MemberRepository } from '../entities/member.entity';

@Service()
export class TestService {
  @Inject() member: MemberRepository;

  async one(id) {
    return await this.member.findById(id);
  }

  async testMembers() {
    return await this.member.findAll();
  }
}
