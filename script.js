document.querySelectorAll('.freq-btn').forEach(button => {
    button.addEventListener('click', () => {
      const frequency = button.getAttribute('data-freq');
      const duration = parseFloat(document.getElementById('duration').value);
      const volume = parseFloat(document.getElementById('volume').value);
      playFrequency(frequency, duration, volume);
      showVisualizer();
    });
  });
  
  function playFrequency(freq, duration, volume) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
  
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
  
    oscillator.start();
    setTimeout(() => oscillator.stop(), duration * 1000);
  }
  
  function showVisualizer() {
    const visualizer = document.querySelector('.visualizer');
    visualizer.style.animation = 'pulse 1s infinite';
    setTimeout(() => {
      visualizer.style.animation = 'none';
    }, 1000);
  }
















  let selectedSignal = 'sine';

  document.querySelectorAll('.signal-btn').forEach(button => {
    button.addEventListener('click', () => {
      selectedSignal = button.getAttribute('data-signal');
      document.querySelectorAll('.signal-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
  
  document.querySelectorAll('.freq-btn').forEach(button => {
    button.addEventListener('click', () => {
      const frequency = button.getAttribute('data-freq');
      const duration = parseFloat(document.getElementById('duration').value);
      const volume = parseFloat(document.getElementById('volume').value);
      playFrequency(frequency, duration, volume, selectedSignal);
      showVisualizer();
    });
  });
  
  function playFrequency(freq, duration, volume, signal) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
  
    oscillator.type = signal;
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
  
    oscillator.start();
    setTimeout(() => oscillator.stop(), duration * 1000);
  }



















  const sineCanvas = document.getElementById('sine-visualizer');
const sineCtx = sineCanvas.getContext('2d');
sineCanvas.width = sineCanvas.offsetWidth;
sineCanvas.height = sineCanvas.offsetHeight;

function showSineVisualizer(audioCtx, analyser, freq) {
  analyser.fftSize = 2048;
  const bufferLength = analyser.fftSize;
  const dataArray = new Float32Array(bufferLength);

  function draw() {
    requestAnimationFrame(draw);
    analyser.getFloatTimeDomainData(dataArray);

    sineCtx.fillStyle = '#121212';
    sineCtx.fillRect(0, 0, sineCanvas.width, sineCanvas.height);

    sineCtx.lineWidth = 2;
    sineCtx.strokeStyle = '#ff5722';
    sineCtx.beginPath();

    const sliceWidth = sineCanvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] * 0.5 + 0.5; // Normalize between 0 and 1
      const y = v * sineCanvas.height;

      if (i === 0) {
        sineCtx.moveTo(x, y);
      } else {
        sineCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    sineCtx.lineTo(sineCanvas.width, sineCanvas.height / 2);
    sineCtx.stroke();
  }

  draw();
}

function playFrequency(freq, duration, volume, signal) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  const analyser = audioCtx.createAnalyser();

  oscillator.type = signal;
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(analyser);
  analyser.connect(audioCtx.destination);

  showVisualizer(audioCtx, analyser, signal); // Visualisierung basierend auf Signaltyp

  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    audioCtx.close();
  }, duration * 1000);
}
















function showVisualizer(audioCtx, analyser, signal) {
  analyser.fftSize = 2048;
  const bufferLength = analyser.fftSize;
  const dataArray = new Float32Array(bufferLength);

  function draw() {
    requestAnimationFrame(draw);
    analyser.getFloatTimeDomainData(dataArray);

    sineCtx.fillStyle = '#121212';
    sineCtx.fillRect(0, 0, sineCanvas.width, sineCanvas.height);

    sineCtx.lineWidth = 2;
    sineCtx.strokeStyle = '#ff5722';
    sineCtx.beginPath();

    const sliceWidth = sineCanvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] * 0.5 + 0.5; // Normalize between 0 and 1
      const y = v * sineCanvas.height;

      if (i === 0) {
        sineCtx.moveTo(x, y);
      } else {
        sineCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    sineCtx.lineTo(sineCanvas.width, sineCanvas.height / 2);
    sineCtx.stroke();

    // Optionale Animation je nach Signalart
    if (signal === 'square') {
      sineCtx.strokeStyle = '#44ff44'; // Grün für Rechteck
    } else if (signal === 'triangle') {
      sineCtx.strokeStyle = '#4488ff'; // Blau für Dreieck
    } else if (signal === 'sawtooth') {
      sineCtx.strokeStyle = '#ff8844'; // Orange für Sägezahn
    }
  }

  draw();
}