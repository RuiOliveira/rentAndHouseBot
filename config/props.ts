const defaultVars = {
  env: process.env.NODE_ENV || 'local',
  retries: 2,
  receivers: [
    'fabiohbarbosa@gmail.com',
    'josiannygonzales@gmail.com'
  ],
  server: {
    name: 'Rent Bot',
    maxConnections: 256
  },
  db: {
    dbName: 'rent-bot'
  },
  bots: {
    crawler: {
      interval: 1 * 60 * 1000, // 1 minute
      intervalIdealistaMultipler: 10,
      delay: 0 * 1000
    },
    dataMining: {
      batchSize: 4,
      interval: 9 * 60 * 1000, // a cada 9 minutos é possível verificar 600 imóveis por dia
      intervalIdealistaCounter: 5, // numbers of cycle before search by idealista URLs
      delay: 10 * 1000
    },
    availability: {
      batchSize: 4,
      ensureTimes: 5,
      interval: 9 * 60 * 1000, // a cada 9 minutos é possível verificar 600 imóveis por dia
      intervalIdealistaCounter: 5, // numbers of cycle before search by idealista URLs
      delay: 15 * 1000
    }
  },
  scheduler: {
    mail: {
      batchSize: 100,
      interval: 0.5 * 60 * 1000,
      delay: 5 * 1000
    }
  }
};

const localVars = {
  ...defaultVars,
  proxy: false,
  server: {
    ...defaultVars.server,
    port: 3000
  },
  db: {
    ...defaultVars.db,
    url: process.env.DB_URL || 'mongodb://localhost:27017'
  },
  mail: {
    enabled: false,
  },
  bots: {
    crawler: {
      ...defaultVars.bots.crawler,
      interval: 1 * 60 * 1000,
      enabled: true,
      delay: 0,
      intervalIdealistaMultipler: 1,
    },
    dataMining: {
      ...defaultVars.bots.dataMining,
      enabled: false,
      interval: 0.5 * 60 * 1000,
      delay: 0,
      intervalIdealistaCounter: 5
    },
    availability: {
      ...defaultVars.bots.availability,
      enabled: false,
      interval: 0.5 * 60 * 1000,
      delay: 0,
      intervalIdealistaCounter: 5
    },
  },
  scheduler: {
    mail: {
      ...defaultVars.scheduler.mail,
      enabled: false
    }
  },
  logLevel: 'info'
};

const envVars = {
  ...defaultVars,
  proxy: true,
  server: {
    ...defaultVars.server,
    port: process.env.PORT
  },
  db: {
    url: process.env.DB_URL,
    ...defaultVars.db
  },
  mail: {
    enabled: (process.env.MAIL === 'true')
  },
  bots: {
    crawler: {
      enabled: (process.env.CRAWLER_BOT === 'true'),
      ...defaultVars.bots.crawler
    },
    dataMining: {
      enabled: (process.env.AVAILABILITY_BOT === 'true'),
      ...defaultVars.bots.dataMining
    },
    availability: {
      enabled: (process.env.DATA_MINING_BOT === 'true'),
      ...defaultVars.bots.availability
    }
  },
  scheduler: {
    mail: {
      ...defaultVars.scheduler.mail,
      enabled: true
    }
  },
  logLevel: process.env.LOG_LEVEL,
};

const dataFilters = {
  maxPrice: 900,
  onlyPhoto: true,
  energeticCertificates: [
    'a+', '+a', 'a-', '-a', 'a',
    'b+', '+b', 'b-', '-b', 'b'
  ],
  topologies: ['t3', 't4']
};

export { dataFilters };
export default !process.env.NODE_ENV ? localVars : envVars;
