export const playCompletionSound = () => {
  try {
    const audio = new Audio('/sounds/done_notification.mp3');
    audio.volume = 0.7;
    audio.play().catch(err => {
      console.error('Error playing completion sound:', err);
    });
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
};