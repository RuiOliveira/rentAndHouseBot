import { rq } from '../lib/rq';
import BotError from '../utils/bot-error';
import Log from '../../config/logger';

class ImovirtualAvailability {
  constructor(logPrefix) {
    this.logPrefix = logPrefix;
  }

  async evaluate(url) {
    try {
      await rq(url);
    } catch (err) {
      if (err.statusCode === 404) {
        throw new BotError(`The page ${url} is unvailable`, 404);
      }

      Log.error(err);
      const status = err.statusCode ? err.statusCode : 500;
      throw new BotError(`Error to access url ${url}`, status);
    }
  }
}

export default ImovirtualAvailability;
