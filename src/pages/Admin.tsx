import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Admin() {
  // redirect logic එක අයින් කරලා තියෙන්නේ.
  // ඕනෑම කෙනෙකුට කෙලින්ම iframe එක පේනවා.
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ඔයාට Dashboard එක උඩින් පොඩි හෙඩර් එකක් ඕනේ නම් මේක තියාගන්න, නැත්නම් අයින් කරන්න */}
      <div className="p-4 border-b border-primary/10 bg-card flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">Admin Control Panel</h1>
        <p className="text-xs text-muted-foreground italic">Connected to Vital Leaf Network</p>
      </div>

      <div className="flex-1 w-full overflow-hidden">
        <iframe
          src="https://vital-leaf-network.lovable.app/admin-login"
          title="Admin Dashboard"
          className="w-full h-[calc(100vh-65px)] border-none"
          allow="fullscreen; camera; microphone; geolocation"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
        />
      </div>
    </div>
  );
}
