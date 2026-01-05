"use client";

import React, { useState } from "react";
import DrawingCanvas from "@/components/draw/DrawingCanvas";
import CommunityGallery from "@/components/draw/CommunityGallery";

export default function DrawPage() {
  const [activeTab, setActiveTab] = useState<"create" | "gallery">("create");

  return (
<div className="w-full bg-background">
  {/* Tabs */}
  <div className="w-full mt-24">
    <div className="flex justify-center">
      <div className="flex gap-12 border-b border-foreground/20">
        <button
          onClick={() => setActiveTab("create")}
          className={`pb-3 px-8 text-sm tracking-wide transition-all cursor-pointer
            ${
              activeTab === "create"
                ? "text-foreground border-b-2 border-foreground"
                : "text-foreground/50 hover:text-foreground"
            }`}
        >
          CREATE DRAWING
        </button>

        <button
          onClick={() => setActiveTab("gallery")}
          className={`pb-3 px-8 text-sm tracking-wide transition-all cursor-pointer
            ${
              activeTab === "gallery"
                ? "text-foreground border-b-2 border-foreground"
                : "text-foreground/50 hover:text-foreground"
            }`}
        >
          COMMUNITY GALLERY
        </button>
      </div>
    </div>
  </div>

  {/* Tab Content */}
  <div className="w-full mt-10">
    {activeTab === "create" ? (
      <DrawingCanvas onSave={() => setActiveTab("gallery")} />
    ) : (
      <CommunityGallery />
    )}
  </div>
</div>

  );
}
