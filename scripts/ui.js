var windowOrder = ['fileExplorer', 'internetExplorer','outlookExpress','recycleBin','mediaPlayer','errorWindow','commandPrompt'];

function moveItemToEnd(array, itemToMove) {
  const index = array.indexOf(itemToMove);
  if (index !== -1) {
    array.splice(index, 1); // Remove the item from its current position
    array.push(itemToMove); // Add the item to the end of the array
  }
}

$( document ).ready(function() {
    console.log( "ready!" );

    $( ".window" ).draggable({ handle: ".window-header" });

    $(".window.resizable").each(function(){
      // If there is a min width and height set then use that otherwise use default value of 400
      let minWidth = ($(this).attr('data-minWidth') !== undefined) ? $(this).attr('data-minWidth') : 400;
      let minHeight = ($(this).attr('data-minHeight') !== undefined) ? $(this).attr('data-minHeight') : 400;

      console.log();
      $(this).resizable({
        handles: "s, e, se", // Choose the handles for resizing
        minWidth: minWidth, // Minimum width the div can be resized to
        minHeight: minHeight, // Minimum height the div can be resized to
      });
    });

  $('.window').each(function(){
    $(this).css('height',$(this).attr('data-height'));
    $(this).css('width',$(this).attr('data-width'));
    $(this).css('top',$(this).attr('data-top'));
    $(this).css('left',$(this).attr('data-left'));
  });

  //taskbar launcher
  $('.launcher:not(.dbl)').click(function(){
    launchWindow($(this).attr('data-target'));
    $(this).addClass('active');
  });

  $('.launcher.dbl').dblclick(function(){
    launchWindow($(this).attr('data-target'));
    let target = $(this).attr('data-target');
    $('.taskbar-items li[data-target="'+target+'"]').addClass('active');
  });

  $('.window').mousedown(function(){
    var windowID = $(this).attr('id');
    console.log(windowID+' has focus');
    moveItemToEnd(windowOrder, windowID);

    $('.window').each(function(){
      id = $(this).attr('id');
      zindex = (windowOrder.indexOf(id) + 1) * 10;
      $(this).css('z-index',zindex)
    });

    // Run specified function on window focus
    let focusFunction = $(this).attr('data-onfocus');
    if (focusFunction) {
      window[focusFunction]();
    }
  });

  $('.exitBtn').click(function(){
    var modal = $(this).parent().parent().parent('.window');
    console.log(modal);
    modal.hide();
    modal.css('height',modal.attr('data-height'));
    modal.css('width',modal.attr('data-width'));
    modal.css('top',modal.attr('data-top'));
    modal.css('left',modal.attr('data-left'));

    var windowID = modal.attr('id');
    console.log(windowID);

    $('.taskbar-items .launcher[data-target="'+windowID+'"]').removeClass('active');

    if (windowID == 'fileExplorer') {
      fileExplorerReset();
    }
  });

  $('.minimizeBtn').click(function(){
    var modal = $(this).parent().parent().parent('.window');
    console.log(modal);
    modal.hide();
  });

  $('.mail-messages-list .email').dblclick(function(){
    let targetMsg = $(this).attr('data-email');
    $('.emailMsg').hide();
    $(targetMsg).show();

    let from = $(this).find('.from').text();
    let subject = $(this).find('.subject').text();
    let to = "Jerry Ford";

    $('#emailFrom').text(from);
    $('#emailTo').text(to);
    $('#emailSubject').text(subject);
    $('.noEmail').hide()
  });

  $('.start-btn').click(function(){
    $('.start-menu').addClass('open');
  });

  $(document).mousedown(function(e){
    var container = $(".start-menu");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        $('.start-menu').removeClass('open');
    }
  });


  // WINDOW INITIALIZATIONS
  initializeOutlook();

});

// REGULAR FUNCTIONS
function launchWindow(target) {
  $('#'+target).show();

  moveItemToEnd(windowOrder, target);

  $('.window').each(function(){
    id = $(this).attr('id');
    zindex = (windowOrder.indexOf(id) + 1) * 10;
    $(this).css('z-index',zindex)
  });

  // Run specified function on window open
  let focusFunction = $('#'+target).attr('data-onfocus');
  if (focusFunction) {
    window[focusFunction]();
  }
}

function fileExplorerReset() {
  filePath = "D:\\";
  $('#fileAddressBar').val(filePath);
  getFilesFromPath();
}


function displayError(error, errorHeader) {
  if (!error) {
    var error = 'An unkown error occured';
  }
  $('#errorMsg').text(error);
  launchWindow('errorWindow');

  let audio = new Audio('assets/audio/xperror.mp3');
  audio.play();
}

function closeError() {
  var modal = $('#errorWindow');
  console.log(modal);
  modal.hide();
  modal.css('height',modal.attr('data-height'));
  modal.css('width',modal.attr('data-width'));
  modal.css('top',modal.attr('data-top'));
  modal.css('left',modal.attr('data-left'));
}

function updateClock() {
  const clockElement = $('#timeElement');
  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');

  const timeString = `${hours}:${minutes}:${seconds}`;
  clockElement.text(timeString);
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initial update
updateClock();

// Get carret position for terminal

function getCaretPosition(editableDiv) {
  var caretPos = 0,
    sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == editableDiv) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    if (range.parentElement() == editableDiv) {
      var tempEl = document.createElement("span");
      editableDiv.insertBefore(tempEl, editableDiv.firstChild);
      var tempRange = range.duplicate();
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint("EndToEnd", range);
      caretPos = tempRange.text.length;
    }
  }
  return caretPos;
}

$(document).on('click', '.terminal-line', function() {
  if ($(this).find('.user-line.active')) {
    $('.user-line.active').focus();
  }
});

// $(document).on('mouseup keyup', '.user-line.active', function() {
//   let caretPos = getCaretPosition(this)
//   console.log(caretPos);
//
//   let input = $('.user-line.active');
//
//   let textContent = input.text();
//   let part1 = textContent.substring(0, caretPos);
//   let part2 = textContent.substring(caretPos);
//   let isolatedCharacter = "<span class='terminal-cursor'>" + part2.charAt(0) + "</span>";
//   console.log(part1);
//   console.log(isolatedCharacter);
//   console.log(part2.substring(1));
//   let newContent = part1 + isolatedCharacter + part2.substring(1);
//
//   input.html(newContent);
//
//   setCaretPosition(caretPos);
// });

// INITIALIZE FUNCTIONS

function initializeOutlook() {
  $('.emailMsg').hide();
}

function initializeCmd() {
  console.log('focus input');
  $('.user-line.active').focus();
}




// SIMPLE ASYNC EXAMPLE :)

function showAlert() {
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve('done!');
    }, 5000);
  });
}

async function testAsync() {
  console.log('waiting...');
  const promise = await showAlert();
  console.log(promise);
}
