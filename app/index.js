import { events } from "./lib/events.js";
import { handlers } from "./lib/handlers.js";
import { render } from "./lib/render.js";
import { watchers } from "./lib/watchers.js";

const init  = async () => {
    await render.meetingItems();
    await events.load();
    watchers.setTimerControls();
};

init();