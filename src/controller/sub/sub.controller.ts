import { Service } from 'typedi';
import { Controller } from '../../decorators/controller';

@Controller('/asd')
@Service()
export class SubController {
  index() {}
}
