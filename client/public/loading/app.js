function App() {
  try {
    const logoUrl =
      "https://app.trickle.so/storage/public/images/anonymous/5ff33b9c-a4fe-4418-afb9-1d0fc52beae9.png";

    const depthLayers = 8;

    return (
      <>
        <style>
          {`
            @keyframes monolithicRotate {
              0% {
                transform: rotateY(-10deg) rotateX(1deg);
              }

              50% {
                transform: rotateY(10deg) rotateX(-1deg);
              }

              100% {
                transform: rotateY(-10deg) rotateX(1deg);
              }
            }

            @keyframes floatLogo {
              0%,100% {
                transform: translateY(0px);
              }

              50% {
                transform: translateY(-6px);
              }
            }

            @keyframes shine {
              0% {
                transform: translateX(-200%);
                opacity: 0;
              }

              20% {
                opacity: 0.2;
              }

              50% {
                opacity: 0.45;
              }

              80% {
                opacity: 0.2;
              }

              100% {
                transform: translateX(200%);
                opacity: 0;
              }
            }

            .logo-wrapper {
              animation: floatLogo 6s ease-in-out infinite;
            }

            .logo-3d {
              animation: monolithicRotate 12s ease-in-out infinite;
              transform-style: preserve-3d;
              will-change: transform;
            }

            .animate-shine {
              background: linear-gradient(
                105deg,
                transparent 42%,
                rgba(255,255,255,0.2) 50%,
                transparent 58%
              );

              animation: shine 6s ease-in-out infinite;
            }
          `}
        </style>

        <div
          className="w-screen h-screen flex items-center justify-center bg-black relative overflow-hidden"
          style={{
            perspective: "2000px",
            perspectiveOrigin: "50% 50%"
          }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, transparent 65%)"
            }}
          />

          <div className="logo-wrapper">
            <div className="relative w-[35%] max-w-lg aspect-square logo-3d flex items-center justify-center">
              {[...Array(depthLayers)].map((_, index) => {
                const zPosition = -index * 0.55;

                const progress = index / (depthLayers - 1);

                const brightness =
                  index === 0
                    ? 0.9
                    : 0.85 - progress * 0.5;

                const opacity =
                  index === 0
                    ? 1
                    : 1 - progress * 0.25;

                // Front face
                if (index === 0) {
                  return (
                    <div
                      key={index}
                      className="absolute inset-0"
                      style={{
                        transform: `translateZ(${zPosition}px)`
                      }}
                    >
                      <img
                        src={logoUrl}
                        alt="WIECODES"
                        className="w-full h-full object-contain"
                        style={{
                          filter:
                            "grayscale(1) contrast(1.25) brightness(0.9)",
                          filter:
                            "grayscale(1) contrast(1.25) brightness(0.9)",
                          WebkitFilter:
                            "grayscale(1) contrast(1.25) brightness(0.9)",
                          dropShadow:
                            "0 0 30px rgba(255,255,255,0.08)"
                        }}
                      />

                      <div
                        className="absolute inset-0 animate-shine mix-blend-screen pointer-events-none"
                        style={{
                          WebkitMaskImage: `url(${logoUrl})`,
                          WebkitMaskSize: "contain",
                          WebkitMaskRepeat: "no-repeat",
                          WebkitMaskPosition: "center",

                          maskImage: `url(${logoUrl})`,
                          maskSize: "contain",
                          maskRepeat: "no-repeat",
                          maskPosition: "center"
                        }}
                      />
                    </div>
                  );
                }

                return (
                  <img
                    key={index}
                    src={logoUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{
                      transform: `translateZ(${zPosition}px)`,
                      filter: `grayscale(1) contrast(1.25) brightness(${brightness})`,
                      opacity
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("App component error:", error);
    return null;
  }
}
