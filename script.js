
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

async function main() {
    // Get the list of all the songs
    let songs = await getSongs()
    console.log(songs)

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

    // playing the first song
    var audio = new Audio(songs[23]);
    // audio.play();

}

main()