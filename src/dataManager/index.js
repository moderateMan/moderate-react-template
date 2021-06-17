import createConfig from './config'
class Store {
    constructor() {
        this.storeConfig = createConfig.call(this)
        this.totoInstantiaze()
    }

    getGlobal = () => {
        return this.global;
    }

    totoInstantiaze() {
        for (let key in this.storeConfig) {
            const { storeClass, params } = this.storeConfig[key]
            this[key] = new storeClass(params)
        }
    }
}

export default new Store();
