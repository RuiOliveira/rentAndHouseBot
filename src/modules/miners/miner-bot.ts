import { Db } from 'mongodb';

import Log from '@config/logger';
import allProps from '@config/props';

import { batchProperties } from '@utils/batch-utils';

import Property from '@models/property';
import PropertyCache from '@lib/property-cache';

import MinerBotFactory from '@modules/miners/factory';
import MinerHandler from '@modules/miners/miner-handler';

const props = allProps.bots.dataMining;
let idealistaCounterCycle = props.intervalIdealistaCounter;

/**
 * Fetch data from database and start the data mining process
 * after that the result will be send to handler
 */
class MinerBot {
  private handler: MinerHandler;

  constructor(private db: Db, cache: PropertyCache) {
    this.handler = new MinerHandler(db, cache);
  }

  mine(property: Property): void {
    const miner = MinerBotFactory.getInstance(property.provider, property.url);

    miner.mine(property.url).then(response => {
      this.handler.handle(miner.logPrefix, property, response);
    }).catch(err => {
      Log.error(`[minder]: Error to mine ${property.url}: ${err.message}`);
    });
  }

  async mineDatabaseEntries() {
    try {
      const properties = await this._fetchDatabaseEntries();
      properties.forEach(p => this.mine(p));
      idealistaCounterCycle--;
    } catch (err) {
      Log.error(`[minder]: Error to load properties from database: ${err.message}`);
      Log.error(err.stack);
    }
  }

  private _fetchDatabaseEntries() {
    const query = {
      provider: { $nin: [ 'idealista' ] },
      status: { $ne: 'UNVAILABLE' }
    };

    // reduce times to fetch idealista data
    // if the schedule do a complete cycle now it's time to remove provider from projection to include the 'idealista' on search
    if (idealistaCounterCycle === 0) {
      delete query.provider;
      idealistaCounterCycle = props.intervalIdealistaCounter;
    }

    const sort = { isDataMiningLastCheck: 1, dataMiningLastCheck: 1 };
    return batchProperties(this.db, query, sort, props.batchSize);
  }
}

export default MinerBot;
