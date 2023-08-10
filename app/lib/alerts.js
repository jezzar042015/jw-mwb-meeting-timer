import timer from "./timer.js";
import { watchers } from "./watchers.js";

const alerts = {
    watch() {
        const s = watchers.getActiveSource();
        const limit = s.minutes * 60;
        let warning = 0;

        if (limit <= 60) {
            warning = limit - 10;
        } else if (limit <= 180) {
            warning = limit - 30;
        } else if (limit > 190) {
            warning = limit - 60;
        }

        if (
            timer.consumed >= warning &&
            timer.consumed < limit &&
            warning != limit
        ) {
            alerts.raise("warning");
        } else if (timer.consumed >= limit) {
            alerts.raise("overtime");
        } else {
            alerts.drop();
        }
    },
    raise(alertType) {

        switch (alertType) {
            case "overtime":
                $(".timer-warning").removeClass("timer-warning");
                $(".display").addClass("blinking-overtime");
                break;
            case "warning":
                $(".blinking-overtime").removeClass("blinking-overtime");
                $(".display").addClass("timer-warning");
                break;
        }
    },
    drop() {
        $(".timer-warning").removeClass("timer-warning");
        $(".blinking-overtime").removeClass("blinking-overtime");
    }
}

export default alerts;