import { useState } from "react";
import { teamLink, teamLinkMailto } from "@/lib/teamToken";
import { cn } from "@/lib/utils";
import { CopyField } from "./ui/Copy";
import { Button } from "./ui/Button";
import { MailIcon, QrIcon } from "./ui/icons";
import { buttonStyles } from "./ui/styles";
import { QrCode } from "./QrCode";

interface TeamLinkPanelProps {
  token: string;
  eventTitle: string;
  memberEmails: string[];
  showQrByDefault?: boolean;
}

export function TeamLinkPanel({ token, eventTitle, memberEmails, showQrByDefault = false }: TeamLinkPanelProps) {
  const [showQr, setShowQr] = useState(showQrByDefault);
  const link = teamLink(token);

  return (
    <div className="space-y-3">
      <CopyField value={link} label="Team link" />
      <div className="flex flex-col gap-2 sm:flex-row">
        <a
          href={teamLinkMailto(link, eventTitle, memberEmails)}
          className={cn(buttonStyles({ variant: "secondary", size: "md" }), "sm:flex-1")}
        >
          <MailIcon />
          Email this link to my team
        </a>
        <Button
          variant="secondary"
          className="sm:flex-1"
          aria-expanded={showQr}
          onClick={() => setShowQr((v) => !v)}
        >
          <QrIcon />
          {showQr ? "Hide QR code" : "Show QR code"}
        </Button>
      </div>
      {showQr && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-5 sm:flex-row sm:items-center sm:gap-5">
          <QrCode value={link} label="QR code of your team link" />
          <p className="text-center text-sm leading-relaxed text-zinc-400 sm:text-left">
            Scan this with a phone camera to open the team page there. Anyone who scans it gets full
            access to your team, so only show it to teammates.
          </p>
        </div>
      )}
    </div>
  );
}
