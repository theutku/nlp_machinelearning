class BotCredentials {
    name: string;
    age: number;
    born: Date;
    sex: string;
    birthplace: string;

    constructor() {
        this.age = 23;
        this.name = 'Cankurtaran Botu';
        this.born = new Date();
        this.sex = 'none';
        this.birthplace = 'Motherboard Avenue, Processor No: 1';
    }
}

export default new BotCredentials();