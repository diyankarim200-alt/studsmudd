const playerInfo = {
    diyan: { name: "Diyan", role: "Playmaker (CAM)" },
    saif: { name: "Saif", role: "Striker (ST)" },
    qaiser: { name: "Qaiser", role: "The Wall (CB)" },
    shaviyan: { name: "Shaviyan", role: "Winger (RW)" }
};

async function showPlayer(key, element) {
    const info = playerInfo[key];
    document.getElementById('p-name').innerText = info.name;
    document.getElementById('p-role').innerText = info.role;

    const grid = document.getElementById('video-grid');
    grid.innerHTML = "Scanning Folder...";

    try {
        const res = await fetch(`/get-videos/${key}`);
        const videos = await res.json();
        grid.innerHTML = "";

        if (videos.length === 0) grid.innerHTML = "No videos in videos/" + key;

        videos.forEach(v => {
            grid.innerHTML += `
                <div class="vid-item">
                    <video controls src="${v.url}"></video>
                    <p style="text-transform:uppercase; font-size:12px;">${v.label}</p>
                </div>`;
        });
    } catch (e) { grid.innerHTML = "Error loading folder."; }

    if(element) {
        document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
        element.classList.add('active');
    }
}

function checkPass() {
    if (document.getElementById('pass').value === "ankaramessi10") {
        document.getElementById('admin-gate').style.display = "none";
        document.getElementById('admin-tools').style.display = "block";
    }
}

async function serverUpload() {
    const pName = document.getElementById('sel-player').value;
    const file = document.getElementById('vid-file').files[0];
    const status = document.getElementById('up-status');

    const formData = new FormData();
    formData.append('videoFile', file);
    formData.append('playerName', pName);

    status.innerText = "Uploading...";
    await fetch('/upload', { method: 'POST', body: formData });
    status.innerText = "Saved!";
    showPlayer(pName);
}