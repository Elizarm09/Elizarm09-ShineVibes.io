
document.addEventListener("DOMContentLoaded", () => {
    const categorySelect = document.getElementById("categorySelect");
    const songSelect = document.getElementById("songSelect");
    const audioPlayer = document.getElementById("audioPlayer");
    const audioSource = document.getElementById("audioSource");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const stopBtn = document.getElementById("stopBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    let audioContext, analyser, source, dataArray, bufferLength;

    // Definir la ruta base correcta
    const basePath = "";

    // Configurar rutas de canciones
    const songs = {
        Clásica: [
            { name: '♬ Für Elise ♬', file: 'Clásica.mp3' },
            { name: '♬ Swan Lake ♬', file: 'Clásica.2.mp3' }
        ],
        Jazz: [
            { name: '♬ City of Stars ♬', file:"City of Stars.mp3" },
            { name: '♬ Mia and Sebastian’s Teme ♬', file:"Mia and Sebastian’s Theme.mp3" },
        ],
        Pop: [
            { name: '♬ Sueños ♬', file: 'Sueños.mp3' },
            { name: '♬ Can t Steal My Joy♬', file: 'Can t Steal My Joy.mp3' },
        ],
        Rock: [
            { name: '♬ Livin On a Prayer ♬', file: 'Livin On A Prayer.mp3' },
            { name: '♬ Hey Jude ♬', file: 'Hey Jude.mp3' },
        ],
    };
    categorySelect.addEventListener("change", (e) => {
        document.body.style.backgroundColor = e.target.options[e.target.selectedIndex].dataset.color;
        songSelect.innerHTML = "<option selected disabled>Elija una canción</option>";
        songs[e.target.value].forEach(song => {
            const option = document.createElement("option");
            option.value = basePath + e.target.value + "/" + song.file;
            option.textContent = song.name;
            songSelect.appendChild(option);
        });
        songSelect.disabled = false;
    });

    songSelect.addEventListener("change", (e) => {
        audioSource.src = e.target.value;
        audioPlayer.load();
    });

    playPauseBtn.addEventListener("click", () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            startVisualizer();
        } else {
            audioPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    stopBtn.addEventListener("click", () => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    downloadBtn.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = audioSource.src;
        link.download = audioSource.src.split("/").pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    function startVisualizer() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            source = audioContext.createMediaElementSource(audioPlayer);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            analyser.fftSize = 256;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
        }
        drawVisualizer();
    }

    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        let barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            let barHeight = dataArray[i] / 2;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }
});
