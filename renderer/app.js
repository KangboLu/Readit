// Modules
const {ipcRenderer} = require('electron')
const items = require('./items.js')
const menu = require('./menu.js')

// navigate selected item
$(document).keydown((e) => {
  switch (e.key) {
    case 'ArrowUp':
      // console.log('Prev Item Selected');
        items.changeItem('up')
      break;
      case 'ArrowDown':
        // console.log('Next Item Selected');
        items.changeItem('down')
        break;
  }
})

// show add-modal
$('.open-add-modal').click(() => {
  $('#add-modal').addClass('is-active')
})

// hide add-modal
$('.close-add-modal').click(() => {
  $('#add-modal').removeClass('is-active')
})

// handle add-modal submission
$('#add-button').click(() => {
  // get URL from input form
  let newItemURL = $('#item-input').val()
  // if (newItemURL) console.log(newItemURL)

  // Disable modal UI
  $('#item-input').prop('disable', true)
  $('#add-button').addClass('is-loading')
  $('.close-add-modal').addClass('is-disabled')

  // send URL to the main process using IPC
  ipcRenderer.send('new-item', newItemURL)
})

// listen for new item for main
ipcRenderer.on('new-item-success', (event, item) => {
  console.log(item);

  // add item to items array
  items.toreadItems.push(item)

  // save items
  items.saveItems()

  // add item
  items.addItem(item)

  // close and reset modal
  $('#add-modal').removeClass('is-active')
  $('#item-input').prop('disable', false).val('')
  $('#add-button').removeClass('is-loading')
  $('.close-add-modal').removeClass('is-disabled')

  // if first item being added, select it
  if (items.toreadItems.length === 1)
    $('.read-item:first()').addClass('is-active')

})

// simulate add click on ENTER
$('#item-input').keyup((event) => {
  if (event.key === 'Enter') $('#add-button').click()
})

// filter items by title
$('#search').keyup((event) => {
  // get current #search input value
  let filter = $(event.currentTarget).val()
  // console.log(filter)
  // show and hide the elements
  $('.read-item').each((i, el) => {
    $(el).text().toLowerCase().includes(filter) ? $(el).show() : $(el).hide()
  })
})

// add items when the app loads
if (items.toreadItems.length){
  items.toreadItems.forEach(items.addItem)
  $('.read-item:first()').addClass('is-active')
}
