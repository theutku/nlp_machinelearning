import * as nconf from 'nconf';

class Config {
    public static PORT = 'PORT';

    public port: number;

    get(key?: string, cb?: nconf.ICallbackFunction) {
        return nconf.get(key, cb);
    }

    constructor() {
        nconf.argv().env();
        this.port = this.get(Config.PORT) || 3978;
    }
}

export default new Config();