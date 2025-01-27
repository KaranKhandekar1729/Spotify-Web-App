let currentSong = new Audio;

function formatTime(seconds) {
    // Convert to integer to remove decimals
    const totalSeconds = Math.floor(seconds);
    
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    // Pad with leading zeros for consistent formatting
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function getSongs() {
    let a = await fetch('http://127.0.0.1:5500/songs/')
    let response = await a.text();
    console.log(response)
    let div = document.createElement('div')
    div.innerHTML = response;
    let as = div.getElementsByTagName('a')

    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split('/songs/')[1])
        }
    }
    return songs
}

const playMusic = (track, pause) => {

    // let audio = new Audio("/songs/" + track);
    // audio.play();
    currentSong.src = '/songs/' + track
    if (!pause) {
        currentSong.play()
    }
    play.src = 'play.svg'
    document.querySelector('.song-info').innerHTML = decodeURI(track)
    console.log(document.querySelector('.song-info'))
    document.querySelector('.song-time').innerHTML = '0:00/0:00'
}

async function main() {
    
    // Get the list of all the songs
    let songs = await getSongs()
    playMusic(songs[0], true)

    let songUL = document.querySelector(".song-list").getElementsByTagName('ul')[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <i class="bi bi-music-note-beamed music-icon"></i>
        <div class="info">
            <div>${song.replaceAll('%20', ' ').replaceAll('%2C', ',')}</div>
            <div>song artist</div>
        </div>
        <img src="play.svg" class="dynamic-invert" alt="play icon">
    </li>`
    }

    // Attach an event listener to each song
    Array.from(document.querySelector('.song-list').getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', element => {
            // console.group(e.querySelector('.info').firstElementChild.innerHTML);
            playMusic(e.querySelector('.info').firstElementChild.innerHTML);
        })
    })

    // Attach an event listener to play, next and previous
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = 'pause.svg'
        } else {
            currentSong.pause();
            play.src = 'play.svg'
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener('timeupdate', () => {
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector('.song-time').innerHTML = `
        ${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector('.circle').style.left = (currentSong.currentTime/currentSong.duration) * 100 + '%';

    })

    // Add an event llistener to seekbar 
    document.querySelector('.seekbar').addEventListener('click', e => {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector('.circle').style.left = percent + '%';
        currentSong.currentTime = ((currentSong.duration) * percent) / 100; 
    })
}

main()