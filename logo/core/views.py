from django.shortcuts   import render
from django.http        import HttpResponse
from moviepy.editor     import VideoFileClip , AudioFileClip
from logo.settings      import BASE_DIR
import cv2 as cv
import numpy as np
import tempfile
import os

def extract_audio(video_obj):
    video       = VideoFileClip(video_obj)
    audio       = video.audio
    output_file = BASE_DIR/"file.mp3"   
    audio.write_audiofile(str(output_file))
    return str(output_file)


def home(request):
    if request.method == 'POST':
        print(request.FILES , request.POST)
        newVideo                = []
        TEMP_FRAME_SHAPE        = None
        # Replace the original line with the following two lines
        logo_data               = request.FILES['logo'].file.read()
        logo                    = cv.imdecode(np.frombuffer(logo_data, np.uint8), cv.IMREAD_UNCHANGED)
        video_content           = request.FILES['video'].file.read()
        vtemp                   = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
        vtemp.write(video_content)
        vtemp.close()
        video                   = cv.VideoCapture(vtemp.name)
        audio_to_mix            = AudioFileClip(extract_audio(f"{vtemp.name}"))
        
        data                    = {
            "x"         : int(request.POST.get('pos-x')),
            "y"         : int(request.POST.get('pos-y')),
            "width"     : int(request.POST.get('width')),
            "height"    : int(request.POST.get('height'))
        }
        
        logo_position           = (data['x'], data['y'])
        print(logo_position)
        while True:
            ret, frame          = video.read()
            if not ret:
                break
            TEMP_FRAME_SHAPE    = frame.shape
            logo_resized        = cv.resize(logo, (int(frame.shape[1] / 8), int(frame.shape[0] / 8)))
            roi                 = frame[logo_position[1]:logo_position[1] + logo_resized.shape[0],
                                logo_position[0]:logo_position[0] + logo_resized.shape[1]]
            logo_mask           = logo_resized[:, :, 3] / 255.0
            for c in range(0, 3):
                roi[:, :, c] = roi[:, :, c] * (1 - logo_mask) + (logo_resized[:, :, c] * logo_mask)
            frame[logo_position[1]:logo_position[1] + logo_resized.shape[0],
            logo_position[0]:logo_position[0] + logo_resized.shape[1]] = roi

            newVideo.append(frame)

        video.release()

        file = tempfile.mktemp(suffix='.mp4')
        out = cv.VideoWriter(file, cv.VideoWriter_fourcc(*'mp4v'), 30, (TEMP_FRAME_SHAPE[1], TEMP_FRAME_SHAPE[0]))

        for frame in newVideo: 
            if frame is not None:  # Add this check
                out.write(frame)

        out.release()  # Move this line outside of the loop

        print(file)
        Video_To_mix        = VideoFileClip(file).set_audio(audio_to_mix)
        Video_To_mix.write_videofile(str(BASE_DIR/'Temp'/'videoTemp.mp4') , codec='libx264', audio_codec='aac')
        with open(str(BASE_DIR/'Temp'/'videoTemp.mp4'), 'rb') as f:
            response = HttpResponse(f.read(), content_type='video/mp4')
            response['Content-Disposition'] = 'attachment; filename="processed_video.mp4"'
        os.remove(file)
        return response

    return render(request, 'home.html')
