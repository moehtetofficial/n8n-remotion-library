import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing, Sequence } from 'remotion';
import { gsap } from 'gsap';

// Helper for n8n-like UI elements
const N8nSidebarItem: React.FC<{ label: string; active?: boolean; icon?: string; delay?: number }> = ({ label, active, icon, delay = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = spring({ frame: frame - delay, from: 0, to: 1, fps: 30, config: { damping: 200, stiffness: 1000 } });
  const scale = spring({ frame: frame - delay, from: 0.8, to: 1, fps: 30, config: { damping: 200, stiffness: 1000 } });
  const bgColor = active ? 'rgba(70, 130, 180, 0.3)' : 'transparent'; // SteelBlue for active
  const textColor = active ? 'white' : '#B0B0B0';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 15px',
        margin: '5px 0',
        borderRadius: '5px',
        backgroundColor: bgColor,
        color: textColor,
        fontSize: '18px',
        fontWeight: active ? 'bold' : 'normal',
        opacity,
        transform: `scale(${scale})`,
        transition: 'background-color 0.2s, color 0.2s',
      }}
    >
      {icon && <span style={{ marginRight: '10px' }}>{icon}</span>}
      {label}
    </div>
  );
};

const N8nButton: React.FC<{ label: string; active?: boolean; delay?: number }> = ({ label, active, delay = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = spring({ frame: frame - delay, from: 0, to: 1, fps: 30, config: { damping: 200, stiffness: 1000 } });
  const scale = spring({ frame: frame - delay, from: 0.9, to: 1, fps: 30, config: { damping: 200, stiffness: 1000 } });
  const bgColor = active ? '#5cb85c' : '#4CAF50'; // Green
  const textColor = 'white';

  return (
    <button
      style={{
        padding: '10px 20px',
        borderRadius: '5px',
        backgroundColor: bgColor,
        color: textColor,
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        opacity,
        transform: `scale(${scale})`,
        transition: 'background-color 0.2s',
      }}
    >
      {label}
    </button>
  );
};

const N8nInput: React.FC<{ label: string; value: string; delay?: number }> = ({ label, value, delay = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = spring({ frame: frame - delay, from: 0, to: 1, fps: 30, config: { damping: 200, stiffness: 1000 } });
  const width = interpolate(frame, [delay, delay + 30], [0, 100], { extrapolateRight: 'clamp' }); // Simulate typing

  return (
    <div style={{ marginBottom: '15px', opacity }}>
      <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>{label}</label>
      <div
        style={{
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '10px',
          fontSize: '16px',
          color: '#333',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: `${width}%`, overflow: 'hidden', whiteSpace: 'nowrap' }}>{value}</div>
      </div>
    </div>
  );
};

export default function N8nCredentialsMenu({ scene, durF }: { scene: any; durF: number }) {
  const frame = useCurrentFrame();

  const sidebarWidth = 250;
  const headerHeight = 60;

  // Animation timings (in frames)
  const showSidebarItemsStart = 10;
  const highlightCredentialsStart = 30;
  const clickCredentialsStart = 50;
  const showCredentialsListStart = 70;
  const highlightNewCredentialButtonStart = 90;
  const clickNewCredentialButtonStart = 110;
  const showModalStart = 130;
  const populateInputsStart = 160;
  const highlightSaveButtonStart = 200;

  // Sidebar items animation
  const sidebarItemsOpacity = spring({ frame: frame - showSidebarItemsStart, from: 0, to: 1, fps: 30 });

  // Highlight Credentials item
  const credentialsActive = frame >= highlightCredentialsStart && frame < showCredentialsListStart;

  // Credentials list opacity
  const credentialsListOpacity = spring({ frame: frame - showCredentialsListStart, from: 0, to: 1, fps: 30 });

  // Highlight "New Credential" button
  const newCredentialButtonActive = frame >= highlightNewCredentialButtonStart && frame < clickNewCredentialButtonStart;

  // Modal animation
  const modalProgress = spring({ frame: frame - showModalStart, from: 0, to: 1, fps: 30, config: { damping: 20, stiffness: 100 } });
  const modalY = interpolate(modalProgress, [0, 1], [window.innerHeight, 0], { extrapolateRight: 'clamp' });
  const modalOpacity = interpolate(modalProgress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });

  // Input population animation
  const clientIDValue = frame >= populateInputsStart ? "your-google-client-id-xxxxxxxxxx.apps.googleusercontent.com" : "";
  const clientSecretValue = frame >= populateInputsStart + 30 ? "GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxx" : "";

  // Highlight Save button
  const saveButtonActive = frame >= highlightSaveButtonStart;

  return (
    <AbsoluteFill style={{ backgroundColor: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          width: '90%',
          height: '90%',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            height: headerHeight,
            backgroundColor: '#2c3e50', // Darker blue for header
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            fontSize: '20px',
            fontWeight: 'bold',
            justifyContent: 'space-between',
          }}
        >
          <span>n8n Editor</span>
          <div style={{ display: 'flex', gap: '15px', fontSize: '16px' }}>
            <span>Active</span>
            <span style={{ backgroundColor: '#4CAF50', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>ON</span>
            <button style={{ background: 'none', border: '1px solid white', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Save</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexGrow: 1 }}>
          {/* Sidebar */}
          <div
            style={{
              width: sidebarWidth,
              backgroundColor: '#23303D', // n8n dark sidebar color
              color: '#B0B0B0',
              padding: '20px 0',
              flexShrink: 0,
              opacity: sidebarItemsOpacity,
            }}
          >
            <div style={{ padding: '0 15px' }}>
              <N8nSidebarItem label="Workflows" icon="⚙️" delay={showSidebarItemsStart + 10} />
              <N8nSidebarItem label="Credentials" icon="🔑" active={credentialsActive} delay={showSidebarItemsStart + 20} />
              <N8nSidebarItem label="Executions" icon="🚀" delay={showSidebarItemsStart + 30} />
              <N8nSidebarItem label="Settings" icon="🛠️" delay={showSidebarItemsStart + 40} />
            </div>
          </div>

          {/* Main Content Area */}
          <div style={{ flexGrow: 1, padding: '20px', position: 'relative' }}>
            {/* Initial Workflow Canvas Placeholder */}
            {frame < showCredentialsListStart && (
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#f8f9fa',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '30px',
                color: '#ccc',
                opacity: interpolate(frame, [clickCredentialsStart - 10, clickCredentialsStart + 10], [1, 0], { extrapolateLeft: 'clamp' }),
                transition: 'opacity 0.3s',
              }}>
                Workflow Canvas
              </div>
            )}

            {/* Credentials List View */}
            {frame >= clickCredentialsStart && (
              <div style={{ opacity: credentialsListOpacity }}>
                <h2 style={{ color: '#333', marginBottom: '20px' }}>Credentials</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <N8nButton label="New Credential" active={newCredentialButtonActive} delay={showCredentialsListStart + 10} />
                  <input
                    type="text"
                    placeholder="Search credentials..."
                    style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}
                  />
                </div>
                {/* Example Credential List */}
                <div style={{ border: '1px solid #eee', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', padding: '10px 15px', backgroundColor: '#f5f5f5', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
                    <div style={{ flex: 2 }}>Name</div>
                    <div style={{ flex: 1 }}>Type</div>
                    <div style={{ flex: 1 }}>Actions</div>
                  </div>
                  <div style={{ display: 'flex', padding: '10px 15px', borderBottom: '1px solid #eee' }}>
                    <div style={{ flex: 2 }}>Google OAuth (My Project)</div>
                    <div style={{ flex: 1 }}>OAuth2 API</div>
                    <div style={{ flex: 1 }}>Edit | Delete</div>
                  </div>
                  <div style={{ display: 'flex', padding: '10px 15px' }}>
                    <div style={{ flex: 2 }}>Stripe API Key</div>
                    <div style={{ flex: 1 }}>API Key</div>
                    <div style={{ flex: 1 }}>Edit | Delete</div>
                  </div>
                </div>
              </div>
            )}

            {/* Credential Modal/Panel */}
            {frame >= showModalStart && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) translateY(${modalY}px)`,
                  width: '600px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                  padding: '30px',
                  zIndex: 10,
                  opacity: modalOpacity,
                  transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                }}
              >
                <h3 style={{ color: '#333', marginBottom: '25px', fontSize: '24px' }}>Create/Edit Credential</h3>
                <N8nInput label="Credential Name" value="Google OAuth for GCP" delay={populateInputsStart} />
                <N8nInput label="Credential Type" value="Google OAuth2 API" delay={populateInputsStart + 15} />
                <N8nInput label="Client ID" value={clientIDValue} delay={populateInputsStart + 30} />
                <N8nInput label="Client Secret" value={clientSecretValue} delay={populateInputsStart + 45} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                  <button
                    style={{
                      padding: '12px 25px',
                      borderRadius: '5px',
                      backgroundColor: saveButtonActive ? '#007bff' : '#6c757d', // Blue for active, grey for inactive
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    Save
                  </button>
                  <button
                    style={{
                      padding: '12px 25px',
                      borderRadius: '5px',
                      backgroundColor: '#f8f9fa',
                      color: '#333',
                      border: '1px solid #ccc',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginLeft: '15px',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}