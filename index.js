const DataLayer = require('@slosarek/greenlock-data-layer');
const manager = {};

module.exports = {
  create: (opts = {}) => {
    console.log({ source: 'manager', opts });
    let config = {};

    config = {
      ...opts,
    };
    const data = DataLayer(config);
    manager._data = data;

    manager.set = async (opts) => {
      const id = opts.subject;
      let site = (await data.read('configs', id)) || {};
      site = {
        ...site,
        ...opts,
      };

      return data.write('configs', id, site);
    };

    manager.get = async (opts) => {
      const { servername, wildname } = opts;
      const id = servername || wildname;

      return data.read('configs', id);
    };

    manager.remove = async (opts) => {
      const id = opts.subject;
      return data.delete('configs', id);
    };

    manager.defaults = async (opts) => {
      config = {
        ...config,
        ...opts,
      };

      return config;
    };

    manager.find = async (opts) => {
      const allConfigs = await data.all('configs');

      const { subject, servernames, altnames } = opts;
      if (!subject && !servernames) {
        return allConfigs;
      }

      if (subject) {
        const configsBySubject = allConfigs.filter((config) => {
          return config.subject === subject;
        });

        if (configsBySubject.length) {
          return configsBySubject;
        }
      }
      if (servernames && servernames.length) {
        const configsByServernames = allConfigs.filter((config) => {
          return (
            servernames.includes(config.subject) ||
            servernames.find((servername) =>
              config.altnames.includes(servername)
            )
          );
        });

        if (configsByServernames.length) {
          return configsByServernames;
        }
      }

      return [];
    };

    return manager;
  },
  _manager: manager,
};
