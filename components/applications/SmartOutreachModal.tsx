"use client";

import { useState } from "react";
import { ApplicationItem } from "@/lib/constants/defaults";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Check, Mail, ExternalLink, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";

interface SmartOutreachModalProps {
  application: ApplicationItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
}

export function SmartOutreachModal({
  application,
  open,
  onOpenChange,
  userName = "Applicant",
}: SmartOutreachModalProps) {
  const [recipientName, setRecipientName] = useState("");
  const [recipientRole, setRecipientRole] = useState("Hiring Manager");
  const [keySkill, setKeySkill] = useState("building high-performance full-stack systems");
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!application) return null;

  const company = application.company_name;
  const role = application.role_title;
  const targetName = recipientName.trim() || "Hiring Team";

  // Template 1: Cold Hiring Manager DM
  const coldInmail = {
    subject: `Application: ${role} — ${userName}`,
    body: `Hi ${targetName},

I noticed ${company} is currently looking for a ${role}, and I recently submitted my application through your careers portal.

With a strong track record in ${keySkill}, I’ve been following ${company}'s work and would love to bring my experience to the team.

I’d welcome the chance for a brief 10-minute chat if you're open to it. My resume is attached to the portal submission, and you can review my work here: [Your Portfolio/GitHub Link].

Thanks for your time and consideration!

Best regards,
${userName}`,
  };

  // Template 2: Alumni / Peer Referral Ask
  const referralAsk = {
    subject: `Question regarding ${company} / ${role}`,
    body: `Hi ${targetName},

Hope you're having a great week!

I came across your profile while researching engineering at ${company}. I'm preparing to apply for the ${role} opening and wanted to reach out since I really admire the product quality your team ships.

If you have a quick 5 minutes, I'd love to ask one or two brief questions about your experience at ${company}. Also, if you feel my background aligns, I'd be incredibly grateful for an internal referral.

Either way, thank you for your time and keep up the great work!

Best,
${userName}`,
  };

  // Template 3: 7-Day Follow Up
  const followUp = {
    subject: `Following up: Application for ${role} (${company})`,
    body: `Hi ${targetName},

I hope you're having a productive week.

I'm following up on my application submitted for the ${role} role at ${company} on ${application.date_applied}.

I remain very excited about the opportunity to contribute to ${company}'s upcoming milestones and wanted to check if there are any updates or additional materials I can provide regarding my background.

Looking forward to hearing from you.

Best regards,
${userName}`,
  };

  // Template 4: Post-Interview Thank You Note
  const thankYou = {
    subject: `Thank you — ${role} interview (${company})`,
    body: `Hi ${targetName},

Thank you for taking the time to speak with me today regarding the ${role} position at ${company}.

I really enjoyed our discussion about the engineering challenges your team is currently solving, especially around ${keySkill}. It further confirmed my enthusiasm for joining ${company}.

Please let me know if you need any follow-up code samples or additional details. Looking forward to the next steps!

Warm regards,
${userName}`,
  };

  const handleCopy = (text: string, tabKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabKey);
    toast.success(`[COPIED] ${tabKey.toUpperCase()} template copied to clipboard`);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleMailto = (subject: string, body: string) => {
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank");
  };

  const linkedInSearchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(company + " recruiter")}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] p-5 rounded-sm font-mono border border-border bg-card shadow-2xl">
        <DialogHeader className="pb-2 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>OUTREACH & FOLLOW-UP COMMAND</span>
            </DialogTitle>
            <a
              href={linkedInSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              <span>Find {company} Recruiters on LinkedIn</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <DialogDescription className="text-[11px] text-muted-foreground">
            Generate high-converting recruiter DMs, warm referral asks, and thank-you notes for <strong className="text-foreground">{company} ({role})</strong>.
          </DialogDescription>
        </DialogHeader>

        {/* Dynamic Personalization Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 pb-1 text-xs">
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Contact Name</Label>
            <Input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Alex (or leave blank)"
              className="h-7 text-xs font-mono"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Recipient Role</Label>
            <Input
              value={recipientRole}
              onChange={(e) => setRecipientRole(e.target.value)}
              placeholder="e.g. Tech Recruiter / EM"
              className="h-7 text-xs font-mono"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Highlight Skill / Achievement</Label>
            <Input
              value={keySkill}
              onChange={(e) => setKeySkill(e.target.value)}
              placeholder="e.g. React & Distributed Systems"
              className="h-7 text-xs font-mono"
            />
          </div>
        </div>

        {/* Template Tabs */}
        <Tabs defaultValue="cold" className="w-full pt-1">
          <TabsList className="grid grid-cols-4 h-8 bg-secondary/40 p-0.5 rounded-sm border border-border">
            <TabsTrigger value="cold" className="text-[10px] font-mono py-1 rounded-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
              [Cold InMail]
            </TabsTrigger>
            <TabsTrigger value="referral" className="text-[10px] font-mono py-1 rounded-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
              [Referral Ask]
            </TabsTrigger>
            <TabsTrigger value="followup" className="text-[10px] font-mono py-1 rounded-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
              [7-Day Check]
            </TabsTrigger>
            <TabsTrigger value="thankyou" className="text-[10px] font-mono py-1 rounded-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
              [Thank You]
            </TabsTrigger>
          </TabsList>

          {[
            { key: "cold", label: "Cold Hiring Manager Pitch", data: coldInmail },
            { key: "referral", label: "Alumni / Peer Referral Ask", data: referralAsk },
            { key: "followup", label: "7-Day Status Check Follow-Up", data: followUp },
            { key: "thankyou", label: "Post-Interview Thank You Note", data: thankYou },
          ].map((t) => (
            <TabsContent key={t.key} value={t.key} className="space-y-3 mt-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Subject: <strong className="text-foreground">{t.data.subject}</strong></span>
                  <span className="text-[10px] text-muted-foreground">{t.data.body.length} chars</span>
                </div>
                <div className="relative">
                  <pre className="p-3.5 rounded-sm bg-secondary/30 border border-border text-[11px] font-mono whitespace-pre-wrap leading-relaxed text-foreground select-text max-h-[220px] overflow-y-auto">
                    {t.data.body}
                  </pre>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-border">
                <Button
                  onClick={() => handleMailto(t.data.subject, t.data.body)}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-mono gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Open in Email App</span>
                </Button>

                <Button
                  onClick={() => handleCopy(t.data.body, t.key)}
                  variant="primary"
                  size="sm"
                  className="h-8 text-xs font-mono gap-1.5 shadow-sm"
                >
                  {copiedTab === t.key ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Full Template</span>
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
