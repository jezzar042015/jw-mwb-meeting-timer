import { render } from "./render.js";

const countdown = {
    settings: {
        mwb: {
            start: '18:00:00',
            end: '19:45:00',
        },
        public: {
            start: '14:00:00',
            end: '15:45:00',
        },
        test: {
            start: '23:24:00',
            end: '23:30:00',
        }
    },
    running: false,
    init() {
        setInterval(() => {
            progress.track()
            countdown.set()
        }, 100);
    },
    
    set() {
        if (!this.running) return;

        let meeting = $('#meeting-selector').val()
        let current = new Date()
        let start = new Date()

        
        const setting = this.settings[meeting]
        
        start.setDate(current.getDate())
        start.setMonth(current.getMonth())
        start.setFullYear(current.getFullYear())
        start.setHours(setting.start.split(":")[0])
        start.setMinutes(setting.start.split(":")[1])
        start.setSeconds(setting.start.split(":")[2])
        
        let c = current.getTime()
        let s = start.getTime()

        
        $("#countdown").toggle(s + 60000 > c)
        
        
        if (s + 30000 > c) {
            let seconds = (s - c) / 1000

            if (seconds < 0) seconds = 0

            render.runTime(seconds)

            if (seconds <= 300 && seconds > 180) { timerui.raiseAlert('warning') }
            if (seconds <= 180) { timerui.raiseAlert('overtime') }
        }
    },

    getRemainingTime(meetingtype) {
        let current = new Date()
        let end = new Date()

        if (typeof meetingtype == 'undefined')
            meetingtype = 'test'

        const setting = this.settings[meetingtype]

        end.setDate(current.getDate())
        end.setMonth(current.getMonth())
        end.setFullYear(current.getFullYear())

        end.setHours(setting.end.split(":")[0])
        end.setMinutes(setting.end.split(":")[1])
        end.setSeconds(setting.end.split(":")[2])

        return (end.getTime() - current.getTime())
    },
    
}

const progress = {
    track() {
        let meeting = $('#meeting-selector').val()
        let w = $('#progress-bar-base').width()
        let p = this.getRuntime(meeting)
        let d = this.getDuration(meeting)
        let c = p / d * w


        if (c > w) c = w
        if (c < 0) c = 0

        $('#progress-bar-runtime').width(c + 'px')
    },
    getRuntime(meetingtype) {
        let current = new Date()
        let start = new Date()

        if (typeof meetingtype == 'undefined')
            meetingtype = 'test'

        const setting = countdown.settings[meetingtype]

        start.setDate(current.getDate())
        start.setMonth(current.getMonth())
        start.setFullYear(current.getFullYear())

        start.setHours(setting.start.split(":")[0])
        start.setMinutes(setting.start.split(":")[1])
        start.setSeconds(setting.start.split(":")[2])

        return (current.getTime() - start.getTime())
    },
    getDuration(meetingtype) {
        let current = new Date()
        let start = new Date()
        let end = new Date()

        if (typeof meetingtype == 'undefined')
            meetingtype = 'test'

        const setting = countdown.settings[meetingtype]

        start.setDate(current.getDate())
        start.setMonth(current.getMonth())
        start.setFullYear(current.getFullYear())
        start.setHours(setting.start.split(":")[0])
        start.setMinutes(setting.start.split(":")[1])
        start.setSeconds(setting.start.split(":")[2])

        end.setDate(current.getDate())
        end.setMonth(current.getMonth())
        end.setFullYear(current.getFullYear())
        end.setHours(setting.end.split(":")[0])
        end.setMinutes(setting.end.split(":")[1])
        end.setSeconds(setting.end.split(":")[2])

        return (end.getTime() - start.getTime())
    },

}

export default countdown