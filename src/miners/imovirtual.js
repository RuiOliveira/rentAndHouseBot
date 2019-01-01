import { adapt } from '../lib/html-adapter';
import { dataFilters } from '../../config/props';
import Log from '../../config/logger';

class ImovirtualMiner {
  constructor(logPrefix) {
    this.logPrefix = logPrefix;
  }

  async mine(url) {
    let $;
    try {
      $ = await adapt(url);
    } catch (err) {
      Log.error(err);
      throw new Error(`Error to access url ${url}`);
    }

    const elements = $('li:contains("Certificado Energ")');
    const data = {
      energeticCertificate: this.getEnergeticCertificate(elements)
    };

    const isOnFilter = this.isOnFilter(data);

    Log.info(`${this.logPrefix} Found energetic certificate '${data.energeticCertificate}' to ${url}`);

    return {
      isOnFilter,
      data
    };
  }

  getEnergeticCertificate(elements) {
    if (!elements ||
        elements.length !== 1 ||
        !elements[0].lastChild ||
        !elements[0].lastChild.firstChild ||
        !elements[0].lastChild.firstChild.data) {
      return 'unknown';
    }

    return elements[0].lastChild.firstChild.data.toLowerCase();
  }

  isOnFilter(data) {
    if (!dataFilters.energeticCertificates.includes(data.energeticCertificate)) return false;
    return true;
  }

}

export default ImovirtualMiner;
