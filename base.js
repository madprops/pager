const M = {}

M.init = function () {
  M.numb = M.$("#numb")
  M.filter = M.$("#filter")

  M.keydec()
  M.start_widgets()
  M.update()

  if (M.numb.value) {
    M.do_numb_action()
  }

  if (M.filter.value) {
    M.do_filter_action()
  }

  M.filter.focus()
  M.move_cursor_to_end(M.filter)
}

M.$ = function (s, parent = false) {
  if (!parent) {
    parent = document
  }

  return parent.querySelector(s)
}

M.$$ = function (s, parent = false, direct = false) {
  if (!parent) {
    parent = document
  }

  let items = Array.from(parent.querySelectorAll(s))

  if (direct) {
    items = items.filter((node) => node.parentNode === parent)
  }

  return items
}

M.debounce = function (func, wait, immediate) {
  let timeout

  return function executedFunction() {
    let context = this
    let args = arguments

    let later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    let callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

M.move_cursor_to_end = function (element) {
  element.selectionStart = element.selectionEnd = element.value.length
}

M.do_numb_action = function () {
  M.numb.value = parseInt(M.numb.value.replace(/\D/g, ""))

  if (M.numb.value > 9999) {
    M.numb.value = 9999
  } else if (M.numb.value != "" && M.numb.value < 0) {
    M.numb.value = 0
  }

  M.update(M.filter.value.trim())
}

M.do_filter_action = function () {
  M.update(M.filter.value.trim())
}

M.keydec = function () {
  M.numb.addEventListener(
    "input",
    M.debounce(function (e) {
      M.do_numb_action()
    }, 350)
  )

  M.filter.addEventListener(
    "input",
    M.debounce(function (e) {
      M.do_filter_action()
    }, 350)
  )

  M.filter.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      M.clear_filter()
    }
  })

  document.addEventListener("keydown", function (e) {
    if (document.activeElement !== M.filter) {
      if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        filter.focus()
      }
    }
  })
}

M.update = function (txt = "") {
  txt = txt.toLowerCase()
  let s = ""
  let all = txt ? false : true
  let len = M.nouns.length
  let index = parseInt(M.numb.value) % len
  let exact = M.$("#exact_filter").checked

  for (let i = 0; i < M.nouns.length; i++) {
    let include = false

    if (all) {
      include = true
    } else if (exact) {
      include = M.nouns[i] === txt || M.nouns[index] === txt
    } else {
      include = M.nouns[i].includes(txt) || M.nouns[index].includes(txt)
    }

    if (include) {
      s += `
			<div class='list_item'>
				<div class='list_item_word'>${M.nouns[i]}</div>
				<div class='list_item_arrow'>-&gt;</div>
				<div class='list_item_word_2'>${M.nouns[index]}</div>
			</div>`
    }

    index += 1

    if (index >= len) {
      index = 0
    }
  }

  M.$("#list").innerHTML = s
}

M.start_widgets = function () {
  M.$("#exact_filter").addEventListener("change", function (e) {
    if (M.filter.value) {
      M.do_filter_action()
    }
  })

  M.$("#clear_filter").addEventListener("click", function (e) {
    M.clear_filter()
  })
}

M.clear_filter = function () {
  if (M.filter.value) {
    M.filter.value = ""
    M.do_filter_action()
  }
}
