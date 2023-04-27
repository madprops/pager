const App = {}

App.init = () => {
  App.numb = App.el(`#numb`)
  App.filter = App.el(`#filter`)

  App.keydec()
  App.start_widgets()
  App.update()

  if (App.numb.value) {
    App.do_numb_action()
  }

  if (App.filter.value) {
    App.do_filter_action()
  }

  App.filter.focus()
  App.move_cursor_to_end(App.filter)
}

App.el = (s, parent = false) => {
  if (!parent) {
    parent = document
  }

  return parent.querySelector(s)
}

App.debounce = (func, wait, immediate) => {
  let timeout

  return function executedFunction() {
    let context = this
    let args = arguments

    let later = () => {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    let callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

App.move_cursor_to_end = (element) => {
  element.selectionStart = element.selectionEnd = element.value.length
}

App.do_numb_action = () => {
  App.numb.value = parseInt(App.numb.value.replace(/\D/g, ``))

  if (App.numb.value > 9999) {
    App.numb.value = 9999
  }
  else if (App.numb.value != `` && App.numb.value < 0) {
    App.numb.value = 0
  }

  App.update(App.filter.value.trim())
}

App.do_filter_action = () => {
  App.update(App.filter.value.trim())
}

App.keydec = () => {
  App.numb.addEventListener(
    `input`,
    App.debounce((e) => {
      App.do_numb_action()
    }, 350)
  )

  App.filter.addEventListener(
    `input`,
    App.debounce((e) => {
      App.do_filter_action()
    }, 350)
  )

  App.filter.addEventListener(`keydown`, (e) => {
    if (e.key === `Escape`) {
      App.clear_filter()
    }
  })

  document.addEventListener(`keydown`, (e) => {
    if (document.activeElement !== App.filter) {
      if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        filter.focus()
      }
    }
  })
}

App.update = (txt = ``) => {
  txt = txt.toLowerCase()
  let s = ``
  let all = txt ? false : true
  let len = App.nouns.length
  let index = parseInt(App.numb.value) % len
  let exact = App.el(`#exact_filter`).checked

  for (let i = 0; i < App.nouns.length; i++) {
    let include = false

    if (all) {
      include = true
    }
    else if (exact) {
      include = App.nouns[i] === txt || App.nouns[index] === txt
    }
    else {
      include = App.nouns[i].includes(txt) || App.nouns[index].includes(txt)
    }

    if (include) {
      s += `
      <div class='list_item'>
        <div class='list_item_word'>${App.nouns[i]}</div>
        <div class='list_item_arrow'>-&gt;</div>
        <div class='list_item_word_2'>${App.nouns[index]}</div>
      </div>`
    }

    index += 1

    if (index >= len) {
      index = 0
    }
  }

  App.el(`#list`).innerHTML = s
}

App.start_widgets = () => {
  App.el(`#exact_filter`).addEventListener(`change`, (e) => {
    if (App.filter.value) {
      App.do_filter_action()
    }
  })

  App.el(`#clear_filter`).addEventListener(`click`, (e) => {
    App.clear_filter()
  })
}

App.clear_filter = () => {
  if (App.filter.value) {
    App.filter.value = ``
    App.do_filter_action()
  }
}
