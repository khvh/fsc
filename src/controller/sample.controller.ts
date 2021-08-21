import { FastifyRequest } from 'fastify';
import { Service } from 'typedi';
import { Controller } from '../decorators/controller';
import { Get, Post } from '../decorators/handler';

@Controller('/')
@Service()
export class SampleController {
  @Get('/')
  async someMethod(rep, res) {
    return { status: true };
  }

  @Post('/kek')
  async postMethod(rep: FastifyRequest, res) {
    console.log(rep.body);
    return { status: 'ok' };
  }
}
