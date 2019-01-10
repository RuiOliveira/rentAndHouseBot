import { rq } from './rq';
import cheerio from 'cheerio';
import Log from '../../config/logger';
import props from '../../config/props';
import { proxy, unProxy } from './proxy-factory';

const maxRequests = {};

const adapt = async(url, binary = false) => {
  try {
    const data = await rq(url, binary);
    return cheerio.load(data);
  } catch (err) {
    Log.debug(err);
    throw err;
  }
};

const adaptRetry = async(url, status, isProxied, binary = false) => {
  // increase times that URL was requested
  const unProxyUrl = isProxied ? unProxy(url) : url;
  const totalRequests = maxRequests[unProxyUrl] || 0;
  maxRequests[unProxyUrl] = totalRequests + 1;

  // request
  try {
    return await adapt(url, binary);
  } catch (err) {
    Log.debug(err);
    // throw exception when it reachs the total requests configured
    if (maxRequests[unProxyUrl] === props.retries) {
      maxRequests[unProxyUrl] = 0;
      throw new Error(`Exceed ${props.retries} retries time to request ${unProxyUrl} - ${err.statusCode}`);
    }

    if (err.statusCode === status) {
      Log.warn(`Error ${status} to access ${url}. Trying again...`);
      return await adaptRetry(proxy(unProxyUrl), status, isProxied, binary);
    }
    throw err;
  }
};

export { adapt, adaptRetry };
