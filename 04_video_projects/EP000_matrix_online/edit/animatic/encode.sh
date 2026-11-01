set -e
S=/tmp/claude-0/-home-user-SG-MIND-MATRIX/9d454135-dd67-5327-bbbe-99a8ba935677/scratchpad
OUT=/home/user/SG_MIND_MATRIX/04_video_projects/EP000_matrix_online/export/SGMM_EP000_animatic_v002_1080x1920_60fps.mp4
ffmpeg -y -loglevel error -framerate 60 -i $S/frames/f%05d.jpg -i $S/score_norm.wav \
  -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -profile:v high -level 4.2 -r 60 \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart -t 46 "$OUT"
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt,nb_frames,sample_rate,channels -show_entries format=duration,size -of compact "$OUT"
