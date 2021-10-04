const SAMPLES = 1000;

const audioContext = new AudioContext();

const waveform = document.getElementById('waveform');
const file = document.getElementById('file');

file.oninput = ({ target }) => {
    target.files[0].arrayBuffer()
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

function normalize (data) {
    const max = Math.max(...data);
    const output = [];

    for (let i = 0; i < data.length; i++) {
        output[i] = data[i] / max;
    }

    return output;
}

function process (audioData) {
    const channel = normalize(resample(audioData.getChannelData(0)));
    waveform.innerHTML = '';

    for (let i = 0; i < channel.length; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${channel[i] * 100}%`;

        waveform.appendChild(bar);
    }
}