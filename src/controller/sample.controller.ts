import { FastifyRequest } from 'fastify';
import { Inject, Service } from 'typedi';
import { Authorized } from '../decorators/authorized';
import { Context, Controller } from '../decorators/controller';
import { Get, Post } from '../decorators/handler';
import { Member } from '../entities/test.entity';
import { TestService } from '../services/test.service';

@Controller('/')
@Service()
export class SampleController {
  @Inject() s: TestService;

  @Authorized({ roles: ['admin'] })
  @Get('/')
  async someMethod(rep, res) {
    const s = await this.s.testMembers();
    return { s };
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
