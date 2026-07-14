import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, spring, Easing } from 'remotion';

const Icon = ({ name, size = 60, color = 'white', style = {} }) => {
  const iconMap = {
    n8n: 'N8N',
    sheet: '📊',
    mail: '📧',
    drive: '☁️',
    lock: '🔒'
  };
  return (
    <div style={{ fontSize: size, color, ...style }}>
      {iconMap[name] || name}
    </div>
  );
};

export default function N8nGoogleSecureConnect({ scene, durF }: { scene: any; durF: number }) {
  const frame = useCurrentFrame();

  const n8nScale = spring({
    frame,
    fps: 30,
    config: { damping: 200, stiffness: 100 },
    from: 0.8,
    to: 1,
    durationInFrames: 30
  });

  const serviceEnterDelay = 15; // frames delay for each service
  const lineDrawDuration = 45; // frames to draw the line
  const lockAppearDelay = 30; // frames after line draw

  const services = [
    { label: "Google Sheets", icon: "sheet", x: 20, y: 30 },
    { label: "Gmail", icon: "mail", x: 80, y: 30 },
    { label: "Google Drive", icon: "drive", x: 50, y: 70 }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bg || '#0b1018', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: '80%', height: '80%' }}>
        {/* N8N Center */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${n8nScale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2
        }}>
          <Icon name="n8n" size={120} color="#663399" />
          <div style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginTop: 10 }}>n8n</div>
          <div style={{ fontSize: 24, color: '#aaa', marginTop: 5 }}>Automation Platform</div>
        </div>

        {/* Services and Lines */}
        {services.map((service, index) => {
          const serviceDelay = serviceEnterDelay * index;
          const serviceOpacity = interpolate(
            frame - serviceDelay,
            [0, 30],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          const serviceScale = spring({
            frame: frame - serviceDelay,
            fps: 30,
            config: { damping: 200, stiffness: 100 },
            from: 0.5,
            to: 1,
            durationInFrames: 30
          });

          const lineProgress = interpolate(
            frame - serviceDelay,
            [0, lineDrawDuration],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          const lockOpacity = interpolate(
            frame - serviceDelay - lineDrawDuration - lockAppearDelay,
            [0, 30],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          const lockScale = spring({
            frame: frame - serviceDelay - lineDrawDuration - lockAppearDelay,
            fps: 30,
            config: { damping: 200, stiffness: 100 },
            from: 0.5,
            to: 1,
            durationInFrames: 30
          });

          const n8nCenterX = 50; // percentage
          const n8nCenterY = 50; // percentage
          const serviceX = service.x;
          const serviceY = service.y;

          return (
            <React.Fragment key={service.label}>
              {/* Service Icon */}
              <div style={{
                position: 'absolute',
                left: `${serviceX}%`,
                top: `${serviceY}%`,
                transform: `translate(-50%, -50%) scale(${serviceScale})`,
                opacity: serviceOpacity,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 1
              }}>
                <Icon name={service.icon} size={80} color="#4285F4" />
                <div style={{ fontSize: 24, color: 'white', marginTop: 5 }}>{service.label}</div>
              </div>

              {/* Line connecting n8n to service */}
              <svg
                style={{
                  position: 'absolute',
                  left: 0, top: 0, width: '100%', height: '100%',
                  overflow: 'visible', zIndex: 0
                }}
              >
                <line
                  x1={`${n8nCenterX}%`} y1={`${n8nCenterY}%`}
                  x2={`${serviceX}%`} y2={`${serviceY}%`}
                  stroke="#663399"
                  strokeWidth="4"
                  strokeDasharray="1000"
                  strokeDashoffset={interpolate(lineProgress, [0, 1], [1000, 0], {extrapolateLeft: 'clamp'})}
                  style={{ transition: 'stroke-dashoffset 0.5s linear' }}
                />
              </svg>

              {/* Lock Icon on the line */}
              <div style={{
                position: 'absolute',
                left: `${n8nCenterX + (serviceX - n8nCenterX) * 0.5}%`,
                top: `${n8nCenterY + (serviceY - n8nCenterY) * 0.5}%`,
                transform: `translate(-50%, -50%) scale(${lockScale})`,
                opacity: lockOpacity,
                zIndex: 3
              }}>
                <Icon name="lock" size={40} color="#00C853" />
              </div>
            </React.Fragment>
          );
        })}
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 48,
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          opacity: interpolate(frame, [durF - 60, durF - 30], [0, 1], { extrapolateLeft: 'clamp' })
        }}>
          ဘေးကင်း လုံခြုံ တဲ့ ချိတ်ဆက်မှု
        </div>
      </div>
    </AbsoluteFill>
  );
}