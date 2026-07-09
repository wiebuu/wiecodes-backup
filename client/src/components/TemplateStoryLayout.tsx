import React, { forwardRef, CSSProperties, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface TemplateStoryLayoutProps {
  template: any;
  style?: CSSProperties;
  showDownload?: boolean; // new prop to show download button
}

const TemplateStoryLayout = forwardRef<HTMLDivElement, TemplateStoryLayoutProps>(
  ({ template, style, showDownload = false }, ref) => {
    const [mediaLoaded, setMediaLoaded] = useState(false);

    useEffect(() => {
      if (!template?.previewImageUrl) {
        setMediaLoaded(true);
        return;
      }

      const img = new Image();
      img.src = template.previewImageUrl;
      img.onload = () => setMediaLoaded(true);
      img.onerror = () => setMediaLoaded(true);
    }, [template?.previewImageUrl]);

    if (!template) return null;

    const uploaderName = template.uploadedBy?.username || "Unknown";

    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "360px",
          height: "640px",
          backgroundColor: "#000",
          pointerEvents: "none",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
      >
        {/* Background Video */}
        <video
          muted
          autoPlay
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(30%)",
            zIndex: 0,
          }}
          onCanPlayThrough={() => setMediaLoaded(true)}
        >
          <source src="/WIE-back.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Template Card */}
        {mediaLoaded && (
          <div
            className="relative z-10 flex flex-col items-center justify-center w-[320px] p-5"
            style={{
              backgroundColor: "rgba(0,0,0,0.75)", // dark but slightly transparent
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              pointerEvents: "auto",
            }}
          >
            {template.previewImageUrl && (
              <img
                src={template.previewImageUrl}
                alt={template.title}
                className="w-full h-[180px] object-cover rounded-md mb-4"
                style={{ boxShadow: "none" }}
              />
            )}

            <h2 className="text-2xl font-semibold text-center text-white">
              {template.title}
            </h2>

            <p className="text-md mt-1 text-center text-gray-300">
              {template.framework || "—"} • {template.theme || "—"} • {template.platform || "—"}
            </p>

            <p className="text-sm mt-2 text-gray-400 text-center">
              Uploaded by: {uploaderName}
            </p>
          </div>
        )}

        {/* Download Button */}
        {showDownload && mediaLoaded && (
          <a
            href="/WIE-back.mp4"
            download={`template-story-${template._id}.mp4`}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Download Video
          </a>
        )}
      </div>
    );
  }
);

export default TemplateStoryLayout;
