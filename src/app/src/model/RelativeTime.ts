export class RelativeTime {



    static format(dateN: number) {
        var d = new Date(dateN)
        var n = new Date(Date.now())

        var deltaYear = n.getFullYear()-d.getFullYear()
        var deltaMonth = n.getMonth()-d.getMonth()
        var deltaDate = n.getDate()-d.getDate()
        var deltaHours = n.getHours()-d.getHours()
        var deltaMinutes = n.getMinutes()-d.getMinutes()
        var deltaSeconds = n.getSeconds()-d.getSeconds()
        
        if(deltaYear >= 1) {
            return deltaYear + " years ago"
        } else if(deltaMonth >= 1) {
            return deltaMonth + " months ago"
        } else if(deltaDate >= 7) {
            return Math.round(deltaDate/7) + " weeks ago"
        } else if(deltaDate > 1) {
            return deltaDate + " days ago"
        } else if(deltaDate == 1) {
            return "yesterday"
        }  else if(deltaHours >= 1) {
            return deltaHours + " hours ago"
        } else if(deltaMinutes >= 1) {
            return deltaMinutes + " minutes ago"
        } else if(deltaSeconds > 30) {
            return deltaSeconds + " seconds ago"
        } else if(deltaSeconds <= 30) {
            return "now"
        } else {
            return "why?"
        }
    }
}