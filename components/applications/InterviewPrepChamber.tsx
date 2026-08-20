"use client";

import { useState } from "react";
import { ApplicationItem } from "@/lib/constants/defaults";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sparkles, Copy, Check, Save, HelpCircle, BookOpen, Layers } from "lucide-react";
import { toast } from "sonner";

interface InterviewPrepChamberProps {
  application: ApplicationItem;
  onSaveNotes: (notes: string) => Promise<void>;
  isSaving?: boolean;
}

export function InterviewPrepChamber({
  application,
  onSaveNotes,
  isSaving = false,
}: InterviewPrepChamberProps) {
  const [situation, setSituation] = useState("");
  const [task, setTask] = useState("");
  const [action, setAction] = useState("");
  const [result, setResult] = useState("");
  const [copiedSTAR, setCopiedSTAR] = useState(false);

  const company = application.company_name;
  const role = application.role_title;

  // Recommended questions to ask the interviewer
  const reverseQuestions = [
    `What does exceptional impact in this ${role} role look like in the first 90 days?`,
    `How does the engineering team at ${company} handle technical debt vs. shipping new velocity?`,
    `What are the most challenging technical scaling hurdles ${company} faces in the next 12 months?`,
    `Can you describe the dynamic between product managers, designers, and engineers here?`,
    `What made you choose ${company}, and what keeps you here today?`,
  ];

  const handleCopySTAR = () => {
    const starStory = `**STAR STORY (${company} — ${role})**
• **Situation:** ${situation || "N/A"}
• **Task:** ${task || "N/A"}
• **Action:** ${action || "N/A"}
• **Result:** ${result || "N/A"}`;

    navigator.clipboard.writeText(starStory);
    setCopiedSTAR(true);
    toast.success("[COPIED] STAR Story copied to clipboard");
    setTimeout(() => setCopiedSTAR(false), 2000);
  };

  const handleAppendSTARToNotes = async () => {
    const starStory = `\n\n--- [STAR STORY PREP] ---\n• Situation: ${situation}\n• Task: ${task}\n• Action: ${action}\n• Result: ${result}`;
    const newNotes = (application.notes || "") + starStory;
    await onSaveNotes(newNotes);
    toast.success("[SAVED] STAR Story appended to Application Notes");
  };

  return (
    <Card className="border border-border bg-card rounded-sm shadow-none font-mono text-xs">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>INTERVIEW PREP CHAMBER</span>
          </CardTitle>
          <Badge variant="outline" className="font-mono text-[10px] bg-secondary/40 text-foreground">
            {company} • {role}
          </Badge>
        </div>
        <CardDescription className="text-[11px] text-muted-foreground">
          Structured STAR framework, technical question bank, and reverse questions to ask the team.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5">
        <Tabs defaultValue="star" className="w-full">
          <TabsList className="grid grid-cols-2 h-8 bg-secondary/40 p-0.5 rounded-sm border border-border">
            <TabsTrigger value="star" className="text-[11px] font-mono py-1 rounded-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              <span>[STAR Story Builder]</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="text-[11px] font-mono py-1 rounded-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>[Reverse Questions Bank]</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: STAR Story Framework */}
          <TabsContent value="star" className="space-y-3.5 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <span className="text-primary font-bold">S</span> — SITUATION
                </Label>
                <Textarea
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="What was the background, context, or critical bug/deadline?"
                  rows={2}
                  className="text-xs min-h-[55px] font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <span className="text-primary font-bold">T</span> — TASK
                </Label>
                <Textarea
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="What was your specific responsibility or engineering challenge?"
                  rows={2}
                  className="text-xs min-h-[55px] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <span className="text-primary font-bold">A</span> — ACTION
                </Label>
                <Textarea
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  placeholder="What concrete code, architecture, or workflow did you personally implement?"
                  rows={2}
                  className="text-xs min-h-[55px] font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <span className="text-emerald-400 font-bold">R</span> — RESULT
                </Label>
                <Textarea
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder="Quantifiable metric: latency dropped 40%, shipped to 200k users, saved $15k..."
                  rows={2}
                  className="text-xs min-h-[55px] font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
              <Button
                onClick={handleCopySTAR}
                variant="outline"
                size="sm"
                className="h-8 text-xs font-mono gap-1.5"
              >
                {copiedSTAR ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy STAR Story</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleAppendSTARToNotes}
                variant="primary"
                size="sm"
                disabled={isSaving || (!situation && !action)}
                className="h-8 text-xs font-mono gap-1.5 shadow-sm"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Append to App Notes</span>
              </Button>
            </div>
          </TabsContent>

          {/* TAB 2: Reverse Questions Bank */}
          <TabsContent value="questions" className="space-y-3 mt-4">
            <p className="text-[11px] text-muted-foreground">
              Standout reverse questions to ask the hiring manager or tech lead to show senior engineering ownership:
            </p>

            <div className="space-y-2">
              {reverseQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-secondary/30 rounded-sm border border-border flex items-start justify-between gap-3 group hover:border-foreground/30 transition-colors"
                >
                  <p className="text-xs text-foreground font-mono leading-relaxed select-text">
                    <span className="text-primary font-bold mr-1.5">[{idx + 1}]</span>
                    {q}
                  </p>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(q);
                      toast.success(`[COPIED] Question #${idx + 1} copied`);
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[10px] font-mono shrink-0 opacity-80 group-hover:opacity-100"
                  >
                    Copy
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
