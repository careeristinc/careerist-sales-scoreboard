# careerist-sales-scoreboard

Injection
```javascript
const injectionMarker = 'careerist-sales-extension-injected';
const jqueryUrl = 'https://code.jquery.com/jquery-3.7.1.min.js';
const scoreboardScriptUrl = 'https://cdn.jsdelivr.net/gh/careeristinc/careerist-sales-scoreboard/scoreboard.js';
const scoreboardCssUrl = 'https://raw.githubusercontent.com/careeristinc/careerist-sales-scoreboard/main/scoreboard.css';
const scoreboardHtmlUrl = 'https://raw.githubusercontent.com/careeristinc/careerist-sales-scoreboard/main/scoreboard.html';
const scoreboardParams = {
  url: 'https://...',
  advisor: '...'
};

if (!window[injectionMarker]) {
  window[injectionMarker] = true;

  fetch(jqueryUrl)
    .then(response => response.text())
    .then(jqueryScriptText => {
      const jqueryBlob = new Blob([jqueryScriptText], { type: 'text/javascript' });
      const jqueryScript = document.createElement('script');
      jqueryScript.src = URL.createObjectURL(jqueryBlob);
      document.head.appendChild(jqueryScript);

      return fetch(scoreboardScriptUrl);
    })
    .then(response => response.text())
    .then(injectedScriptText => {
      const injectedBlob = new Blob([injectedScriptText], { type: 'text/javascript' });
      const injectedScript = document.createElement('script');
      injectedScript.src = URL.createObjectURL(injectedBlob);
      injectedScript.onload = () => {
        if (typeof scoreboard === 'function') {
          scoreboard(scoreboardParams.url, scoreboardParams.advisor);
        } else {
          console.error('scoreboard function is not defined');
        }
      };
      document.head.appendChild(injectedScript);

      return fetch(scoreboardCssUrl);
    })
    .then(response => response.text())
    .then(cssText => {
      const styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.innerText = cssText;
      document.head.appendChild(styleSheet);

      return fetch(scoreboardHtmlUrl);
    })
    .then(response => response.text())
    .then(htmlText => {
      $(htmlText).appendTo('body');
    })
    .catch(error => console.error('Script loading error:', error));
} else {
  console.log('careerist-sales-extension has already been injected into this page.');
}
```
