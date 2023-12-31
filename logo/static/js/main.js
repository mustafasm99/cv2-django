let logo_input      = document.getElementById('logoInput')
let video           = document.getElementById('videoInput')
let staging         = document.getElementById('staging')
let marge           = document.getElementById('Marge')
var isResizing      = false
let video_counter   = 0
var initialX, initialY, initialWidth, initialHeight , offsetX , offsetY;
var video_obj , logo_obj;


marge.addEventListener('click' , function(e){
    // set the files from the inputs 

    logo_image_file         = logo_input.files[0]
    logo_url                = URL.createObjectURL(logo_image_file)

    // creaet the urls 

    video_file              = video.files[0]
    vidoe_url               = URL.createObjectURL(video_file)
    console.log(video_file , vidoe_url);

    // create the elements 
    logo_element            = document.createElement('img')
    video_element           = document.createElement('video')
    source_element          = document.createElement('source')

    // set the globel vars
    logo_obj                = logo_element
    video_obj               = video_element

    // seting the url
    video_element.controls  = true; // Add controls to the video element 
    logo_element.src        = logo_url
    source_element.src      = vidoe_url
    source_element.type     = "video/mp4"
    video_element.appendChild(source_element)

    // apend the video and the logo 
    staging.appendChild(logo_element)
    staging.appendChild(video_element)

    // conf the logo and the video 
    
    video_position              = video_element.getBoundingClientRect()
    logo_element.style          = `position: absolute;left:${video_position.top}px; top:${video_position.top}px;z-index:99;`
    logo_element.draggable      = true
    logo_element.addEventListener("mousedown", startDrag);
    logo_element.addEventListener("mouseup", stopDrag);
    // logo_element.addEventListener("click", toggleResize);

})

function dragLogo(e) {
    if (!isResizing) {
      // Calculate the new position of the logo
      var x = e.clientX - offsetX;
      var y = e.clientY - offsetY;

      // Restrict the position within the video edges
      var maxX = video_obj.offsetWidth - logo_obj.offsetWidth;
      var maxY = video_obj.offsetHeight - logo_obj.offsetHeight;
      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));

      // Set the new position of the logo
      logo_obj.style.left = x + "px";
      logo_obj.style.top = y + "px";

        // Update the position display
        //   console.log("Position: x=" + x + "px, y=" + y + "px");
        //   console.log(logo_obj.parentElement.querySelectorAll('input'));
        // set the values 
      logo_obj.parentElement.querySelector('input[name = "pos-x"]').value = x
      logo_obj.parentElement.querySelector('input[name = "pos-y"]').value = y

      console.log(logo_obj.parentElement.querySelector('input[name = "pos-y"]').value , logo_obj.parentElement.querySelector('input[name = "pos-x"]').value);
      
      document.getElementById('staging').style = `
      width: fit-content;
      height: fit-content;
      `
    }
  }



function startDrag(e) {
    if (!isResizing) {
      // Store the initial position of the logo
      initialX = logo_obj.offsetLeft;
      initialY = logo_obj.offsetTop;

      // Calculate the mouse offset
      offsetX = e.clientX - initialX;
      offsetY = e.clientY - initialY;

      // Add event listeners for dragging
      document.addEventListener("mousemove", dragLogo);
    }
  }

  function stopDrag() {
    // Remove the event listeners for dragging
    document.removeEventListener("mousemove", dragLogo);
  }