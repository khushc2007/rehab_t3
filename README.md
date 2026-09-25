# RehabGrip — Live Session
**Local:** `npm i && npm run dev` → http://localhost:3000. With no `NEXT_PUBLIC_WS_URL` it starts in SIM mode (auto-cycling hand, no backend).
**Live:** copy `.env.local.example` to `.env.local`, set `NEXT_PUBLIC_WS_URL`, restart. The app then connects (backoff 1s→30s, 10 tries). Frame: `{t,f:[idx,mid,ring,pinky,thumb],e,ax,ay,az,gx,gy,gz,bat}`, gyro in °/s, sensor Y-up. Press `R` to zero yaw (no magnetometer, yaw drifts).
**Simulation:** click the near-invisible ⌥ at bottom-left. Toggle SIM MODE, drag sliders, pick presets, AUTO CYCLE, NOISE + ADD NOISE. SPEED = smoothing factor per 60fps frame (default .11).
**Rep rules:** rep = mean of 4 fingers >15° then <10°; correct peak 65–85°, partial 30–65° or >85°, missed <30°.
**Vercel:** push to Git, import in Vercel, add `NEXT_PUBLIC_WS_URL` (use `wss://`), deploy.
