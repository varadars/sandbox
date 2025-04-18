document.addEventListener('DOMContentLoaded', () => {
    const keyboard = document.querySelector('.keyboard'); // Use class selector for keyboard
    const value = document.getElementById('typed')
    const listOfWordsEl = document.getElementById('list-of-words');

    // Color settings
    const originalColor = '#333';
    const originalTextColor = '#fff';
    const pressedColor = '#8378e7';
    const pressedTextColor = originalColor;


    let listOfWords = [];

    let lastPressedKey = null;

    // Example usage
    //const result = Hangul.assemble(['ㅎ', 'ㅏ', 'ㄴ', 'ㄱ', 'ㅜ', 'ㄹ']);
    //console.log(result); // Outputs assembled Hangul text

    document.addEventListener('keydown', (event) => {
        const keyId = event.key.toLowerCase(); // Get the key pressed
        const key = document.getElementById(keyId);

        if(!key) {
            //backspace, other keys should do nothing, enter should clear
            if(event.key === " ") {
                value.textContent += " ";
            } else if (event.key === "Enter"){
                if (listOfWords.length > 0) {
                    listOfWordsEl.textContent += ", ";
                }
                listOfWords.push(value.textContent);
                listOfWordsEl.textContent += value.textContent;
                console.log(listOfWords);
                value.textContent = "";
            } else if (event.key === "Backspace") {
                let breakdown = Hangul.d(value.textContent);
                value.textContent = Hangul.a(breakdown.slice(0,-1));
            }
        } else {
            let breakdown = Hangul.d(value.textContent + key.textContent.charAt(0));
            value.textContent = Hangul.a(breakdown);
        }


        // Reset color of the previously pressed key
        if (lastPressedKey && lastPressedKey !== key) {
            lastPressedKey.style.backgroundColor = originalColor;
            lastPressedKey.style.color = originalTextColor;
        }

        if (key) {
            
            // Normalize the key's position
            const gridX = key.getAttribute("gridX")
            const gridY = key.getAttribute("gridY");

            // Calculate transform values
            const scale = 0.75;
            const rotateY = gridX; // Adjust range if needed
            const rotateX =  -15 + gridY * 5;  // Adjust range if needed

            // Apply transform
            keyboard.style.transform = `perspective(1000px) rotateY(${-rotateY}deg) rotateX(${-rotateX}deg) scale(${scale})`;

            // Update color of the pressed key
            key.style.backgroundColor = pressedColor;
            key.style.color = pressedTextColor;

            // Update last pressed key
            lastPressedKey = key;
        }
    });
});
