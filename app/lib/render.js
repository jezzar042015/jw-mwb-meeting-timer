import { meetingSchedule, source } from "./data.js";

export const render = {
    async meetingItems() {
        const ul = $('#timers')

        for (let i = 0; i < source.length; i++) {
          const s = source[i];
          let li = `
                <li class="${s.class}" data-id="0" data-order="0" 
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
    runTime() {

    },
    setActiveTitle() {

    },
    setDocumentTitle() {
        document.title = meetingSchedule
    },
    loadStoredTime() {
        // loads the time when the meeting item is selected
    },
    setItemsRestriction() {
        // allow or restrict meeting items to be selected
    }
}