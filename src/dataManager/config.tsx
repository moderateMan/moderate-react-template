import {
    Global,
    LightHomeStore
} from './stores/index';

export default function config() {
    let common = {
        getGlobal: this.getGlobal
    }
    return {
        global: {
            storeClass: Global,
            params: {
                ...common
            }
        },
        lightHomeStore: {
            storeClass: LightHomeStore,
            params: {
                ...common,
                api: lightHomeApi
            }
        }
    }
}




