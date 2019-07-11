
// fetches data from iTunes API and returns it (using variable 'searchText')
function searchLibrary(searchText) {
    return fetch(`https://itunes-api-proxy.glitch.me/search?${searchText}&entity=song&media=music`)
        .then(function (response) {
            if (!response.ok) {
                throw Error(response.statusText)
            }
            return response.json()
            // .then(function (data) {
            //     console.log(data)
            //  })
        })
}

// display results of search
function showSongs(searchText) {
    // call searchLibrary to get API data
    searchLibrary(searchText)
        .then(function (data) {
            console.log(data)

            // grabs track list div and sets it to empty
            const trackList = document.querySelector('#track-list')
            trackList.innerHTML = ''

            // loops through data.results array
            for (index = 0; index < data.results.length; index++) {

                // create a div for each track
                const track = document.createElement('div')
                //then creates separate div elements inside track div for info and cover img
                const trackInfo = document.createElement('div')
                const albumCover = document.createElement('div')
                const playAudio = document.createElement('div')

                // add classes to divs
                track.classList.add('track')
                trackInfo.classList.add('track-details')
                albumCover.classList.add('cover-image')
                playAudio.classList.add('playAudio')

                // assigns data from fetch results to variables:
                let artistName = data.results[index].artistName
                let album = data.results[index].collectionName
                let songName = data.results[index].trackName
                let coverImage = data.results[index].artworkUrl100
                let audioURL = data.results[index].previewUrl
                // convert milliseconds to minutes and seconds
                let milliSec = data.results[index].trackTimeMillis
                let minutes = Math.floor(milliSec / 60000)
                let seconds = ((milliSec % 60000) / 1000).toFixed(0)
                let trackLength = minutes + ":" + (seconds < 10 ? '0' : '') + seconds

                // play audio
                let trackAudio = new Audio(audioURL)
                playAudio.addEventListener('click', function () {
                    trackAudio.play()
                })
                playAudio.innerHTML =
                    `<audio controls="controls">
                        <source src="${audioURL}" type="audio/ogg" />
                        <source src="${audioURL}" type="audio/mpeg" />
                        <p>Your browser does not support playing audio tracks.</p>
                    </audio>`

                // puts data into divs
                trackInfo.innerHTML = `<ul><li><strong>Artist: ${artistName}</strong></li><li>Album: ${album}</li><li>Track: ${songName}</li></ul>`
                albumCover.innerHTML = `<img src="${coverImage}">`

                // update the new track
                track.append(albumCover, trackInfo, playAudio)
                // update track list with new track
                trackList.append(track)

            }


        })
}



// Main Execution

document.addEventListener('DOMContentLoaded', function () {
    // assigns search bar to variable userSearch
    let userSearch = document.querySelector('#artist-search')
    // adds 'change' event to userSearch so that event occurs when input is changed
    // event.preventDefault prevents page from refreshing
    userSearch.addEventListener('change', function (event) {
        event.preventDefault()
        let searchText = 'term='
        // adds user term= to user input and encodes for url
        searchText += encodeURIComponent(userSearch.value)
        console.log(searchText)
        // clears the search
        userSearch.value = ''

        // calls the search function
        showSongs(searchText)
    })
})