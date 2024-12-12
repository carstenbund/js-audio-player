# js-audio-player

Editable Controls  
  
Init : 

in head  
load Font awesome  
and js file  

```html

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" type="text/css" href="audio-player.css">

```
create a container for the player  
```html

    <div id="my-audio-player"></div>

```
use container name and audio file to init player  
```html

    <script>
        document.addEventListener('DOMContentLoaded', () => {  
            const myPlayer = createAudioPlayer('my-audio-player', 'Dohle.mp3');  
        });  
    </script>

```
