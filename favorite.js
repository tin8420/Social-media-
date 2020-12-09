const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users"
const SHOW_URL = INDEX_URL + "/:id"
const datapanel = document.querySelector("#datapanel")
const paginator = document.querySelector("#paginator")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector('#search-input')
const container = document.querySelector('#container')
const ModeControl = document.querySelector('#ModeControl')
const MAN_PER_PAGE = 18
const peopleList = JSON.parse(localStorage.getItem('favoriteItem'))
// default = 0 是卡片模式  
let defaultview = 0
let filterPeople = []


function renderPeopleBycard(data) {
    let htmlContent = ""
    for (let datas of data) {
        htmlContent += `
     <div class="card m-3 col-sm-6 col-lg-2" id="cards">
         <img class="card-img-top" src="${datas.avatar}" data-toggle="modal" data-target="#show-user" data-id="${datas.id}" alt="Card image cap">
         <div class="card-body d-flex align-items-center justify-content-center">
            <h4 class="card-title">${datas.name}</h4>
            <a href="#"><i class="fas fa-trash" data-id="${datas.id}"></i></a>
          </div>
      </div>`
    }
    datapanel.innerHTML = htmlContent
}

function renderPeopleByList(data) {
    let tbody = ""
    let thead = `
        <table class="table table-dark">
            <thead>
                <tr>
                <th scope="col">Avatar</th>
                <th scope="col">Name</th>
                <th scope="col">Age</th>
                <th scope="col">Email</th>
                <th scope="col">Delete</th>
                </tr>
        </thead>
        <tbody>`
    let tfoot = `</tbody>
    </table>`
    for (let datas of data) {
        tbody += `
            <tr>
                <th scope="row"><img class="listImage" src="${datas.avatar}" data-toggle="modal" data-target="#show-user" data-id="${datas.id}" alt="Card image cap">
                </th>
                <td>${datas.name}</td>
                <td>${datas.age}</td>
                <td>${datas.email}</td>
                <td><a href="#"><i class="fas fa-trash" data-id="${datas.id}"></i></a></td>
            </tr>
        `
    }
    datapanel.innerHTML = thead + tbody + tfoot
}

function getManbypage(page) {
    const data = filterPeople.length ? filterPeople : peopleList
    const startIndex = (page - 1) * MAN_PER_PAGE
    return data.slice(startIndex, startIndex + MAN_PER_PAGE)
}


function ShowModal(id) {
    const avatar = document.querySelector("#avatar")
    const email = document.querySelector("#email")
    const birthday = document.querySelector("#birthday")
    const title = document.querySelector("#movie-modal-title")
    const age = document.querySelector("#age")
    axios.get(INDEX_URL + '/' + id).then((response) => {
        let data = response.data
        age.innerHTML = 'Age：' + data.age
        title.innerHTML = data.surname + ' ' + data.name
        email.innerHTML = 'Email：' + data.email
        birthday.innerHTML = 'Birthday： ' + data.birthday
        avatar.innerHTML = `
     <img src="${data.avatar}" alt="movie-poster" class="img-fluid" id='avatar'>
    `
    }).catch((error) => console.log(error))
}

//在datapanel上設定監聽器
datapanel.addEventListener('click', function clickbutton(e) {
    // 若按到more的按鈕，將data.id傳入ShowModal函式裡
    if (e.target.matches('.card-img-top') || e.target.matches('.listImage')) {
        ShowModal(Number(e.target.dataset.id))
    } else if (e.target.matches('.fas')) {
        deletePeopleFromFavorite(Number(e.target.dataset.id))
    }
})

function deletePeopleFromFavorite(id) {
    const index = peopleList.findIndex((people) => people.id === id)
    if (index === -1) return
    peopleList.splice(index, 1)
    localStorage.setItem('favoriteItem', JSON.stringify(peopleList))
    displaymode()
}

ModeControl.addEventListener('click', function clickButtonOfchangeToList(e) {
    if (e.target.matches('.fas')) {
        defaultview = 1
    } else {
        defaultview = 0
    }
    displaymode()
})

//預設顯示第一頁資料
function displaymode(data) {
    if (defaultview === 1) {
        renderPeopleByList(getManbypage(1))
    } else {
        renderPeopleBycard(getManbypage(1))
    }
}


function renderPaginator(amount) {
    const numberOfpages = Math.ceil(amount / MAN_PER_PAGE)
    let rawHTML = ''
    for (let page = 1; page <= numberOfpages; page++) {
        rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    ` }
    paginator.innerHTML = rawHTML
}

paginator.addEventListener('click', function clickpaginator(e) {
    const pageNum = Number(e.target.dataset.page)
    if (!e.target.classList.contains('page-link')) return
    else if (defaultview === 1) {
        renderPeopleByList(getManbypage(pageNum))
    } else {
        renderPeopleBycard(getManbypage(pageNum))
    }
})

displaymode();