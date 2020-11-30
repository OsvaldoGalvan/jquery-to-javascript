// console.log('hola mundo!');
// const noCambia = "Osvaldo Galván";
// let cambia = "@OsvaldoGalvanR"
// *******************************************+
// function cambiarNombre(nuevoNombre) {
//     cambia = nuevoNombre
// }
// *******************************************+
// const getUserA = new Promise(function (todoBien, TodoMal) {
//   // Llamar a un API
//   // setInterval
//   // setTimeout

//   setTimeout(() => {
//     todoBien('getUserA')
//   }, 3000);

// })
// const getUserB = new Promise(function (todoBien, TodoMal) {
//   // Llamar a un API
//   // setInterval
//   // setTimeout

//   setTimeout(() => {
//     todoBien('getUserB')
//   }, 5000);

// })
// *******************************************+
// getUser
//   .then(function () {
//     console.log("Todos está bien GetUser")
//   })
//   .catch(function (messages) {
//     console.log("Todos está mal :( GetUser " + messages)
//   })

// *******************************************+
// Promise.all([
//   getUserA,
//   getUserB,
// ])
//   .then(function (messages) {
//     console.log(messages)
//   })
//   .catch(function (messages) {
//     console.log("Todos está mal :( " + messages)
//   })

// *******************************************+
// Solo entra al then de la promesa que se resulva primero
// Promise.race([
//   getUserA,
//   getUserB,
// ])
//   .then(function (messages) {
//     console.log(messages)
//   })
//   .catch(function (messages) {
//     console.log("Todos está mal :( " + messages)
//   })

// *******************************************+
// $.ajax('https://randomuser.me/api/', {
//   method: 'GET',
//   success: function (data) {
//     console.log(data)
//   },
//   error: function (error) {
//     console.log(error)
//   }
// })
// XMLHttpRequest

// *******************************************+
// fetch('https://randomuser.me/api/')
//   .then(function (response) {
//     // console.log(response)
//     return response.json()
//   })
//   .then(function (user) {
//     console.log(`user ${user.results[0].name.first}`)
//   })
//   .catch(() => console.log('Algo Fallo'));

