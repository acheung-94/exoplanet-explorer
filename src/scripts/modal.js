
const modal = document.querySelector(`#modal`)
const modalIntro = document.querySelector(`#modal-intro`)
const modalContent = document.querySelector(`.modal-contents`)
const openButton = document.querySelector(`#modal-open`)
const closeButton = document.querySelector(`#modal-close`)

const readouts = []
const zones = [`.close-scard`, `.status`, `.nav-status`, `#modal-open`, `.buttons`, `.explore`, `.pause`, `.close-pcard`, `.host-star`]
let i = 0
export function initializeModal () {

    for (let i = 1; i <= zones.length;  i++) {
        readouts.push(`#readout-${i}`)
    }
    addHighlight(readouts[0])
    addHighlight(zones[0])
}
export function toggleModal (){
    
    if (modal.style.display === "none") {
        modal.style.display = "flex"
        console.log(modal)
    }else{
        modal.style.display = "none"
    }
}

function addHighlight (selector) {
    let item = document.querySelector(selector)
    item.classList.add('highlight')
}

function removeHighlights () {
    for (let i = 0; i < zones.length; i++){
        if (document.querySelector(readouts[i]).classList.contains('highlight') 
        || document.querySelector(zones[i]).classList.contains('highlight') ){
                document.querySelector(readouts[i]).classList.remove('highlight')
                document.querySelector(zones[i]).classList.remove('highlight')
        }
        
    }

}

export function scrollHandler(event) {
    let deltaY = event.deltaY
    console.log(deltaY)
    console.log(i)
    if (deltaY < 0) { // scroll down
        i -= 1
        if (i < 0) {
            i = 0
        }
    } else if (deltaY > 0) { //scroll up
        i += 1
        if (i > 9) {
            i = 9
        }
    }
    console.log(i)
    removeHighlights()
    addHighlight(zones[i])
    addHighlight(readouts[i])
}




export function closeModal (){
    toggleModal()
    modalIntro.hidden = true
}

export function openModal () {
    toggleModal()
}
