let store = {
        user: { name: "Student" },
        photos: undefined,
    }
    // add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState, isMultiple) => {
    if (isMultiple) {
        store = Immutable.mergeDeep(store, newState);
    } else {
        store = Object.assign(store, newState)
    }

    render(root, store)
}

const render = async(root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, photos } = state

    return `
        <header>Mars Dashboard</header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                <br>
                <div>
                ${generateCardElement(rovers)}
            </div>
            <div>
                ${state.photos == undefined ? '' : generateImageElement(photos)}
            </div>
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
    getListRover(store);
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}
const generateCardElement = (state) => {
    if (state) {
        return state.rovers.map(rover => (
            `<div>
    			<div style="text-align: center;">
                <hr/>
                	<h5>Rover name: ${rover.name}</h5>
                	<p>Landing date: ${rover.landing_date}</p>
                	<p>Lauch date: ${rover.launch_date}</p>
                    <p>Max date: ${rover.max_date}</p>
                	<p>Total photos: ${rover.total_photos}</p>
                	<div>
                        <input type="button" onclick="handleShowImage(${JSON.stringify(rover.name).replace(/"/g, '\'')}
                        , ${JSON.stringify(rover.max_date).replace(/"/g, '\'')})" value="Show Image"/>
                    </div>
                <hr/>
                </div>
            </div>`
        )).join('');
    } else {
        return ``;
    }
}

const generateImageElement = (state) => {
    if (state) {
        return state.photos.map(img => (`<div>
                <img class="img-content" src="${img.img_src}" alt="${img.camera.full_name}">
                <div>
                    <h5>${img.rover.name} - ${img.camera.full_name}</h5>
                </div>
            </div>`)).join('');
    } else {
        return ``;
    }
}

const handleShowImage = (roverName, curDate) => {
    getAllImageById(roverName, curDate);
}

const getAllImageById = (roverName, curDate) => {
    var { photos } = store;
    fetch(`http://localhost:3000/inforRover/${roverName}?maxDate=${curDate}`)
        .then(res => res.json())
        .then(data => {
            photos = data.images;
            if (!photos.hasOwnProperty('error')) {
                updateStore(store, { photos }, true);
            } else {
                setInterval(() => {
                    getAllImageById(photos);
                }, 15000);
            }
        });
}

const getListRover = (state) => {
    let { rovers } = state;
    fetch(`http://localhost:3000/lstImageRover`)
        .then(res => res.json())
        .then(data => {
            rovers = data.infor;
            if (!rovers.hasOwnProperty('error')) {
                updateStore(store, { rovers });
            } else {
                setInterval(() => {
                    getListRover(state);
                }, 15000);
            }
        });
}