document.addEventListener('DOMContentLoaded', function () {
    const originalText = document.getElementById('originalText');
    const wordsToRedact = document.getElementById('wordsToRedact');
    const replacementText = document.getElementById('replacementText');
    const redactButton = document.getElementById('redactButton');
    const clearButton = document.getElementById('clearButton');
    const redactedText = document.getElementById('redactedText');
    const stats = document.getElementById('stats');
    const charCountDisplay = document.getElementById('charCount');

    redactButton.addEventListener('click', function () {
        const text = originalText.value;
        const words = wordsToRedact.value.split(' ');
        const replacement = replacementText.value;

        const startTime = performance.now();
        const { redacted, scanCount, matchCount, charCount } = redactWords(text, words, replacement);
        const endTime = performance.now();

        redactedText.textContent = redacted;
        displayStats(scanCount, matchCount, charCount, (endTime - startTime) / 1000);
    });

    function redactWords(text, words, replacement) {
        let scanCount = 0;
        let matchCount = 0;
        let charCount = 0;

        for (const word of words) {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            text = text.replace(regex, match => {
                scanCount++;
                matchCount++;
                charCount += match.length;
                return replacement || '*'.repeat(match.length);
            });
        }

        return { redacted: text, scanCount, matchCount, charCount };
    }

    function displayStats(scanCount, matchCount, charCount, elapsedTime) {
        stats.innerHTML = `
            <p>Words Scanned: ${scanCount}</p>
            <p>Words Matched and Replaced: ${matchCount}</p>
            <p>Total Characters Scrambled: ${charCount}</p>
            <p>Time Taken: ${elapsedTime.toFixed(2)} seconds</p>
        `;
    }
    originalText.addEventListener('input', function () {
        charCountDisplay.textContent = originalText.value.length;
    });
    clearButton.addEventListener('click', function () {
        originalText.value = '';
        wordsToRedact.value = '';
        replacementText.value = '';
        redactedText.textContent = '';
        stats.textContent = '';
        charCountDisplay.textContent = 'Character Count: 0';
    });

});
