
// fetches data from iTunes API and returns it (using variable 'searchText')
function searchLibrary(searchText) {
    if (document.querySelector('input[name="options"]:checked').value == 'all') {
        return fetch(`https://itunes-api-proxy.glitch.me/search?term=${searchText}&entity=song`)
            .then(function (response) {
                if (!response.ok) {
                    throw Error(response.statusText)
                }
                return response.json()

            })
    }
    else if (document.querySelector('input[name="options"]:checked').value == 'artist') {
        return fetch(`https://itunes-api-proxy.glitch.me/search?term=${searchText}&entity=song&attribute=artistTerm`)
            .then(function (response) {
                if (!response.ok) {
                    throw Error(response.statusText)
                }
                return response.json()

            })
    }
    else if (document.querySelector('input[name="options"]:checked').value == 'song') {
        return fetch(`https://itunes-api-proxy.glitch.me/search?term=${searchText}&entity=song&attribute=songTerm`)
            .then(function (response) {
                if (!response.ok) {
                    throw Error(response.statusText)
                }
                return response.json()

            })
    }
    else if (document.querySelector('input[name="options"]:checked').value == 'album') {
        return fetch(`https://itunes-api-proxy.glitch.me/search?term=${searchText}&entity=song&attribute=albumTerm`)
            .then(function (response) {
                if (!response.ok) {
                    throw Error(response.statusText)
                }
                return response.json()

            })
    }
}

const audioPlayer = document.querySelector('.player')
const nowPlaying = document.querySelector('.now-playing')

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
                const playButton = document.createElement('div')

                // add classes to divs
                track.classList.add('track')
                trackInfo.classList.add('track-details', 'container')
                albumCover.classList.add('cover-image-div', 'container')
                playButton.classList.add('button-div')

                // assigns data from fetch results to variables:
                let artistName = data.results[index].artistName
                let album = data.results[index].collectionName
                let songName = data.results[index].trackName
                let coverImage = data.results[index].artworkUrl100
                let audioURL = data.results[index].previewUrl


                // puts data into divs
                trackInfo.innerHTML = `<ul class="unstyled"><li>${songName}</li><li><strong>${artistName}</strong></li><li><em>${album}</em></li></ul>`
                albumCover.innerHTML = `<img class="coverArt" src="${coverImage}">`
                playButton.innerHTML = `<button class='play-button btn btn-info' value="${audioURL}">Play Song Preview</button>`

                // update the new track
                track.append(albumCover, trackInfo, playButton)
                // update track list with new track
                trackList.append(track)



            }

            const playButtons = document.querySelectorAll('.play-button')
            for (let button of playButtons) {
                button.addEventListener('click', function () {
                    audioPlayer.src = button.value
                    audioPlayer.autoplay = true
                    nowPlaying.append(`Now Playing: ${artistName} - ${songName}`)

                })
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
        // adds user term= to user input and encodes for url
        let searchText = encodeURIComponent(userSearch.value)
        console.log(searchText)
        // clears the search
        userSearch.value = ''

        // calls the search function
        showSongs(searchText)
    })
})