from django.shortcuts import render
from django.http import HttpResponse
from io import BytesIO
import cv2 as cv
import numpy as np
import tempfile
import os

def home(request):
    if request.method == 'POST':
        print(request.FILES)
        newVideo = []
        TEMP_FRAME_SHAPE = None
        # Replace the original line with the following two lines
        logo_data = request.FILES['logo'].file.read()
        logo = cv.imdecode(np.frombuffer(logo_data, np.uint8), cv.IMREAD_UNCHANGED)
        video_content = request.FILES['video'].file.read()
        vtemp = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
        vtemp.write(video_content)
        vtemp.close()
        video = cv.VideoCapture(vtemp.name)

        logo_height, logo_width, _ = logo.shape
        logo_position = (15, 10)

        while True:
            ret, frame = video.read()
            if not ret:
                break
            TEMP_FRAME_SHAPE =frame.shape
            logo_resized = cv.resize(logo, (int(frame.shape[1] / 8), int(frame.shape[0] / 8)))


            roi = frame[logo_position[1]:logo_position[1] + logo_resized.shape[0],
                      logo_position[0]:logo_position[0] + logo_resized.shape[1]]

            logo_mask = logo_resized[:, :, 3] / 255.0
            for c in range(0, 3):
                roi[:, :, c] = roi[:, :, c] * (1 - logo_mask) + (logo_resized[:, :, c] * logo_mask)
            frame[logo_position[1]:logo_position[1] + logo_resized.shape[0],
            logo_position[0]:logo_position[0] + logo_resized.shape[1]] = roi

            newVideo.append(frame)

        video.release()

        file = tempfile.mktemp(suffix='.mp4')
        print(file , "HOME FILE")
        out = cv.VideoWriter(file, cv.VideoWriter_fourcc(*'mp4v'), 30, (TEMP_FRAME_SHAPE[1], TEMP_FRAME_SHAPE[0]))

        for frame in newVideo:
            if frame is not None:  # Add this check
                out.write(frame)

        out.release()  # Move this line outside of the loop

        with open(file, 'rb') as f:
            response = HttpResponse(f.read(), content_type='video/mp4')
            response['Content-Disposition'] = 'attachment; filename="processed_video.mp4"'
        os.remove(file)
        return response

    return render(request, 'home.html')
