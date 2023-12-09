from django.shortcuts   import render
from django.http        import HttpResponse
from io                 import BytesIO
import cv2 as cv 
import numpy as np
import tempfile
import os


# Create your views here.

def home(e):
    if e.method == 'POST':
        newVideo = []
        print(e.FILES)
        # logo_cont    = BytesIO(e.FILES['logo'].read())
        # logo    = cv.imdecode(np.frombuffer(logo_cont.read() , dtype=np.uint8),flags=1)
        
        # video_content = e.FILES['video'].file.read()
        # vtemp         = tempfile.NamedTemporaryFile(delete=False , suffix='.mp4')
        # vtemp.write(video_content)
        # vtemp.close()
        # video         = cv.VideoCapture(vtemp.name)
        
        logo    = cv.imread(e.FILES['logo'].file)
        video   = e.FILES['video'].file
        
        print(logo)
        
        logo_height , logo_width , _  = logo.shape 
        logo_position   = (0,0)
        
        while True:
            ret , frame = video.read()
            if not ret:
                break
            
            logo_resized = cv.resize(logo, (int(frame.shape[1] / 8), int(frame.shape[0] / 8)))
            
            print("frame.shape:", frame.shape)
            print("logo_resized.shape:", logo_resized.shape)
            
            roi = frame[logo_position[1]:logo_position[1] + logo_resized.shape[0],
               logo_position[0]:logo_position[0] + logo_resized.shape[1]]
            
            print(logo[:,:,3])
            logo_mask   = logo_resized[:,:,3] / 255.0
            for c in range(0 ,3):
                roi[:,: ,c] = roi[:,:c]*( 1 - logo_mask) + (logo_resized[:,:,c] * logo_mask)
            frame[logo_position[1]:logo_position[1] + logo_resized.shape[0],
          logo_position[0]:logo_position[0] + logo_resized.shape[1]] = roi
            
            newVideo.append(frame)
        video.release()
        
        file    = tempfile.mktemp(suffix='.mp4')
        out = cv.VideoWriter(file, cv.VideoWriter_fourcc(*'mp4v'), 30, (frame.shape[1], frame.shape[0]))
        for frame in newVideo:
            out.write(frame)
        out.release()
        
        with open(file , 'rb') as f:
            res = HttpResponse(f.read(), content_type='video/mp4')
            res['Content-Disposition'] = 'attachment; filename="processed_video.mp4"'
        os.remove(file)
        return res
    return render(e , 'home.html' )