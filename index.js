const SAMPLES = 1000;

const audioContext = new AudioContext();

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
            sum += channelData[offset + j];
        }
        output.push(sum / chunkSize);
    }

    return output;
}

function process (audioData) {
    const channelData = audioData.getChannelData(0);

    console.log(resample(channelData));
}