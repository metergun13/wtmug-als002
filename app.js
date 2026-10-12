JavaScript
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const fullscreenOverlay = document.getElementById('fullscreen-overlay');
const fullscreenContent = document.getElementById('fullscreen-content');

function closeModal() {
    modal.classList.add('hidden');
    modalBody.innerHTML = '';
}

function closeFullscreen() {
    fullscreenOverlay.classList.add('hidden');
    fullscreenContent.innerHTML = '';
}

// 1. Ekran Renkleri Testi (Tam Ekran)
function openScreenTest() {
    fullscreenOverlay.classList.remove('hidden');
    
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'];
    let currentIndex = 0;

    fullscreenContent.innerHTML = `
        <div id="color-screen" style="width:100%; height:100%; background:${colors[currentIndex]}; display:flex; align-items:center; justify-content:center; cursor:pointer;">
            <p style="background:rgba(0,0,0,0.6); padding:12px 24px; border-radius:8px; color:white; font-size:1.1rem; user-select:none;">Rengi değiştirmek için ekrana dokunun</p>
        </div>
    `;

    const screenDiv = document.getElementById('color-screen');
    screenDiv.onclick = () => {
        currentIndex = (currentIndex + 1) % colors.length;
        screenDiv.style.background = colors[currentIndex];
        const p = screenDiv.querySelector('p');
        if(colors[currentIndex] === '#ffffff') {
            p.style.color = '#000';
            p.style.background = 'rgba(255,255,255,0.7)';
        } else {
            p.style.color = '#fff';
            p.style.background = 'rgba(0,0,0,0.6)';
        }
    };
}

// 2. Dokunmatik Ekran Testi (Tam Ekran Çizim)
function openTouchTest() {
    fullscreenOverlay.classList.remove('hidden');
    
    fullscreenContent.innerHTML = `
        <div style="position:relative; width:100%; height:100%; background:#1e293b; display:flex; flex-direction:column;">
            <canvas id="touchCanvas" style="flex:1; width:100%; height:100%; touch-action:none;"></canvas>
            <div style="position:absolute; bottom:20px; left:20px; right:20px; display:flex; gap:10px;">
                <button class="btn-action" style="margin-top:0;" onclick="clearCanvas()">Ekranı Temizle</button>
            </div>
        </div>
    `;

    const canvas = document.getElementById('touchCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    let drawing = false;

    canvas.addEventListener('pointerdown', (e) => {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
    });

    canvas.addEventListener('pointermove', (e) => {
        if (!drawing) return;
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
    });

    canvas.addEventListener('pointerup', () => drawing = false);
}

function clearCanvas() {
    const canvas = document.getElementById('touchCanvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// 3. Hoparlör Testi
let audioCtx = null;
function openAudioTest() {
    modalTitle.innerText = "Hoparlör ve Frekans Testi";
    modal.classList.remove('hidden');

    modalBody.innerHTML = `
        <p style="margin-bottom:12px;">Hoparlör sol/sağ kanal ve ses netliğini test edin.</p>
        <button class="btn-action" onclick="playTone(440)">440 Hz (La Sesi) Çal</button>
        <button class="btn-action" onclick="playTone(1000)">1000 Hz Test Sesi Çal</button>
        <button class="btn-action" style="background:#ef4444;" onclick="stopTone()">Sesi Durdur</button>
    `;
}

function playTone(freq) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    stopTone();
    window.oscillator = audioCtx.createOscillator();
    window.oscillator.type = 'sine';
    window.oscillator.frequency.value = freq;
    window.oscillator.connect(audioCtx.destination);
    window.oscillator.start();
}

function stopTone() {
    if (window.oscillator) {
        window.oscillator.stop();
        window.oscillator.disconnect();
        window.oscillator = null;
    }
}

// 4. Mikrofon Testi
function openMicTest() {
    modalTitle.innerText = "Mikrofon Testi";
    modal.classList.remove('hidden');

    modalBody.innerHTML = `
        <p style="margin-bottom:12px;">Mikrofonunuzu test etmek için kayıt başlatın.</p>
        <button class="btn-action" id="mic-btn" onclick="toggleMic()">Kaydı Başlat</button>
        <p id="mic-status" style="margin-top:12px; text-align:center; color:var(--text-muted);"></p>
    `;
}

let mediaRecorder;
let audioChunks = [];
async function toggleMic() {
    const btn = document.getElementById('mic-btn');
    const status = document.getElementById('mic-status');

    if (!mediaRecorder || mediaRecorder.state === "inactive") {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                modalBody.innerHTML += `<audio controls src="${audioUrl}" style="width:100%; margin-top:16px;"></audio>`;
            };

            mediaRecorder.start();
            btn.innerText = "Kaydı Durdur & Dinle";
            btn.style.background = "#ef4444";
            status.innerText = "Kayıt yapılıyor... Konuşun.";
        } catch (err) {
            alert("Mikrofon izni alınamadı: " + err);
        }
    } else {
        mediaRecorder.stop();
        btn.innerText = "Yeniden Başlat";
        btn.style.background = "var(--primary)";
        status.innerText = "Kayıt tamamlandı. Aşağıdan dinleyebilirsiniz:";
    }
}

