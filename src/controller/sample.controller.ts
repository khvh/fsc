import { FastifyRequest } from 'fastify';
import { Inject, Service } from 'typedi';
import { Controller } from '../decorators/controller';
import { Get, Post } from '../decorators/handler';
import { TestService } from '../services/test.service';

@Controller('/')
@Service()
export class SampleController {
  @Inject() s: TestService;

  @Get('/')
  async someMethod(rep, res) {
    return { s: this.s.test() };
  }

  @Post('/kek')
  async postMethod(rep: FastifyRequest, res) {
    console.log(rep.body);
    return { status: 'ok' };
  }
}
