import alerts from "./alerts.js";
import { source } from "./data.js";
import { render } from "./render.js";
import { watchers } from "./watchers.js";

const timer = {
  instance: {},
  consumed: 0,
  init() {
    timer.instance = new Timer();
  },
  store() {
    let id = watchers.getActiveId()
    source[id].usedTime = timer.consumed;
    console.log(source[id].usedTime);    
  },
  start() {
    this.instance.start();
    this.runInterval();
    // $("#start").addClass("running");
  },
  stop() {
    this.instance.stop();
    $("#start").removeClass("running");
  },
  async restart() {
    let id = watchers.getActiveId();
    timer.instance.reset();
    timer.loadConsumedTime();
    watchers.setTimerControls();
    render.runningTime();
    source[id].usedTime = 0;
  },
  runInterval() {
    setInterval(() => {
      if (timer.instance.isRunning) {
        timer.consumed = Math.round(timer.instance.getTime() / 1000);
        render.runningTime();
        alerts.watch();
      }
    }, 100);
  },
  loadConsumedTime() {
    let id = watchers.getActiveId()
    let seconds = source[id].usedTime;
    if (typeof seconds == 'undefined') seconds = 0;
    timer.consumed = seconds; 
    timer.instance.overallTime = seconds * 1000
  },
}; 

class Timer {
    constructor() {
      this.isRunning = false;
      this.startTime = 0;
      this.overallTime = 0;
    }
  
    _getTimeElapsedSinceLastStart() {
      if (!this.startTime) {
        return 0;
      }
  
      return Date.now() - this.startTime;
    }
  
    start() {
      if (this.isRunning) {
        return console.error("Timer is already running");
      }
  
      this.isRunning = true;
  
      this.startTime = Date.now();
    }
  
    stop() {
      if (!this.isRunning) {
        return console.error("Timer is already stopped");
      }
  
      this.isRunning = false;
  
      this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
    }
  
    reset() {
      this.overallTime = 0;
  
      if (this.isRunning) {
        this.startTime = Date.now();
        return;
      }
  
      this.startTime = 0;
    }
  
    getTime() {
      if (!this.startTime) {
        return 0;
      }
  
      if (this.isRunning) {
        return this.overallTime + this._getTimeElapsedSinceLastStart();
      }
  
      return this.overallTime;
    }
  }

export default timer;