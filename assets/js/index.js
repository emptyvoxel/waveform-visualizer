const SAMPLES = 44000;
const URI = 'http://www.w3.org/2000/svg';

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

function createSVG (n) {
    const svg = document.createElementNS(URI, 'svg');
    svg.setAttribute('class', `svg${n}`);
    svg.setAttribute('height', '100px');
    svg.setAttribute('width', `${SAMPLES}px`);

    return svg;
}

function createPath () {
    const path = document.createElementNS(URI, 'path');
    path.setAttribute('fill', '#0ff');
    path.setAttribute('stroke', '#0ff');
    path.setAttribute('stroke-width', '1px');

    return path;
}

function drawPath (channel) {
    let d = 'M0,0';
    for (let i = 0; i < channel.length; i++) {
        d += ` L${i},${channel[i] * 100}`;
    }
    d += ' Z';

    return d;
}

function process (audioData) {
    const channel1 = normalize(resample(audioData.getChannelData(0)));
    const channel2 = normalize(resample(audioData.getChannelData(1)));

    // SVG > Canvas
    const svg1 = createSVG(1);
    const svg2 = createSVG(2);

    const path1 = createPath();
    const path2 = createPath();

    const d1 = drawPath(channel1);
    const d2 = drawPath(channel2);

    path1.setAttribute('d', d1);
    path2.setAttribute('d', d2);
    
    svg1.appendChild(path1);
    svg2.appendChild(path2);

    waveform.appendChild(svg1);
    waveform.appendChild(svg2);
}