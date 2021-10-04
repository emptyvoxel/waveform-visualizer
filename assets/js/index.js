const SAMPLES = 44000;
const HEIGHT = 200;
const CENTER = HEIGHT / 2;

const audioContext = new AudioContext();

const svg = document.getElementById('svg');
const file = document.getElementById('file');
const path = document.getElementById('path');

svg.style.height = `${HEIGHT}px`;
svg.style.width = `${SAMPLES}px`;

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
    const ch = [
        normalize(resample(audioData.getChannelData(0))),
        normalize(resample(audioData.getChannelData(1))),
    ];

    let d = `M0,${CENTER}`;
    for (let i = 0; i < ch[0].length; i++) {
        d += ` L${i},${CENTER - ch[0][i] * CENTER}`;
    }

    for (let i = ch[1].length - 1; i >= 0; i--) {
        d += ` L${i},${CENTER + ch[1][i] * CENTER}`;
    }
    d += ' Z';

    path.setAttribute('d', d);
}