
var haveEvents = 'GamepadEvent' in window;
var controllers = {};
var rAF = window.requestAnimationFrame;

var introTip = 'PROTIP: Press buttons on your controller.';

function connecthandler(e) {
  
  startHeader.classList = 'connected';
  statusHeader.innerText = 'Controller connected';
  
  helpButton.style.display = 'none';
  
  addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;
  var d = document.createElement("div");
  d.setAttribute("id", "controller" + gamepad.index);
  
  // gamepad.id;
  print.innerText = introTip;
  
  document.body.appendChild(d);
  rAF(updateStatus);
}

function disconnecthandler(e) {
  statusHeader.innerText = 'Controller disconnected';
  startHeader.classList = 'disconnected';
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  print.innerText = '';
  print.style.background = '';
  delete controllers[gamepad.index];
}

function updateStatus() {
  scangamepads();
  for (j in controllers) {
    var controller = controllers[j];
    var d = document.getElementById("controller" + j);
    
    var emoji = '';
    
    for (var i = 0; i < controller.buttons.length; i++) {
      
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      var touched = false;
      
      if (typeof(val) == "object") {
        
        pressed = val.pressed;
        if ('touched' in val) {
          touched = val.touched;
        }
        val = val.value;
        
      }
      
      var pct = Math.round(val * 100) + "%";
      
      var abxy = ['[A]', '[B]', '[X]', '[Y]'];
      
      if (pressed || touched) {

        if (pressed) {
          
          // if button is in ABXY range
          if (i >= 0 && i < 4) {
            
            // show corresponding letter
            print.innerText = abxy[i];
            
          } else if (i > 5 && i < 8) { // if button is a pressable button
            
            emoji = 'Pistol';
            print.innerText = '';
            
          } else if (i == 9) { // if button is start button
            
            // if not logging in
            if (print.innerText != introTip) {

              // show emoji
              emoji = 'Play-Button';
              print.innerText = '';

            }
            
          } else if (i == 8) { // if pressed window button
            
            emoji = 'Window';
            print.innerText = '';
            
          } else if (i == 16) { // if pressed home button
            
            emoji = 'House';
            print.innerText = '';
            
          } else {
            
            emoji = 'Backhand-Index-Pointing-Up';
            print.innerText = '';
            
          }
          
        } else if (touched) {
          
          emoji = 'Index-Pointing-Up';
          print.innerText = '';
          
        }
        
      }
      
    }
    
    
    for (var i = 0; i < controller.axes.length; i++) {

      if (i == 3 || i == 1) {

        if (controller.axes[i] < -0.5) {
          emoji = 'Up-Arrow';
          print.innerText = '';
        }

        if (controller.axes[i] > 0.5) {
          emoji = 'Down-Arrow';
          print.innerText = '';
        }

      }

      if (i == 2 || i == 0) {

        if (controller.axes[i] < -0.5) {
          emoji = 'Left-Arrow';
          print.innerText = '';
        }

        if (controller.axes[i] > 0.5) {
          emoji = 'Right-Arrow';
          print.innerText = '';
        }

      }

      if (print.innerText != introTip) {
        
        if (emoji != '') {

          print.style.backgroundImage = 'url("/emoji/' + emoji + '-Emoji.png")';

        } else {

          print.style.backgroundImage = '';

        }
        
      }

    }
  }
  rAF(updateStatus);
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i] && (gamepads[i].index in controllers)) {
      controllers[gamepads[i].index] = gamepads[i];
    }
  }
}

var startHeader,
    statusHeader,
    print,
    helpButton,
    dialog,
    rumbleButtons;

var vibrationPresets = {
  
  weak: {
    duration: 250,
    strongMagnitude: 0,
    weakMagnitude: 0.07
  },
  
  stronger: {
    duration: 500,
    strongMagnitude: 0,
    weakMagnitude: 0.14
  },
  
  godlike: {
    duration: 1000,
    strongMagnitude: 1,
    weakMagnitude: 1
  },
  
}

window.addEventListener('load', () => {
  
  startHeader = document.querySelector('#start');
  statusHeader = document.querySelector('.status');
  print = document.querySelector('.print');
  helpButton = document.querySelector('.help');
  dialog = document.querySelector('.dialog-wrapper');
  rumbleButtons = document.querySelectorAll('.rumble');
    
  if (haveEvents) {
    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);
  }
  
  rumbleButtons.forEach(button => {
    
    button.addEventListener('click', async () => {
      
      // if controller is connected
      if (controllers[0]) {
        
        var vibrationEffect;
        
        // load a vibration preset
        if (button.classList.contains('godlike')) {
          
          vibrationEffect = vibrationPresets.godlike;
          
        } else if (button.classList.contains('double')) {
          
          vibrationEffect = vibrationPresets.stronger;
          
        } else {
          
          vibrationEffect = vibrationPresets.weak;
          
        }
        
        // play vibration effect
        var gamepad = controllers[0];
        if (gamepad.vibrationActuator) {
          
          button.classList.add('rumbling');
          
          await gamepad.vibrationActuator.playEffect('dual-rumble', vibrationEffect);
          
          button.classList.remove('rumbling');
          
        }
        
      }

    });

  });
    
  // when clicked on help button
  helpButton.addEventListener('click', () => {
    
    // show dialog
    dialog.classList.add('visible');
    
  });
  
  var dialogCloseButton = dialog.querySelector('.dialog-close');
  var dialogDoneButton = dialog.querySelector('.dialog-done');
  
  // when clicked on close buttons, close dialog
  
  dialogCloseButton.addEventListener('click', () => {
    
    // close dialog
    dialog.classList.remove('visible');
    
  });
  
  dialogDoneButton.addEventListener('click', () => {
    
    // close dialog
    dialog.classList.remove('visible');
    
  });
  
  // dialog radio buttons
  
  var dialogRadioButtons = dialog.querySelectorAll('.radio-box');
  var dialogVideo = dialog.querySelector('.dialog-video-container iframe');
  
  // for each radio button
  dialogRadioButtons.forEach(radioButton => {
    
    // when clicked on radio button
    radioButton.addEventListener('click', () => {
    
      // uncheck other radio button
      dialog.querySelector('.radio-box.checked').classList.remove('checked');
      
      // check this radio button
      radioButton.classList.add('checked');
      
      // show respective video
      if (radioButton.id == 'playstation') {
        
        dialogVideo.src = 'https://www.youtube-nocookie.com/embed/pe9rAJMJq8c';
        
      } else if (radioButton.id == 'xbox') {
        
        dialogVideo.src = 'https://www.youtube-nocookie.com/embed/o-Len0ObEYs';
        
      }

    });
    
  });
  
  
  // fix page stutter on load  
  rAF(() => {
    document.body.classList.add('loaded');
  });
  
});
