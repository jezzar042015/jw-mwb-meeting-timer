
const overall = {
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
    getRuntime(meetingtype) {
        let current = new Date()
        let start = new Date()

        if (typeof meetingtype == 'undefined')
            meetingtype = 'test'

        const setting = overall.settings[meetingtype]

        start.setDate(current.getDate())
        start.setMonth(current.getMonth())
        start.setFullYear(current.getFullYear())

        start.setHours(setting.start.split(":")[0])
        start.setMinutes(setting.start.split(":")[1])
        start.setSeconds(setting.start.split(":")[2])

        return (current.getTime() - start.getTime())
    },
    getRemainingTime(meetingtype) {
        let current = new Date()
        let end = new Date()

        if (typeof meetingtype == 'undefined')
            meetingtype = 'test'

        const setting = overall.settings[meetingtype]

        end.setDate(current.getDate())
        end.setMonth(current.getMonth())
        end.setFullYear(current.getFullYear())

        end.setHours(setting.end.split(":")[0])
        end.setMinutes(setting.end.split(":")[1])
        end.setSeconds(setting.end.split(":")[2])

        return (end.getTime() - current.getTime())
    },
    getDuration(meetingtype) {
        let current = new Date()
        let start = new Date()
        let end = new Date()

        if (typeof meetingtype == 'undefined')
            meetingtype = 'test'

        const setting = overall.settings[meetingtype]

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
    progress() {
        let meeting = $('#meeting-selector').val()
        let w = $('#progress-bar-base').width()
        let p = overall.getRuntime(meeting)
        let d = overall.getDuration(meeting)
        let c = p / d * w

        if (c > 1.5) c = 0
        if (c > w) c = w
        if (c < 0) c = 0

        $('#progress-bar-runtime').width(c + 'px')
    },
    init() {
        setInterval(() => {
            overall.progress()
            console.log('progress set')
        }, 100);
    }
}