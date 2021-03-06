import { Db } from 'mongodb';

import CrawlerBot from '@modules/crawdler/crawler-bot';
import AvailabilityBot from '@modules/availability/availability-bot';
import MinerBot from '@modules/miners/miner-bot';

import CustoJustoProvider, { filters as custoJustoFilters } from '@modules/crawdler/providers/custojusto';
import IdealistaProvider, { filters as idealistaFilters } from '@modules/crawdler/providers/idealista';
import ImovirtualProvider, { filters as imovirtualFilters } from '@modules/crawdler/providers/imovirtual';
import OlxProvider, { filters as olxFilters } from '@modules/crawdler/providers/olx';

import Log from '@config/logger';
import props from '@config/props';
import PropertyCache from '@lib/property-cache';

class Bot {
  constructor(private db: Db, private cache: PropertyCache) {}

  crawlers(): Bot {
    const { crawler } = props.bots;
    const logPrefix = '[bot:crawler]:';

    if (!crawler.enabled) {
      Log.warn(`${logPrefix} Skipping...`);
      return this;
    }

    Log.info(`${logPrefix} Initialising...`);
    const start = () => {
      new CrawlerBot(this.db, this.cache, {
        providerClass: CustoJustoProvider,
        searchFilters: custoJustoFilters
      }).crawle();

      new CrawlerBot(this.db, this.cache, {
        providerClass: ImovirtualProvider,
        searchFilters: imovirtualFilters
      }).crawle();
      new CrawlerBot(this.db, this.cache, {
        providerClass: OlxProvider,
        searchFilters: olxFilters
      }).crawle();
    };

    const startIdealista = () => {
      new CrawlerBot(this.db, this.cache, {
        providerClass: IdealistaProvider,
        searchFilters: idealistaFilters
      }).crawle();
    };

    setTimeout(() => {
      start();
      startIdealista();
    }, crawler.delay);

    setInterval(start, crawler.interval);
    setInterval(startIdealista, crawler.interval * crawler.idealista.intervalMultipler);

    return this;
  }

  evaluateAvailability(): Bot {
    const { availability } = props.bots;
    const logPrefix = '[bot:availability]:';

    if (!availability.enabled) {
      Log.warn(`${logPrefix} Skipping...`);
      return this;
    }

    Log.info(`${logPrefix} Initialising...`);

    const start = () => new AvailabilityBot(this.db, this.cache).evaluateDatabaseEntries();

    setTimeout(() => start(), availability.delay);
    setInterval(start, availability.interval);

    return this;
  }

  dataMining(): Bot {
    const { dataMining } = props.bots;
    const logPrefix = '[bot:miner]:';

    if (!dataMining.enabled) {
      Log.warn(`${logPrefix} Skipping...`);
      return this;
    }

    Log.info(`${logPrefix} Initialising...`);

    const start = () => new MinerBot(this.db, this.cache).mineDatabaseEntries();

    setTimeout(() => start(), dataMining.delay);
    setInterval(start, dataMining.interval);

    return this;
  }
}

export default Bot;
