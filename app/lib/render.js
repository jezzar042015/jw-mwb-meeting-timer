import { meetingSchedule, source } from "./data.js";
import timer from "./timer.js";
import { watchers } from "./watchers.js";

export const render = {
    async meetingItems() {
        const ul = $('#timers')

        for (let i = 0; i < source.length; i++) {
            const s = source[i];
            let li = `
                <li class="${s.class}" data-id="${i}" data-order="0" 
                    data-limit="${s.minutes * 60}" data-seconds="" 
                    data-HasZoom="${s.hasParticipation}">
                    <div>
                        <span class="timer-name">${s.name}</span>
                        <div>
                            <small class="part-minutes">${s.minutes} min</small>
                            <small class="participant">${s.participant}</small>
                        </div>
                    </div>
                </li>
            `;

            $(ul).append(li);
        }
    },
    setActiveTitle(mode = 'live') {
        let title = '';
        if (mode == 'live') {
            let id = $('.selected').data('id');
            title = `${source[id].name} (${source[id].minutes} min)`;
        }
        
        if (mode == 'countdown') {
            title = 'Meeting starts in...'
        }
        
        $('#active-part').children('span').text(title);
    },
    loadItemDetails() {
        let meetingCode = $('#meeting-selector').val();
        let meetingName = $(`#meeting-selector option[value='${meetingCode}']`).text();
        $('#tdf-meeting').text(meetingName);

        const s = watchers.getActiveSource()
        $('#tdf-name').html(s.name == '' ? '&dash;' : s.name);
        $('#tdf-participant').html(s.participant == '' ? '&dash;' : s.participant);
        $('#tdf-time').text(`${s.minutes} min`);

        let seconds = typeof s.usedTime == 'undefined' ? 0 : s.usedTime;
        let pt = render.parseToTime(seconds);
        let actual = render.displayParsedTime(pt)  
        $('#tdf-consumed').html(actual);

        const diff = render.getDifference()
        $('#tdf-remarks').html(diff == 0 || s.usedTime == 0 ? '&dash;' : render.displayRemarks(diff));
    },
    parseToTime(seconds) {
        const t = {}        
        t.h = Math.floor(seconds / 3600);
        t.m = Math.floor(seconds / 60) % 60;
        t.s = seconds % 60;

        return t;
    },
    displayParsedTime(t = {h:0,m:0,s:0}) {
        if (t.h == 0 && t.m == 0 && t.s == 0) {
            return '&dash;';
        } else if (t.m == 0 && t.s > 0) {
            return `${t.s} sec`;
        } else {
            return `${t.m} min and ${t.s} sec`;
        }
    },
    displayRemarks(secDifference) {
        let abs = Math.abs(secDifference);
        let pt = render.parseToTime(abs)
        if (secDifference < 0) {
            return `Overtime: ${render.displayParsedTime(pt)}`
        } else {
            return `Undertime: ${render.displayParsedTime(pt)}`
        }   
    },
    getDifference() {
        const s = watchers.getActiveSource();
        if (typeof s.usedTime == 'undefined') return 0
        return (s.minutes * 60) - (s.usedTime);

    },
    setDocumentTitle() {
        document.title = meetingSchedule
    },
    runningTime() {
        let seconds = timer.consumed;
        this.runTime(seconds)
    },
    runTime(seconds) {
        let s = seconds % 60;
        let m = Math.floor(seconds / 60) % 60;
        let h = Math.floor(seconds / 3600);

        $("#second1").text(s % 10);
        $("#second2").text(Number.parseInt((s % 100) / 10));
        $("#minute1").text(m % 10);
        $("#minute2").text(Number.parseInt((m % 100) / 10));
        $("#hour1").text(h % 10);
        $("#hour2").text(Number.parseInt((h % 100) / 10));
    },
    showSidebar() {
        $(".display").width('auto')
        $(".sidebar").animate({ width: 'toggle' }, 0);
    },
    hideSidebar() {
        $(".display").width(window.outerWidth + 'px')
        $(".sidebar").animate({ width: 'toggle' }, 0);
    },
    hideTimer() {
        $('.timer').hide()
        $('.controls').hide()
        $('#active-part').hide()
        $('#timer-details').show()
    },
    showTimer() {
        $('.timer').show()
        $('.controls').show()
        $('#active-part').show()
        $('#timer-details').hide()
    }
}