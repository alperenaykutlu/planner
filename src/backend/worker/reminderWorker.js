let tasks=[]

self.onmessage=(e)=>{
    if(e.data.type==='SYNC_TASKS') tasks=e.data.tasks
}
setInterval(()=>{
    const now=Date.now()

    tasks.forEach(task=>{
        if(task.reminded) return
        if(!task.dueDate) return

        const due=new Date(task.dueDate).getTime()
        const remind=(task.remindBefore??0)*60*1000
        const fireAt=due-remind
        const diff=fireAt-now

        if(diff>-30_000 && diff<30_000)
            self.postMessage({type:'REMIND',taskID:task.id,taskTitle:task.title})
    })
},30_000)