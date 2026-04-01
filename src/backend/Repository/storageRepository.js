import {  StorageService } from "../services/storage.js"

class storageRepo{
    #KEY="Gorevler"

    getAll()
    {
        return StorageService.get(this.#KEY,[])
    }
    getByID(id) {return this.getAll().find(t=>t.id===id)??null}

    save(data){
        const task={
            ...data,
            id:crypto.randomUUID(),
            reminded:false,
            createdAt:new Date().toISOString()
        }
        StorageService.set(this.#KEY,[...this.getAll(),task])
        return task
    }

    update(id,patch){
        const task=this.getAll()
        const i=task.findIndex(t=>t.id===id)
        if(i===-1) return null
        const next=[...task]
        next[i]={...next[i],...patch}
        StorageService.set(this.#KEY,next)
        return next[i]
    }
    delete(id){
        const filtered=this.getAll().filter(t=>t.id!==id)
        StorageService.set(this.#KEY,filtered)
    }
    markReminded(id){return this.update(id,{reminded:true})}
}
export const taskRepository = new storageRepo();