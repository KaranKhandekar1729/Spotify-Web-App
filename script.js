let currentSong = new Audio;
let songs;
let currFolder;

function formatTime(seconds) {
    // Convert to integer to remove decimals
    const totalSeconds = Math.floor(seconds);
    
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    // Pad with leading zeros for consistent formatting
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div = document.createElement('div')
    div.innerHTML = response;
    let as = div.getElementsByTagName('a')

    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    // Show all the songs in the playlist
    let songUL = document.querySelector(".song-list").getElementsByTagName('ul')[0]
    songUL.innerHTML = ''
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

    return songs
}

const playMusic = (track, pause) => {

    // let audio = new Audio("/songs/" + track);
    // audio.play();
    currentSong.src = `http://127.0.0.1:5500/${currFolder}/${track}`;
    if (!pause) {
        currentSong.play()
    }
    play.src = 'pause.svg'
    document.querySelector('.song-info').innerHTML = decodeURI(track)
    // console.log(document.querySelector('.song-info'))
    document.querySelector('.song-time').innerHTML = '0:00/0:00'
}

async function displayAlbum() {
    let a = await fetch('http://127.0.0.1:5500/songs/')
    let response = await a.text();
    console.log(response)
    let div = document.createElement('div')
    div.innerHTML = response;
    let anchors = div.getElementsByTagName('a')
    let cardContainer = document.querySelector('.card-container')
    Array.from(anchors).forEach( async e => {
        if (e.href.includes('/songs/')) {

            for (let index = 0; index < array.length; index++) {
                const element = array[index]; 
                // console.log(e.href)
                let folder = e.href.split('/').slice(-1)[0]
                console.log(folder)
                // Get the metadata of the folder
                let a = await fetch(`/songs/${folder}/info.json`)
                let response = await a.json();
                cardContainer.innerHTML = `
                                <div data-folder="${folder}" class="card">
                                    <img src=${response.cover} alt="card image">
                                    <p>${response.description}</p>
                                </div>`
            }
        }
    })
}

async function main() {

    // Get list of all the songs
    await getSongs('/songs/conan')
    playMusic(songs[0], true)

    // Display all the albums on the page
    displayAlbum()


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

    // Add an event listener to previous 
    previous.addEventListener('click', () =>  { 
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if ((index-1) >= 0) {
            playMusic(songs[index-1])
        }
    })

    // Add an event listener to next 
    next.addEventListener('click', () =>  { 
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if ((index+1) > length) {
            playMusic(songs[index+1])
        }
    })

    // Add an event to volume
    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change', (e) => {
        currentSong.volume = parseInt(e.target.value)/100
    })

    // Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName('card')).forEach(e => {
        e.addEventListener('click', async item => {
            songs =  await getSongs(`/songs/${item.currentTarget.dataset.folder}`)
            item.target.dataset.folder
        })
    })
}

main()