(async function load() {
  // await
  // action
  // Error
  // animation
  //https://yts.mx/api/v2/list_movies.json?genre=action
  async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()

    if (data.data.movie_count > 0) {
      return data
    }

    throw new Error('No se encontr ninvgun resultado')
  }


  const $form = document.getElementById('form')
  const $home = document.getElementById('home')
  const $featuringContainer = document.getElementById('featuring')


  function setAtrributes($element, attributes) {
    for (const attribute in attributes) {
      $element.setAttribute(attribute, attributes[attribute])
    }
  }

  const BASE_API_MOVIE = 'https://yts.mx/api/v2/'
  const BASE_API_USERS = 'https://randomuser.me/api/'

  function featuringTemplate(peli) {
    return `
      <div class="featuring">
        <div class="featuring-image">
          <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
        </div>
        <div class="featuring-content">
          <p class="featuring-title">Pelicula encontrada</p>
          <p class="featuring-album">${peli.title_long}</p>
        </div>
      </div>`
  }

  function userTemplate(user) {
    return (
      ` <li class="playlistFriends-item" data-uuid=${user.login.uuid}>
          <a href="#">
            <img src="${user.picture.thumbnail}" alt="user picture" />
            <span>
              ${user.login.username}
            </span>
          </a>
        </li>`
    )
  }

  $form.addEventListener('submit', async (event) => {
    event.preventDefault()
    $home.classList.add('search-active')

    const $loader = document.createElement('img')

    setAtrributes($loader, {
      src: 'src/images/loader.gif',
      height: 50,
      width: 50,
    })

    $featuringContainer.append($loader)

    const data = new FormData($form)
    try {
      const {
        data: {
          movies: pelis
        }
      } = await getData(`${BASE_API_MOVIE}list_movies.json?Limit=1&query_term=${data.get('name')}`)
      // const HTMLString = featuringTemplate(peli.data.movies[0])
      const HTMLString = featuringTemplate(pelis[0])
      $featuringContainer.innerHTML = HTMLString
    }
    catch (err) {
      alert(err.message)
      $loader.remove()
      $home.classList.remove('search-active')
    }

  })

  function videoItemTemplate(movie, category) {
    return (
      `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category="${category}">
          <div class="primaryPlaylistItem-image">
            <img src="${movie.medium_cover_image}">
          </div>
          <h4 class="primaryPlaylistItem-title">
            ${movie.title}
          </h4>
        </div>`
      )
  }

  function userDescriptionTemplate(user) {
    return(
      `<ul class="userDescriptionTemplate">
          <li id='userModalName'><span class="userModalField">name</span> : <span>${user.name.first} ${user.name.last}</span></li>
          <li id='userModalAge'><span class="userModalField">age</span> : <span>${user.dob.age}</span></li>
          <li id='userModalGender'><span class="userModalField">gender</span> : <span>${user.gender}</span></li>
          <li id='userModalEmail'><span class="userModalField">Email</span> : <span>${user.email}</span></li>
          <li id='userModalCity'><span class="userModalField">location</span> : <span>${user.location.city}</span></li>
          <li id='userModalUuid'><span class="userModalField">uuid</span> : <span>${user.login.uuid}</span></li>
        </ul>`
      )
  }

  function createTemplate(HTMLString) {
    const html = document.implementation.createHTMLDocument()
    html.body.innerHTML = HTMLString

    return html.body.children[0]
  }

  function addEventClick($element) {
    $element.addEventListener('click', () => {
      showModal($element)
    })
  }

  function renderMovieList(list, $container, category) {
    let $loader = $container.children[0]

    if ($loader != undefined) { $loader.remove()}

    list.forEach((item) => {
      const HTMLString = videoItemTemplate(item, category)
      const movieElement = createTemplate(HTMLString)

      $container.append(movieElement)

      const image = movieElement.querySelector('img')
      image.addEventListener('load', (event) => {
        event.target.classList.add('fadeIn')
      })

      addEventClick(movieElement)
    })
  }

  function renderUsers(list, $container) {
    // $container.children[0].remove();

    // list.forEach(user => {
    //   const HTMLString = userTemplate(user);
    //   const userElement = createTemplate(HTMLString);
    //   $container.append(userElement);

    //   const thumbnail = userElement.querySelector('img')
    //   thumbnail.addEventListener('load', event => { event.srcElement.classList.add('fadeIn') })

    //   addEventClick(userElement)
    // })
  }

  // const { results: users } = await getData(`${BASE_API_USERS}?exc=info,registered,timezone,nat&results=20`)
  // const $usersContainer = document.getElementById('playlistFriends')
  // renderUsers(users, $usersContainer)

  async function cacheExists(category) {
    const listName = `${category}List`
    const cacheList = window.localStorage.getItem(listName)

    if (cacheList) {
      return JSON.parse(cacheList)
    }

    const { data: { movies: data } } = await getData(`${BASE_API_MOVIE}list_movies.json?genre=${listName}`)
    window.localStorage.setItem(listName, JSON.stringify(data))

    return data
  }

  const actionList = await cacheExists('action')
  const $actionContainer = document.querySelector('#action')
  renderMovieList(actionList, $actionContainer, 'action')

  const dramaList = await cacheExists('drama')
  const $dramaContainer = document.getElementById('drama')
  renderMovieList(dramaList, $dramaContainer, 'drama')

  const animationList = await cacheExists('animation')
  const $animationContainer = document.getElementById('animation')
  renderMovieList(animationList, $animationContainer, 'animation')
  // renderMovieList(actionList.data.movies, $actionContainer, 'action')
  // let terrorList;

  // getData('https://yts.mx/api/v2/list_movies.json?genre=action').then(function (data) {
  //   terrorList = data
  //   console.log('Terror',terrorList)
  // })

  // console.log('Action', actionList)

  const $homeJQuery = $(".home .list #item") //Elemento con la clase home
  const $homeJQuery2 = $("#home") //Elemento con el id home

  const $modal = document.getElementById('modal')
  const $overlay = document.getElementById('overlay')
  const $hideModal = document.getElementById('hide-modal')

  const $modalTitle = $modal.querySelector('h1')
  const $modalImages = $modal.querySelector('img')
  const $modalDescription = $modal.querySelector('p')

  function findById(list, id) {
    return list.find(movie => movie.id === parseInt(id, 10))
  }
  function findMovie(id, category) {
    switch (category) {
      case 'action': {
        return findById(actionList, id)
      }
      case 'drama': {
        return findById(dramaList, id)
      }
      default: {
        return findById(animationList, id)
      }
    }

  }

  function findUserByUuid(list, uuid) {
    return list.find( user => user.login.uuid === uuid )
  }

  function showModal($element) {
    $overlay.classList.add('active')
    $modal.style.animation = 'modalIn .8s forwards'

    const id = $element.dataset.id

    const category = $element.dataset.category

    const data = findMovie(id, category)

    $modalTitle.textContent = data.title
    $modalImages.setAttribute('src', data.medium_cover_image)
    $modalDescription.textContent = data.description_full

  }

  //  function showModal($element) {
  //   $overlay.classList.add('active');
  //   $modal.style.animation = 'modalIn .8s forwards';
  //   const id = $element.dataset.id;
  //   const uuid = $element.dataset.uuid;
  //   const category = $element.dataset.category;
  //   try{
  //     const data = findMovie(id, category);

  //     $modalTitle.textContent = data.title;
  //     $modalImage.setAttribute('src', data.medium_cover_image);
  //     $modalDescription.textContent = data.description_full

  //   }catch(err){
  //     const data = findUserByUuid(users, uuid)

  //     $modalTitle.textContent = data.login.username;
  //     $modalImage.setAttribute('src', data.picture.large);
  //     const HTMLString = userDescriptionTemplate(data);
  //     const descriptionElement = createTemplate(HTMLString);
  //     $modalDescription.append(descriptionElement);
  //   }
  // }


  $hideModal.addEventListener('click', hideModal)

  function hideModal() {
    $overlay.classList.remove('active')
    $modal.style.animation = 'modalOut .8s forwards'
  }




})()
