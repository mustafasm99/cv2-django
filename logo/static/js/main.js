let logo_input      = document.getElementById('logoInput')
let video           = document.getElementById('videoInput')
let staging         = document.getElementById('staging')
let video_counter   = 0

logo_input.addEventListener('change' , function(event){
    image        = event.target.files[0]
    imgae_url    = URL.createObjectURL(image)
    staging.querySelector('img').src = imgae_url
})

videoInput.addEventListener('change' , function(event){
    
    const video             = event.target.files[0];
    const video_url         = URL.createObjectURL(video);

    // Create a new video element
    const newVideo          = document.createElement('video');
    newVideo.controls       = true; // Add controls to the video element

    // Create a new source element
    const source            = document.createElement('source');
    source.src              = video_url;
    source.type             = 'video/mp4'; // Set the appropriate MIME type for your video

    // Append the source elemen t to the video element
    newVideo.appendChild(source);
    newVideo.style          = "display:block;"
    const staging           = document.getElementById('staging'); // Change 'staging' to the ID of your container
    newVideo.id             = "video"+(video_counter+1)
    staging.appendChild(newVideo);

    
})