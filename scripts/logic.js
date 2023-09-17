const directory = {
  "myFiles": {
    "CCTV": {
        "Recordings": {
          "Blackstream Animation.mp4": "assets/gamefiles/webAnimationV2.mp4",
          "Teaser Edit.mp4": "assets/gamefiles/teaser edit.mp4",
          "Sand Fortrace.mp4": "assets/gamefiles/Sand Fortrace Attack Final FULL.mp4"
        }
      },
      "My Notes":{}
    }
  }

var filePath = "D:\\";

$( document ).ready(function() {


  // OPEN VIDEO IN MEDIA PLAYER


  $('#submitAddress').click(function(){;
    let newPath = $('#fileAddressBar').val();
    if (!newPath.includes('D:\\')) {
      displayError('Invalid File Path');
      $('#fileAddressBar').val(filePath);
      return
    }
    else if (!newPath.endsWith("\\")) {
      displayError('Invalid File Path');
      $('#fileAddressBar').val(filePath);
      return
    }

    filePath = newPath;

    $('#fileAddressBar').val(filePath);

    getFilesFromPath();
  });

  // VIDEO PLAYBACK CONTROL

  const video = document.getElementById('mediaPlayerVid');
  const seekSlider = document.getElementById('mediaPlayerseekSlider');

  // Update the range slider's max value once the video is loaded
  video.addEventListener('loadedmetadata', function() {
    seekSlider.max = video.duration;
  });

  // Update the video's current time based on the slider's value
  seekSlider.addEventListener('input', function() {
    video.currentTime = seekSlider.value;
  });

  // Update the slider's value as the video plays
  video.addEventListener('timeupdate', function() {
    seekSlider.value = video.currentTime;
  });



});

function playvid() {
  console.log('play');

  let vid = $("#mediaPlayerVid").get(0);
  vid.play();
}
function pausevid() {
  console.log('play');
  let vid = $("#mediaPlayerVid").get(0);
  if (vid.paused) {
    vid.currentTime = 0;
  }
  vid.pause();
}

// Find path to real file based on file path

function findValueByPath(obj, path) {
  let keys = path.split("\\");
  keys = keys.slice(1);
  console.log(keys);
  let currentObj = obj;

  for (const key of keys) {
    console.log(key);
    currentObj = currentObj[key];

    if (!currentObj) {
      // The key is not found in the current object
      return null;
    }
  }

  return currentObj;
}

function getFilesFromPath() {
  let keys = filePath.split("\\");

  keys = keys.slice(1, -1);
  console.log(keys);

  let currentObj = directory;
  for (const key of keys) {
    currentObj = currentObj[key];
    console.log(currentObj);
  }
  console.log(Object.keys(currentObj));

  currentKeys = Object.keys(currentObj);

  $('#fileExplorer .file-grid').empty();

  for (const key of currentKeys) {
    let type = "File"

    if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
      type = "Folder"
      $('#fileExplorer .file-grid').append("<div data-folderpath='"+key+"' tabindex='0' class='folder'><img src='assets/icons/Folder Closed.png' alt='folder'></img><span>"+key+"</span></div>");
    }
    else {
      $('#fileExplorer .file-grid').append("<div data-filename='"+key+"' tabindex='0' class='file'><img src='assets/icons/Generic Video.png' alt='file'></img><span>"+key+"</span></div>");
    }


    console.log('name: '+key+' type: '+type);
  }
}

$(document).on('dblclick', '.file', function() {
  console.log('file openned');
  let filename = $(this).attr('data-filename');
  console.log('file requested: '+filename);
  let src = findValueByPath(directory, filePath+filename);
  console.log('file src: '+src);
  $('#mediaPlayerLabel').text(filename);

  $('#mediaPlayerVid source').attr('src',src);
  $('#mediaPlayerVid').get(0).load()
  launchWindow('mediaPlayer');
});

$('#fileAddressBar').val(filePath);

$(document).on('dblclick', '.folder', function() {
  console.log('folder openned');
  let folderPath = $(this).attr('data-folderpath');
  filePath += folderPath + "\\"

  $('#fileAddressBar').val(filePath);

  getFilesFromPath();
});

function fileUp() {
  let pathArray = filePath.split('\\');
  console.log(pathArray);
  pathArray.pop();
  pathArray.pop();
  pathArray.push('');
  console.log(pathArray);
  let newPath = pathArray.join('\\');

  if (!newPath.includes('D:\\')) {
    displayError('Cannot go up from root directory');
    return
  }

  filePath = newPath;
  $('#fileAddressBar').val(filePath);
  getFilesFromPath();
}
