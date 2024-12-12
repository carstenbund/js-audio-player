(function() {
  // Encapsulate the audio player logic within an IIFE
  const audioPlayer = {
    init: function(containerId, audioSrc) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error("Container element not found:", containerId);
        return;
      }
      
      this.audio = document.createElement('audio');
      this.audio.src = audioSrc;

      // Create necessary elements
      this.container = document.createElement('div');
      this.container.classList.add('audio-player');

      // Create elements
      this.audio = document.createElement('audio');
      this.audio.id = 'customAudio';
      
      this.playerDiv = document.createElement('div');
      this.playerDiv.className = 'audio-player';
      
      this.controlsDiv = document.createElement('div');
      this.controlsDiv.className = 'controls';
      
      this.playPauseBtn = document.createElement('button');
      this.playPauseBtn.id = 'playPause';
      this.playPauseBtn.className = 'play-pause-btn';
      this.playIcon = document.createElement('i');
      this.playIcon.className = 'fas fa-play';
      this.playPauseBtn.appendChild(this.playIcon);
      
      this.timeAndProgressDiv = document.createElement('div');
      this.timeAndProgressDiv.className = 'time-and-progress';
      
      this.currentTimeEl = document.createElement('div');
      this.currentTimeEl.id = 'currentTime';
      this.currentTimeEl.className = 'time';
      this.currentTimeEl.textContent = '00:00';
      
      this.progressDiv = document.createElement('div');
      this.progressDiv.className = 'progress';
      this.progressBar = document.createElement('input');
      this.progressBar.type = 'range';
      this.progressBar.id = 'progressBar';
      this.progressBar.value = 0;
      this.progressBar.min = 0;
      this.progressBar.step = 1;
      this.progressDiv.appendChild(this.progressBar);
      
      this.totalTimeEl = document.createElement('div');
      this.totalTimeEl.id = 'totalTime';
      this.totalTimeEl.className = 'time';
      this.totalTimeEl.textContent = '00:00';
      
      this.volumeContainer = document.createElement('div');
      this.volumeContainer.className = 'volume-container';
      this.volumeIcon = document.createElement('i');
      this.volumeIcon.id = 'volumeIcon';
      this.volumeIcon.className = 'fas fa-volume-up volume-icon';
      this.volumeSliderContainer = document.createElement('div');
      this.volumeSliderContainer.className = 'volume-slider-container';
      this.volumeSlider = document.createElement('input');
      this.volumeSlider.type = 'range';
      this.volumeSlider.id = 'volumeSlider';
      this.volumeSlider.min = 0;
      this.volumeSlider.max = 1;
      this.volumeSlider.step = 0.1;
      this.volumeSlider.value = 1;
      this.volumeSliderContainer.appendChild(this.volumeSlider);
      this.volumeContainer.appendChild(this.volumeIcon);
      this.volumeContainer.appendChild(this.volumeSliderContainer);
      
      // Assemble the structure
      this.timeAndProgressDiv.appendChild(this.currentTimeEl);
      this.timeAndProgressDiv.appendChild(this.progressDiv);
      this.timeAndProgressDiv.appendChild(this.totalTimeEl);
      
      this.controlsDiv.appendChild(this.playPauseBtn);
      this.controlsDiv.appendChild(this.timeAndProgressDiv);
      this.controlsDiv.appendChild(this.volumeContainer);
      
      this.playerDiv.appendChild(this.audio);
      this.playerDiv.appendChild(this.controlsDiv);
      this.container.appendChild(this.playerDiv);
      
      this.attachEventListeners();
      this.setSrc(audioSrc);
      this.updateVolumeIcon();
      // Append the player to the document
      document.body.appendChild(this.container);
       // Get stored volume from localStorage
      const storedVolume = localStorage.getItem('audioPlayerVolume');
      if (storedVolume) {
        this.audio.volume = parseFloat(storedVolume); // Parse as float
        this.volumeSlider.value = storedVolume;
        this.updateVolumeIcon();
      }
    },
    setSrc: function(audioSrc) {
      this.audio.src = audioSrc;
      this.audio.load(); // Important: Load the new source
      this.progressBar.value = 0; //Reset the progress bar
      this.currentTimeEl.textContent = '00:00'; //Reset current time
      this.totalTimeEl.textContent = '00:00'; //Reset total time
      if (!this.audio.paused) {
        this.audio.play();
      }
    },
    attachEventListeners: function() {
      // Add event listeners
      this.playPauseBtn.addEventListener('click', this.togglePlayPause.bind(this));
      this.audio.addEventListener('play', this.onPlay.bind(this));
      this.audio.addEventListener('pause', this.onPause.bind(this));
      this.audio.addEventListener('loadedmetadata', this.onLoadedMetadata.bind(this));
      this.audio.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
      this.progressBar.addEventListener('input', this.onSeek.bind(this));
      this.volumeSlider.addEventListener('input', this.onVolumeChange.bind(this));
      this.volumeIcon.addEventListener('click', this.toggleMute.bind(this));
      this.volumeContainer.addEventListener('mouseenter', this.showVolumeSlider.bind(this));
      this.volumeSliderContainer.addEventListener('mouseleave', this.hideVolumeSlider.bind(this));
    },
  
    togglePlayPause: function() {
      if (this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    },

    onPlay: function() {
      this.playIcon.className = 'fas fa-pause';
    },
    
    onPause: function() {
      this.playIcon.className = 'fas fa-play';
    },

    onLoadedMetadata: function() {
      this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
      this.progressBar.max = Math.floor(this.audio.duration);
    },

    onTimeUpdate: function() {
      this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
      this.progressBar.value = Math.floor(this.audio.currentTime);
    },

    onSeek: function() {
      this.audio.currentTime = this.progressBar.value;
    },

    onVolumeChange: function() {
      this.audio.volume = this.volumeSlider.value;
      localStorage.setItem('audioPlayerVolume', this.volumeSlider.value); // Store volume
      this.updateVolumeIcon();
    },

    toggleMute: function() {
      this.audio.muted = !this.audio.muted;
      this.updateVolumeIcon();
    },

    showVolumeSlider: function() {
      this.volumeSliderContainer.style.display = 'block';
    },

    hideVolumeSlider: function() {
      this.volumeSliderContainer.style.display = 'none';
    },

    updateVolumeIcon: function() {
      if (this.audio.muted || this.audio.volume === 0) {
        this.volumeIcon.className = 'fas fa-volume-mute';
      } else if (this.audio.volume < 0.5) {
        this.volumeIcon.className = 'fas fa-volume-down';
      } else {
        this.volumeIcon.className = 'fas fa-volume-up';
      }
    },

    formatTime: function(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };
    
  window.createAudioPlayer = function(containerId, audioSrc, trackTitle) {
    const playerInstance = Object.create(audioPlayer); // Create a new instance
    playerInstance.init(containerId, audioSrc, trackTitle);
    return playerInstance; // Return the instance
  };
  
})(); // IIFE end
    
