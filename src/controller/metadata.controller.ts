import { Inject, Service } from 'typedi';
import { Authorize, Context, Controller, Handle } from '..';
import { TestService } from '../services/test.service';

@Controller('/api/meta')
@Service()
export class MetadataController {
  @Inject() s: TestService;

  @Handle('')
  @Authorize()
  test(ctx: Context) {
    return { isWorking: this.s?.test() };
  }

  @Handle('/kek')
  kek() {
    return { kek: true };
  }
}
