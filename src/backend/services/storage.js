import {LocalStorageAdapter} from '../adapters/localStorageAdapters.js'

class StorageService{
    #adapter
    #namespace
    #version

    constructor(adapter,namespace="plan",version=1){
        this.#adapter=adapter
        this.#namespace=namespace
        this.#version=version
    }
  #key(k) { return `${this.#namespace}::${k}`; }

  get(key,fallback){
    try {
        const raw=this.#adapter.getItem(this.#key(key))
        if(!raw) return fallback
        const {v,data}=JSON.parse(raw)
        if(v!==this.#version) {this.remove(key)
             return fallback}
            return data
    } catch (error) {
        return fallback
    }
  }
  set(key,value){
    try {
        this.#adapter.setItem(
            this.#key(key),
            JSON.stringify({v:this.#version,data:value})
        )
    } catch (error) {
        console.warn("problem",error)
    }
  }
  remove(key) {this.#adapter.removeItem(this.#key(key))}
}
export const storageService = new StorageService(new LocalStorageAdapter());  // ya da
