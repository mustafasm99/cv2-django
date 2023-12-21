// document.addEventListener("DOMContentLoaded", function() {
//     // Get the video element
//     var video = document.getElementById("video");
  
//     // Get the logo element
//     var logo = document.getElementById("logo");
  
//     // Get the position display element
//     var positionDisplay = document.getElementById("position-display");
  
//     // Variables to store the initial position and size of the logo
//     var initialX, initialY, initialWidth, initialHeight;
  
//     // Variables to store the mouse offset during dragging and resizing
//     var offsetX, offsetY;
  
//     // Flag to indicate whether the logo is being resized
//     var isResizing = false;
  
//     // Add event listeners for the logo
//     logo.addEventListener("mousedown", startDrag);
//     logo.addEventListener("mouseup", stopDrag);
//     logo.addEventListener("click", toggleResize);
  
//     // Function to handle the start of dragging
//     function startDrag(e) {
//       if (!isResizing) {
//         // Store the initial position of the logo
//         initialX = logo.offsetLeft;
//         initialY = logo.offsetTop;
  
//         // Calculate the mouse offset
//         offsetX = e.clientX - initialX;
//         offsetY = e.clientY - initialY;

//         // Add event listeners for dragging
//         document.addEventListener("mousemove", dragLogo);
//       }
//     }
  
//     // Function to handle dragging
//     function dragLogo(e) {
//       if (!isResizing) {
//         // Calculate the new position of the logo
//         var x = e.clientX - offsetX;
//         var y = e.clientY - offsetY;
  
//         // Restrict the position within the video edges
//         var maxX = video.offsetWidth - logo.offsetWidth;
//         var maxY = video.offsetHeight - logo.offsetHeight;
//         x = Math.max(0, Math.min(x, maxX));
//         y = Math.max(0, Math.min(y, maxY));
  
//         // Set the new position of the logo
//         logo.style.left = x + "px";
//         logo.style.top = y + "px";
  
//         // Update the position display
//         positionDisplay.textContent = "Position: x=" + x + "px, y=" + y + "px";
//       }
//     }
  
//     // Function to handle the end of dragging
//     function stopDrag() {
//       // Remove the event listeners for dragging
//       document.removeEventListener("mousemove", dragLogo);
//     }
  
//     // Function to toggle the resize functionality
//     function toggleResize() {
//       if (!isResizing) {
//         // Store the initial size of the logo
//         initialWidth = logo.offsetWidth;
//         initialHeight = logo.offsetHeight;
//       }
  
//       // Toggle the resize flag
//       isResizing = !isResizing;
  
//       // Update the cursor style based on the resize flag
//       logo.style.cursor = isResizing ? "nwse-resize" : "move";
  
//       // Add or remove event listeners for resizing
//       if (isResizing) {
//         document.addEventListener("mousemove", resizeLogo);
//       } else {
//         document.removeEventListener("mousemove", resizeLogo);
//       }
//     }
  
//     // Function to handle resizing
//     function resizeLogo(e) {
//       // Calculate the new size of the logo based on the mouse position
//       var width = e.clientX - logo.offsetLeft;
//       var height = e.clientY - logo.offsetTop;
  

//       // Set the new size of the logo
//       logo.style.width = width + "px";
//       logo.style.height = height + "px";
  
//       // Update the position display
//       positionDisplay.textContent = "Size: width=" + width + "px, height=" + height + "px";
//     }

//     let logo_input      = this
//     console.log(this)

//   });
//   videoInput=document.getElementById("videoInput");
//   videoInput.src ='';
//   videoInput.controls=true;
//   videoInput.autoplay=true;
  
let logo_input      = document.getElementById('logoInput')
let video           = document.getElementById('videoInput')
let staging         = document.getElementById('staging')


logo_input.addEventListener('change' , function(event){
    image        = event.target.files[0]
    imgae_url    = URL.createObjectURL(image)
    staging.querySelector('img').src = imgae_url
})

videoInput.addEventListener('change' , function(event){
    video        = event.target.files[0]
    video_url    = URL.createObjectURL(video)
    staging.querySelector('video').src = video_url
})

// Background Script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Handle the message
    sendResponse({ received: true });
});

// Content Script
chrome.runtime.sendMessage({ data: "Hello from content script" }, function(response) {
    console.log(response);
});