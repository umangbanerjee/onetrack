"use client";

import { useState } from "react";
import { ApplicationStatus } from "@/lib/constants/defaults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit2, Check } from "lucide-react";
import { toast } from "sonner";

interface StatusConfigTableProps {
  statuses: ApplicationStatus[];
  onRefresh: () => void;
}

export function StatusConfigTable({ statuses, onRefresh }: StatusConfigTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<ApplicationStatus | null>(null);
  const [formData, setFormData] = useState({
    key: "",
    label: "",
    color: "#3b82f6",
    sort_order: 0,
    is_terminal: false,
    is_active: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingStatus(null);
    setFormData({
      key: "",
      label: "",
      color: "#3b82f6",
      sort_order: (statuses.length + 1) * 10,
      is_terminal: false,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (st: ApplicationStatus) => {
    setEditingStatus(st);
    setFormData({
      key: st.key,
      label: st.label,
      color: st.color,
      sort_order: st.sort_order,
      is_terminal: st.is_terminal,
      is_active: st.is_active,
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
      const res = await fetch("/api/config/statuses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingStatus?.id,
          ...formData,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save status configuration");
      }

      toast.success(editingStatus ? "[UPDATED] Stage modified" : "[CREATED] New stage registered");
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      toast.error(`[ERROR] ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (st: ApplicationStatus) => {
    try {
      const res = await fetch("/api/config/statuses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...st,
          is_active: !st.is_active,
        }),
      });
      if (!res.ok) throw new Error("Failed to update active state");
      toast.success(`[CONFIG] ${st.label} ${!st.is_active ? "activated" : "disabled"}`);
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
            PIPELINE STATUS DEFINITIONS [{statuses.length}]
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure application lifecycle stages, custom hex pills, and ordering.
          </p>
        </div>

        <Button onClick={handleOpenNew} size="sm" variant="primary" className="group shadow-sm hover:shadow">
          <span>Add Status</span>
          <Plus className="h-3.5 w-3.5 transition-transform duration-150 group-hover:rotate-90" />
        </Button>
      </div>

      <div className="border border-border bg-card overflow-x-auto rounded-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold uppercase">
              <th className="py-2.5 px-4">ORDER</th>
              <th className="py-2.5 px-4">PILL PREVIEW</th>
              <th className="py-2.5 px-4">SYSTEM KEY</th>
              <th className="py-2.5 px-4">TYPE</th>
              <th className="py-2.5 px-4">ACTIVE</th>
              <th className="py-2.5 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {statuses.map((st) => (
              <tr key={st.id} className="hover:bg-secondary/40 transition-colors">
                <td className="py-2.5 px-4 font-bold text-muted-foreground font-mono">#{st.sort_order}</td>
                <td className="py-2.5 px-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm border border-border/80 bg-background/50">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: st.color }} />
                    <span className="font-bold text-foreground">{st.label}</span>
                  </div>
                </td>
                <td className="py-2.5 px-4 font-mono text-[11px] text-muted-foreground">{st.key}</td>
                <td className="py-2.5 px-4">
                  {st.is_terminal ? (
                    <Badge variant="outline" className="text-[10px]">
                      [TERMINAL]
                    </Badge>
                  ) : (
                    <Badge variant="success" className="text-[10px]">
                      [ACTIVE]
                    </Badge>
                  )}
                </td>
                <td className="py-2.5 px-4">
                  <Switch
                    checked={st.is_active}
                    onCheckedChange={() => handleToggleActive(st)}
                  />
                </td>
                <td className="py-2.5 px-4 text-right">
                  <Button
                    onClick={() => handleOpenEdit(st)}
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

      {/* Add / Edit Status Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md p-5 rounded-sm font-mono border border-border bg-card shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>{editingStatus ? "EDIT STATUS CONFIG" : "NEW STATUS CONFIG"}</span>
              <Plus className="h-3.5 w-3.5 text-primary" />
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5 pt-2 font-mono text-xs">
            <div className="space-y-1">
              <Label htmlFor="label" className="text-[11px] font-bold">Display Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => {
                  const label = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    label,
                    key: editingStatus ? prev.key : label.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""),
                  }));
                }}
                placeholder="e.g. Technical Screen"
                className="h-8 text-xs font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="key" className="text-[11px] font-bold">Machine Key (slug)</Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                placeholder="e.g. tech_screen"
                className="h-8 text-xs font-mono"
                disabled={!!editingStatus}
                required
              />
            </div>

            {/* Color Selector */}
            <div className="space-y-1">
              <Label className="text-[11px] font-bold">Stage Hex Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="h-8 w-10 p-0.5 cursor-pointer rounded-sm"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#3b82f6"
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="sort_order" className="text-[11px] font-bold">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="flex flex-col justify-end pb-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_terminal"
                    checked={formData.is_terminal}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_terminal: checked })}
                  />
                  <Label htmlFor="is_terminal" className="text-[11px] text-muted-foreground cursor-pointer">
                    Terminal Stage
                  </Label>
                </div>
              </div>
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
                    <span>Save Status</span>
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
