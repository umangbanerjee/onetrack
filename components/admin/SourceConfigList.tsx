"use client";

import { useState } from "react";
import { ApplicationSource } from "@/lib/constants/defaults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface SourceConfigListProps {
  sources: ApplicationSource[];
  onRefresh: () => void;
}

export function SourceConfigList({ sources, onRefresh }: SourceConfigListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<ApplicationSource | null>(null);
  const [formData, setFormData] = useState({
    key: "",
    label: "",
    is_active: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingSource(null);
    setFormData({
      key: "",
      label: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (src: ApplicationSource) => {
    setEditingSource(src);
    setFormData({
      key: src.key,
      label: src.label,
      is_active: src.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim()) {
      toast.error("[VALIDATION] Display label is required");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/config/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingSource?.id,
          ...formData,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save source channel");
      }

      toast.success(editingSource ? "[UPDATED] Channel modified" : "[CREATED] New channel registered");
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      toast.error(`[ERROR] ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (src: ApplicationSource) => {
    try {
      const res = await fetch("/api/config/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...src,
          is_active: !src.is_active,
        }),
      });
      if (!res.ok) throw new Error("Failed to update active state");
      toast.success(`[CONFIG] ${src.label} ${!src.is_active ? "activated" : "disabled"}`);
      onRefresh();
    } catch (err: any) {
      toast.error(`[ERROR] ${err.message}`);
    }
  };

  return (
    <div className="space-y-4 font-mono select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
            APPLICATION SOURCE CHANNELS [{sources.length}]
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure inbound acquisition channels (LinkedIn, Referrals, Company site, etc.).
          </p>
        </div>

        <Button onClick={handleOpenNew} size="sm" variant="primary" className="group shadow-sm hover:shadow">
          <span>Add Channel</span>
          <Plus className="h-3.5 w-3.5 transition-transform duration-150 group-hover:rotate-90" />
        </Button>
      </div>

      <div className="border border-border bg-card overflow-x-auto rounded-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold uppercase">
              <th className="py-2.5 px-4">CHANNEL NAME</th>
              <th className="py-2.5 px-4">KEY</th>
              <th className="py-2.5 px-4">STATUS</th>
              <th className="py-2.5 px-4 text-right">EDIT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {sources.map((src) => (
              <tr key={src.id} className="hover:bg-secondary/40 transition-colors">
                <td className="py-2.5 px-4 font-bold text-foreground">[{src.label}]</td>
                <td className="py-2.5 px-4 font-mono text-[11px] text-muted-foreground">{src.key}</td>
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={src.is_active}
                      onCheckedChange={() => handleToggleActive(src)}
                    />
                    <span className="text-[11px] text-muted-foreground">
                      {src.is_active ? "[active]" : "[disabled]"}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-4 text-right">
                  <Button
                    onClick={() => handleOpenEdit(src)}
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs font-mono gap-1"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md p-5 rounded-sm font-mono border border-border bg-card shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>{editingSource ? "EDIT CHANNEL CONFIG" : "NEW CHANNEL CONFIG"}</span>
              <Plus className="h-3.5 w-3.5 text-primary" />
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5 pt-2 font-mono text-xs">
            <div className="space-y-1">
              <Label htmlFor="src_label" className="text-[11px] font-bold">Display Label</Label>
              <Input
                id="src_label"
                value={formData.label}
                onChange={(e) => {
                  const label = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    label,
                    key: editingSource ? prev.key : label.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""),
                  }));
                }}
                placeholder="e.g. Y Combinator Jobs"
                className="h-8 text-xs font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="src_key" className="text-[11px] font-bold">Machine Key (slug)</Label>
              <Input
                id="src_key"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                placeholder="e.g. yc_jobs"
                className="h-8 text-xs font-mono"
                disabled={!!editingSource}
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Switch
                id="src_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="src_active" className="text-[11px] text-muted-foreground cursor-pointer">
                Available in application form
              </Label>
            </div>

            <DialogFooter className="pt-3 border-t border-border gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={isSaving} className="group">
                {isSaving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <span>Save Channel</span>
                    <Plus className="h-3.5 w-3.5 transition-transform duration-150 group-hover:rotate-90" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
