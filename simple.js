function simpleCrack() {
  if (!document.body.dataset.answerid) {
    alert('不是答题页')
    return
  }
  const open = window.open

  const items = Array.from(document.querySelectorAll('.xuanxiang')).slice(0, 1)

  const cache = {}
  function getCheckboxOptions(el) {
    const _options = Array.from(el.querySelectorAll('input')).map(input => input.value)

    const key = _options.join(',')

    if (cache[key]) return cache[key]

    function recursion(option) {
      option = option.concat('')

      let result = []

      for (let i = 0; i < option.length; i++) {
        const char = option[i]
        if (char === '') {
          result.push([char])
          continue
        }
        const rest = option.filter(Boolean).slice(i + 1)
        if (rest.length) {
          result = result.concat(
            recursion(rest).reduce((prev, r) => {
              prev.push([char].concat(r))
              return prev
            }, [])
          )
        } else {
          result.push([char])
        }
      }
      return result
    }

    return cache[key] = _options.reduce((prev, char, idx) => {
      const rest = _options.slice(idx + 1)
      const group = recursion(rest).map(opts => [char].concat(opts).filter(Boolean).sort().join(','))
      return prev.concat(group)
    }, []).sort((a, b) => b.length - a.length)
  }

  const allQuestions = items.map(el => {
    const type = ['radio', 'checkbox', 'judgement'][el.dataset.qtype - 1]
    const description = {
      type,
      question: el.querySelector('.timu').childNodes[0].textContent,
      prevGuess: undefined,
      currentGuess: undefined,
      answer: '',
      options: type === 'checkbox' ? getCheckboxOptions(el) : ['A', 'B', 'C', 'D'].slice(0, el.querySelector('.xx_ul').children.length),
      el
    }
    description.prevGuess = description.options[0]
    description.currentGuess = description.options[0]
    return description
  })

  function setValue() {
    allQuestions.forEach((description, index) => {
      if (index === questionIndex) {
        description.prevGuess = description.currentGuess
        if (prevScore !== undefined) {
          description.currentGuess = description.options[description.options.indexOf(description.currentGuess) + 1]
        }
      }
      const guess = description.currentGuess
      switch (description.type) {
        case 'radio':
        case 'judgement':
          description.el.querySelector('.xx_ul').children[description.options.indexOf(guess)].querySelector('input').checked = true
          break
        case 'checkbox':
          const checked = guess.split(',')
          Array.from(description.el.querySelector('.xx_ul').children).forEach(li => {
            const input = li.querySelector('input')
            input.checked = checked.includes(input.value)
          })
          break
        default:
      }
    })
  }

  function test() {
    commit(buildData())
  }

  let countOfTest = 0
  function tryAgain() {
    countOfTest++
    if (countOfTest > 15) {
      alert('尝试次数超过15次')
      return
    }
    setValue()
    test()
  }

  function getCurrentQuestion() {
    return allQuestions[questionIndex]
  }

  function next() {
    const q = getCurrentQuestion()
    q.answer = q.currentGuess

    questionIndex++
    if (questionIndex < allQuestions.length) {
      tryAgain()
    } else {
      const string = JSON.stringify(allQuestions.map(description => ({
        type: description.type,
        answer: description.answer,
        question: description.question
      })))
      alert('success')
      window.open = open
      console.log('answer', string)
      const a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob([string], { type: 'text/plain' }))
      a.download = 'answer.txt'
      a.click()
    }
  }

  function assert(nval, oval) {
    if (nval > oval) return true
    if (nval < oval) {
      const q = getCurrentQuestion()
      q.currentGuess = q.prevGuess
      return true
    }
    return false
  }

  let prevScore
  window.open = function (url) {
    const matched = url.match(/score=(\d+)/)
    if (matched) {
      const score = +matched[1]
      if (prevScore === undefined) {
        prevScore = score
        if (score === 100) {
          questionIndex = allQuestions.length - 1
          allQuestions.forEach(description => {
            description.answer = description.currentGuess
          })
          next()
        } else {
          tryAgain()
        }
      } else {
        if (assert(score, prevScore)) {
          prevScore = Math.max(score, prevScore)
          next()
        } else {
          tryAgain()
        }
      }
    } else {
      alert('not match score')
    }
  }

  tryAgain()

}

simpleCrack()