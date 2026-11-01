import numpy as np, wave, sys
def rd(p):
  w=wave.open(p);c=w.getnchannels();sr=w.getframerate();a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float64)/32768
  return (a.reshape(-1,c) if c>1 else np.repeat(a[:,None],2,1)),sr
v,sr=rd('vo_final2.wav');b,_=rd('bg_raw.wav');be,_=rd('bg_eq.wav');n=min(len(v),len(b),len(be));v,b,be=v[:n],b[:n],be[:n]
W=[(0.05,1.13),(6.9,8.07),(8.7,9.29),(10.8,11.5),(15.8,16.77),(19.3,20.46),(24.6,25.48),(28.0,29.9),(31.0,32.99),(33.8,35.43),(36.0,37.24),(37.71,38.04),(39.45,39.85),(40.04,41.62),(41.7,43.37),(44.5,45.9)]
TARGET=15.0;PRE,POST,RAMP=.12,.10,.08
db=lambda x:10*np.log10(np.mean(x**2)+1e-12)
g=np.ones(n);k=np.zeros(n)
for a,e in W:
  i0,i1=int(a*sr),int(e*sr);dv=db(v[i0:i1]);dbg=db(be[i0:i1]);need=min(18,max(4,TARGET-(dv-dbg)));lin=10**(-need/20)
  s0,s1=max(0,int((a-PRE)*sr)),int((e+POST)*sr);r=int(RAMP*sr)
  env=np.ones(n);env[s0:s1]=lin
  env[max(0,s0-r):s0]=np.linspace(1,lin,s0-max(0,s0-r));env[s1:s1+r]=np.linspace(lin,1,min(r,n-s1))
  g=np.minimum(g,env);kk=np.zeros(n);kk[s0:s1]=1;kk[max(0,s0-r):s0]=np.linspace(0,1,s0-max(0,s0-r));kk[s1:s1+r]=np.linspace(1,0,min(r,n-s1));k=np.maximum(k,kk)
  print(f"{a:5.2f}: voice over bg was {dv-dbg:+5.1f} dB -> background down {need:4.1f} dB -> now {dv-dbg+need:+5.1f} dB")
bg=(b*(1-k[:,None])+be*k[:,None])*g[:,None]
mix=v*1.0+bg
pk=np.max(np.abs(mix));print('peak',pk)
def wr(p,x):
  x=np.clip(x,-1,1);w=wave.open(p,'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((x*32767).astype(np.int16).tobytes());w.close()
wr('mix_raw2.wav',mix*(0.95/pk if pk>0.95 else 1));wr('bg_auto.wav',bg)
