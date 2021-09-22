import { FastifyRequest } from 'fastify';
import { Inject, Service } from 'typedi';
import { Authorize } from '..';
import { Controller } from '../decorators/controller';
import { Context } from '../decorators/entities';
import { Get, Post } from '../decorators/handler';
import { Member } from '../entities/test.entity';
import { TestService } from '../services/test.service';

@Controller('/')
@Service()
export class SampleController {
  @Inject() s: TestService;

  // @Authorized({ roles: ['admin'] })
  @Get('/')
  @Authorize()
  async someMethod({ currentUser }: Context) {
    const s = await this.s.testMembers();
    return { s, currentUser };
  }

  @Post('/kek')
  async postMethod(rep: FastifyRequest, res) {
    console.log(rep.body);
    return { status: 'ok' };
  }

  @Post('/interface/:id')
  async test(c: Context<Member>) {
    console.log('======================================');
    console.log(c.currentUser, c.body, c.params, c.query, c.authorization);
    console.log('======================================');

    return {};
  }
}
