import timer from "./lib/timer.js";
import { events } from "./lib/events.js";
import { handlers } from "./lib/handlers.js";
import { render } from "./lib/render.js";
import { watchers } from "./lib/watchers.js";
import countdown from "./lib/countdown.js";

const init  = async () => {
    try {

        await render.meetingItems();
        await events.load();
        await handlers.loadMeetingItems();
        timer.init();
        countdown.init();
        render.setDocumentTitle();
    } catch(e) {
        console.log(e);
    }
};

init();