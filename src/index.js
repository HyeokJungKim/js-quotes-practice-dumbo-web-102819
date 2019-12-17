// STABLE ELEMENTS IN THE HTML
// DO NOT ADD EVENT LISTENERS TO THESE ELEMENTS INSIDE OF A FUNCTION
let quotesUL = document.querySelector("#quote-list")
let newQuoteForm = document.getElementById("new-quote-form")



// BONUS

let searchInput = document.createElement("input")
searchInput.type = "text"
searchInput.placeholder = "Search for quote"

document.body.prepend(searchInput)

searchInput.addEventListener("input", (evt) => {
  let thingTyped = evt.target.value

  let allQuotes = document.querySelectorAll("li.quote-card")

  allQuotes.forEach((quoteLi) => {
    let pTag = quoteLi.querySelector("p")
    if (pTag.innerText.includes(thingTyped)) {
      quoteLi.style.display = ""
    } else {
      quoteLi.style.display = "none"
    }
  })


})

// BONUS




fetch("http://localhost:3000/quotes?_embed=likes")
  .then(r => r.json())
  .then((quotesArr) => {

    quotesArr.forEach((quote) => {
      takeOneQuoteToHTML(quote)
    })

  })





newQuoteForm.addEventListener("submit", (evt) => {
  evt.preventDefault()

  let newQuote = evt.target["new-quote"].value
  let author = evt.target.author.value


  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify({
      quote: newQuote,
      author: author
    })
  })
  .then(r => r.json())
  .then((newQuoteObj) => {
    newQuoteObj.likes = []
    takeOneQuoteToHTML(newQuoteObj)
  })


})









// {} -> <html></html>
// Event Listeners associated with that HTML goes here
function takeOneQuoteToHTML(quoteObj){

  // CREATE THE BOX
  let newLi = document.createElement("li")
    newLi.classList.add("quote-card")
    // newLi.className = "quote-card"


  // FILL THE BOX
  newLi.innerHTML = `<blockquote class="blockquote">
      <p class="mb-0">${quoteObj.quote}</p>
      <footer class="blockquote-footer">${quoteObj.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quoteObj.likes.length}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>`


  // PUT THE BOX ON PAGE
  quotesUL.append(newLi)


  // FIND THE ELEMENTS INSIDE OF THE BOX
  let deleteButton = newLi.querySelector(".btn-danger")
  let likesSpan = newLi.querySelector('span')
  let likeButton = newLi.querySelector(".btn-success")



  deleteButton.addEventListener("click", () => {

    fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
      method: "DELETE"
    })
    .then(r => r.json())
    .then(() => {
      newLi.remove()
    })

  })



  likeButton.addEventListener("click", () => {

    fetch("http://localhost:3000/likes", {
      method: "POST",
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        quoteId: quoteObj.id
      })
    })
    .then(r => r.json())
    .then((newLikeObj) => {
      // Changing quoteObj in JS memory //
      quoteObj.likes.push(newLikeObj)
      likesSpan.innerText = quoteObj.likes.length

    })
  })

}
