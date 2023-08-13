import { meetingSchedule, source } from "./data.js";
import timer from "./timer.js";

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
    setActiveTitle() {
        let id = $('.selected').data('id');
        $('#active-part').children('span').text(`${source[id].name} (${source[id].minutes} min)`);
    },
    setDocumentTitle() {
        document.title = meetingSchedule
    },
    runningTime() {
        let seconds = timer.consumed;
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
        $('.digits').hide()
        $('.colons').hide()
    },
    showTimer() {
        $('.digits').show()
        $('.colons').show()
    }
}