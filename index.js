const SAMPLES = 1000;

const audioContext = new AudioContext();

const waveform = document.getElementById('waveform');

function loadAudio () {
    fetch('/song.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioData => process(audioData));
}

function resample (channelData) {
    const chunkSize = Math.floor(channelData.length / SAMPLES);
    const output = [];

    for (let i = 0; i < SAMPLES; i++) {
        const offset = chunkSize * i;
        let sum = 0;

        for (let j = 0; j < chunkSize; j++) {
            sum += Math.abs(channelData[offset + j]);
        }
        output.push(sum / chunkSize);
    }

    return output;
}

function process (audioData) {
    const channel = resample(audioData.getChannelData(0));

    for (let i = 0; i < channel.length; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${channel[i] * 100}%`;

        waveform.appendChild(bar);
    }
}