document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById("display")
    const equation = document.getElementById("equation")
    let firstOperand = null
    let operator = null
    let waitingForSecondOperand = false
  
    // Add click event listeners to all buttons
    document.querySelectorAll(".btn").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.classList.contains("number")) {
          inputDigit(button.dataset.digit)
        } else if (button.classList.contains("operator")) {
          handleOperator(button.dataset.action)
        } else if (button.dataset.action === "calculate") {
          handleEquals()
        } else if (button.dataset.action === "clear") {
          clearDisplay()
        } else if (button.dataset.action === "toggle-sign") {
          handleToggleSign()
        } else if (button.dataset.action === "percentage") {
          handlePercentage()
        }
      })
    })
  
    // Add keyboard support
    document.addEventListener("keydown", (event) => {
      const { key } = event
  
      // Prevent default behavior for calculator keys
      if (
        /^[0-9]$/.test(key) ||
        key === "." ||
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/" ||
        key === "Enter" ||
        key === "Escape" ||
        key === "Backspace" ||
        key === "%"
      ) {
        event.preventDefault()
      }
  
      // Handle number keys
      if (/^[0-9]$/.test(key)) {
        inputDigit(key)
      }
      // Handle operators
      else if (key === "+") {
        handleOperator("add")
      } else if (key === "-") {
        handleOperator("subtract")
      } else if (key === "*") {
        handleOperator("multiply")
      } else if (key === "/") {
        handleOperator("divide")
      }
      // Handle equals
      else if (key === "Enter" || key === "=") {
        handleEquals()
      }
      // Handle clear
      else if (key === "Escape" || key === "c" || key === "C") {
        clearDisplay()
      }
      // Handle decimal
      else if (key === ".") {
        inputDigit(".")
      }
      // Handle percentage
      else if (key === "%") {
        handlePercentage()
      }
      // Handle backspace
      else if (key === "Backspace") {
        if (display.textContent.length > 1 && display.textContent !== "0") {
          display.textContent = display.textContent.slice(0, -1)
        } else {
          display.textContent = "0"
        }
      }
    })
  
    function inputDigit(digit) {
      if (waitingForSecondOperand) {
        display.textContent = digit
        waitingForSecondOperand = false
      } else {
        display.textContent = display.textContent === "0" ? digit : display.textContent + digit
      }
    }
  
    function inputDecimal() {
      if (waitingForSecondOperand) {
        display.textContent = "0."
        waitingForSecondOperand = false
        return
      }
  
      if (!display.textContent.includes(".")) {
        display.textContent += "."
      }
    }
  
    function clearDisplay() {
      display.textContent = "0"
      equation.textContent = ""
      firstOperand = null
      operator = null
      waitingForSecondOperand = false
  
      // Remove active class from all operators
      document.querySelectorAll(".operator").forEach((op) => {
        op.classList.remove("active")
      })
    }
  
    function handleOperator(nextOperator) {
      const inputValue = Number.parseFloat(display.textContent)
  
      // Remove active class from all operators
      document.querySelectorAll(".operator").forEach((op) => {
        op.classList.remove("active")
      })
  
      // Add active class to the current operator
      document.querySelector(`[data-action="${nextOperator}"]`).classList.add("active")
  
      const operatorSymbol = getOperatorSymbol(nextOperator)
  
      if (firstOperand === null) {
        equation.textContent = `${inputValue} ${operatorSymbol} `
        firstOperand = inputValue
      } else if (operator) {
        const result = performCalculation()
        display.textContent = String(result)
        equation.textContent = `${result} ${operatorSymbol} `
        firstOperand = result
      } else {
        equation.textContent = `${inputValue} ${operatorSymbol} `
      }
  
      waitingForSecondOperand = true
      operator = nextOperator
    }
  
    function getOperatorSymbol(op) {
      switch (op) {
        case "add":
          return "+"
        case "subtract":
          return "-"
        case "multiply":
          return "×"
        case "divide":
          return "÷"
        default:
          return op
      }
    }
  
    function performCalculation() {
      const inputValue = Number.parseFloat(display.textContent)
  
      if (operator === "add") {
        return firstOperand + inputValue
      } else if (operator === "subtract") {
        return firstOperand - inputValue
      } else if (operator === "multiply") {
        return firstOperand * inputValue
      } else if (operator === "divide") {
        return firstOperand / inputValue
      }
  
      return inputValue
    }
  
    function handleEquals() {
      if (!operator) return
  
      const inputValue = Number.parseFloat(display.textContent)
      const result = performCalculation()
  
      equation.textContent = `${equation.textContent}${inputValue} = `
      display.textContent = String(result)
      firstOperand = result
      operator = null
      waitingForSecondOperand = false
  
      // Remove active class from all operators
      document.querySelectorAll(".operator").forEach((op) => {
        op.classList.remove("active")
      })
    }
  
    function handlePercentage() {
      const currentValue = Number.parseFloat(display.textContent)
      const percentValue = currentValue / 100
      display.textContent = String(percentValue)
    }
  
    function handleToggleSign() {
      const currentValue = Number.parseFloat(display.textContent)
      display.textContent = String(-1 * currentValue)
    }
  })
  
  