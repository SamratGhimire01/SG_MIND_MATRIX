import subprocess
PRE,POST=.08,.14
# (source start, source end, target start, tempo, label)
P=[(1.59,2.67,0.05,1,'L01'),(3.57,4.74,6.9,1,'L02'),(5.15,5.74,8.7,1,'L03'),(6.27,6.97,10.8,1,'L04'),(8.40,9.37,15.8,1,'L05'),(9.99,11.15,19.3,1,'L06'),
   (11.79,12.67,24.6,1,'L07'),(13.13,15.03,28.0,1,'L08'),(15.95,17.94,31.0,1,'L09'),(18.42,20.05,33.8,1,'L10'),(20.77,22.01,36.0,1,'L11a'),(22.48,22.81,37.71,1,'L11b'),
   (23.50,23.94,39.45,1.1,'L12a'),(24.59,26.33,40.04,1.1,'L12b'),(26.77,28.61,41.70,1.1,'L13'),(29.14,30.65,44.5,1.08,'L14')]
ins=[];flt=[];
for i,(a,b,t,tp,l) in enumerate(P):
  a0=a-PRE;b0=b+POST;d=b0-a0
  f=f"[0:a]atrim={a0:.3f}:{b0:.3f},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.03,afade=t=out:st={d-0.09:.3f}:d=0.09"
  if tp!=1: f+=f",atempo={tp}"
  delay=max(0,(t-PRE/tp)*1000)
  f+=f",adelay={delay:.0f}|{delay:.0f}[s{i}]";flt.append(f)
  print(f"{l}: src {a:.2f}-{b:.2f} -> {t:.2f}-{t+(b-a)/tp:.2f}  (x{tp})")
flt.append("".join(f"[s{i}]" for i in range(len(P)))+f"amix=inputs={len(P)}:normalize=0,apad=whole_dur=46,atrim=0:46[v]")
subprocess.run(['ffmpeg','-v','error','-y','-i','raw.wav','-filter_complex',";".join(flt),'-map','[v]','-ar','48000','-ac','1','vo_placed.wav'],check=True)