// 5. Titreşim Motoru Testi
function openVibrationTest() {
    modalTitle.innerText = "Titreşim Testi";
    modal.classList.remove('hidden');

    modalBody.innerHTML = `
        <p style="margin-bottom:12px;">Pixel 7 haptic motorunu test edin.</p>
        <button class="btn-action" onclick="navigator.vibrate(200)">Kısa Titreşim (200ms)</button>
        <button class="btn-action" onclick="navigator.vibrate([100, 50, 100, 50, 200])">Desenli Titreşim (SOS)</button>
        <button class="btn-action" style="background:#ef4444;" onclick="navigator.vibrate(0)">Titreşimi Durdur</button>
    `;
}

// 6. İnternet Bağlantı Testi
function openNetworkTest() {
    modalTitle.innerText = "İnternet ve Ağ Durumu";
    modal.classList.remove('hidden');

    const online = navigator.onLine;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    modalBody.innerHTML = `
        <div style="background:var(--card-bg); padding:16px; border-radius:8px;">
            <p><strong>Bağlantı Durumu:</strong> <span style="color:${online ? '#22c55e':'#ef4444'}">${online ? 'Çevrimiçi' : 'Çevrimdışı'}</span></p>
            <p style="margin-top:8px;"><strong>Ağ Türü (Effective Type):</strong> ${connection ? connection.effectiveType : 'Bilinmiyor'}</p>
            <p style="margin-top:8px;"><strong>Tahmini Bant Genişliği:</strong> ${connection ? connection.downlink + ' Mbps' : 'Bilinmiyor'}</p>
        </div>
        <button class="btn-action" onclick="openNetworkTest()">Durumu Güncelle</button>
    `;
}

// 7. GPS / Konum Testi
function openGpsTest() {
    modalTitle.innerText = "GPS ve Konum Testi";
    modal.classList.remove('hidden');

    modalBody.innerHTML = `
        <div style="background:var(--card-bg); padding:16px; border-radius:8px;">
            <p id="gps-status">Konum bilgisi alınıyor...</p>
        </div>
        <button class="btn-action" onclick="startGpsWatch()">Konumu Canlı Takip Et</button>
    `;
    
    getCurrentPosition();
}

function getCurrentPosition() {
    const statusEl = document.getElementById('gps-status');
    if (!navigator.geolocation) {
        statusEl.innerHTML = "Tarayıcınız coğrafi konum (GPS) desteklemiyor.";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude, accuracy, altitude, speed } = position.coords;
            statusEl.innerHTML = `
                <p><strong>Enlem:</strong> ${latitude.toFixed(6)}</p>
                <p style="margin-top:6px;"><strong>Boylam:</strong> ${longitude.toFixed(6)}</p>
                <p style="margin-top:6px;"><strong>Doğruluk:</strong> ±${accuracy.toFixed(1)} metre</p>
                <p style="margin-top:6px;"><strong>Yükseklik:</strong> ${altitude ? altitude.toFixed(1) + ' m' : 'Bilinmiyor'}</p>
                <p style="margin-top:6px;"><strong>Hız:</strong> ${speed ? speed.toFixed(1) + ' m/s' : '0 m/s'}</p>
            `;
        },
        (error) => {
            statusEl.innerHTML = `<span style="color:#ef4444;">Konum alınamadı: ${error.message}</span>`;
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

let watchId = null;
function startGpsWatch() {
    const statusEl = document.getElementById('gps-status');
    if (!navigator.geolocation) return;

    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }

    statusEl.innerHTML = "Canlı konum takibi başlatıldı...";
    watchId = navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude, accuracy, speed } = position.coords;
            statusEl.innerHTML = `
                <p style="color:#22c55e;"><strong>[CANLI TAKİP AKTİF]</strong></p>
                <p style="margin-top:6px;"><strong>Enlem:</strong> ${latitude.toFixed(6)}</p>
                <p style="margin-top:6px;"><strong>Boylam:</strong> ${longitude.toFixed(6)}</p>
                <p style="margin-top:6px;"><strong>Doğruluk:</strong> ±${accuracy.toFixed(1)} metre</p>
                <p style="margin-top:6px;"><strong>Anlık Hız:</strong> ${speed ? speed.toFixed(1) + ' m/s' : '0 m/s'}</p>
            `;
        },
        (error) => {
            statusEl.innerHTML = `<span style="color:#ef4444;">Takip hatası: ${error.message}</span>`;
        },
        { enableHighAccuracy: true }
    );
}

// PWA Service Worker Kaydı
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW kayıt hatası:', err));
    });
}