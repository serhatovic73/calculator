document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const buttons = document.querySelectorAll(".btn");

  let currentInput = "";
  let lastResult = "";

  const updateDisplay = (value) => {
    display.value = value;
  };

  const calculate = () => {
    try {
      // x isaretini * ile degistir
      let expression = currentInput.replace(/x/g, "*");

      //yuzdelik islemler icin donusturme
      expression = expression.replace(/(\d+(\.\d+)?)%/g, "$1/100");

      let result = eval(expression);

      if (!isFinite(result)) throw new Error("Invalid");
      lastResult = result;
      currentInput = result.toString();
      updateDisplay(currentInput);
    } catch {
      updateDisplay("Hata");
      currentInput = "";
    }
  };
  const handleInput = (value) => {
    switch (value) {
      case "clear-entry":
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput);
        break;
      case "clear-all":
        currentInput = "";
        updateDisplay("");
        break;
      case "backspace":
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput);
        break;
      case "calculate":
        calculate();
        break;
      default:
        if (display.value === "Hata") currentInput = "";

        const lastChar = currentInput.slice(-1);
        const operators = ["+", "-", "x", "/", "%", "."];

        // 🔹 Başlangıçta operatör girilmesini engelle
        if (currentInput === "" && operators.includes(value)) {
          return; // hiçbir şey ekleme
        }

        // 🔹 Yüzdelik işaretinin yanlış konumda kullanılmasını engelle
        if (
          value === "%" &&
          (currentInput === "" || operators.includes(lastChar))
        ) {
          return;
        }

        // 🔹 İki operatörün ardışık gelmesini engelle
        if (operators.includes(lastChar) && operators.includes(value)) {
          currentInput = currentInput.slice(0, -1) + value;
        } else {
          currentInput += value;
        }

        updateDisplay(currentInput);
        break;
      
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-value");
      handleInput(value);
    });
  });
  //klavye destegi
  document.addEventListener("keydown", (e) => {
    const key = e.key;

    if (!idNaN(key) || "+-*/.%".includes(key)) {
      handleInput(key);
    } else if (key === "Enter" || key === "=") {
      e.preventDefault();
      calculate();
    } else if (key === "Backspace") {
      handleInput("backspace");
    } else if (key === "Escape") {
      handleInput("clear-all");
    }
  });
});
