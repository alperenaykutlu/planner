
class NotifyService{
    async requestPermission(){
        if(!('Notification' in window)) return false
        if(Notification.permission==='granted') return true
        const result=await Notification.requestPermission()
        return result==='granted'
    }
    get isGranted(){
        return 'Notification' in window && Notification.permission==='granted'
    }
    send(title,options={}){
        if(!this.isGranted) return null
        return new Notification(title,{
badge: '🔔'         ,
   ...options
        })
    }
}
export const notificationService = new NotifyService();