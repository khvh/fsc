import { FastifyRequest } from 'fastify';
import { Inject, Service } from 'typedi';
import { Authorize } from '..';
import { Controller } from '../decorators/controller';
import { Context } from '../decorators/entities';
import { Get, Post } from '../decorators/handler';
import { MemberRepository } from '../entities/member.entity';
import { TestService } from '../services/test.service';

@Controller('/')
@Service()
export class SampleController {
  @Inject() s: TestService;
  @Inject() memberRepository: MemberRepository;

  @Get('/', {
    schema: {
      description: 'This is an endpoint to test if DB is working'
    }
  })
  @Authorize()
  async someMethod({ currentUser }: Context) {
    const members = await this.s.testMembers();

    return members;
  }

  @Get('/:id')
  async one(c: Context<any>) {
    const m = await this.s.one(c.params.id);

    return m;
  }

  @Get('/odm/testall')
  async odmTest() {
    const res = this.memberRepository.deleteById('61aba60b2816f66c3f84b857');

    return res;
  }

  @Post('/kek')
  @Authorize({ roles: ['admin'] })
  async postMethod(rep: FastifyRequest, res) {
    return { status: 'ok' };
  }

  @Post('/interface/:id')
  async test(c: Context<any>) {
    console.log('======================================');
    console.log(c.currentUser, c.body, c.params, c.query, c.authorization);
    console.log('======================================');

    return {};
  }
}
