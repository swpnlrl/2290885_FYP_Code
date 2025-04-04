// Calm.js - Meditation and Deep Breathing

class Calm {
    constructor() {
      this.timer = null;
      this.timeRemaining = 5 * 60; // 5 minutes in seconds
      this.isTimerRunning = false;
      this.breathingState = 'Inhale';
      this.breathingInterval = 5; // Seconds before changing breathing state
    }
  
    // Start or stop the timer
    toggleTimer() {
      if (this.isTimerRunning) {
        clearInterval(this.timer);
        this.isTimerRunning = false;
        console.log("Meditation paused");
      } else {
        this.startTimer();
        this.isTimerRunning = true;
        console.log("Meditation started");
      }
    }
  
    // Start the countdown timer
    startTimer() {
      this.timer = setInterval(() => {
        this.timeRemaining--;
        this.displayTime();
        this.checkBreathingState();
        if (this.timeRemaining <= 0) {
          clearInterval(this.timer);
          console.log("Meditation complete! Relax.");
          this.resetTimer();
        }
      }, 1000);
    }
  
    // Display the remaining time in MM:SS format
    displayTime() {
      const minutes = Math.floor(this.timeRemaining / 60);
      const seconds = this.timeRemaining % 60;
      console.log(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }
  
    // Check if it's time to change the breathing state
    checkBreathingState() {
      if (this.timeRemaining % this.breathingInterval === 0) {
        this.changeBreathingState();
      }
    }
  
    // Change the breathing state (Inhale / Exhale)
    changeBreathingState() {
      if (this.breathingState === 'Inhale') {
        this.breathingState = 'Exhale';
        console.log("Exhale...");
      } else {
        this.breathingState = 'Inhale';
        console.log("Inhale...");
      }
    }
  
    // Reset the timer to the initial state
    resetTimer() {
      this.timeRemaining = 5 * 60; // Reset to 5 minutes
      this.breathingState = 'Inhale';
      this.displayTime();
    }
  }
  
  // Usage example:
  const calmApp = new Calm();
  
  // Start the meditation session
  calmApp.toggleTimer();
  
  // You can stop and reset the timer like this:
  // calmApp.toggleTimer();
  // calmApp.resetTimer();
  