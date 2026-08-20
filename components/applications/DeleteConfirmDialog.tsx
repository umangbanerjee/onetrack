"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ApplicationItem } from "@/lib/constants/defaults";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  application: ApplicationItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmDialog({
  application,
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 rounded-2xl">
        <DialogHeader className="space-y-2">
          <div className="h-10 w-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-1">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base font-bold">
            Delete Application?
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Are you sure you want to delete your application for{" "}
            <strong className="text-foreground">{application.role_title}</strong> at{" "}
            <strong className="text-foreground">{application.company_name}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-3 border-t border-border/60 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            className="text-xs font-semibold gap-1.5"
            disabled={isDeleting}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {isDeleting ? "Deleting..." : "Delete Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
