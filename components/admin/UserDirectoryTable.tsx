"use client";

import { useState } from "react";
import { UserProfile } from "@/lib/constants/defaults";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { ShieldCheck, UserX, Search, UserCheck } from "lucide-react";
import { toast } from "sonner";

interface UserDirectoryTableProps {
  users: UserProfile[];
  onRefresh: () => void;
}

export function UserDirectoryTable({ users, onRefresh }: UserDirectoryTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleRoleToggle = async (user: UserProfile) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    setUpdatingId(user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update user role");
      toast.success(`Role updated: ${newRole} for ${user.display_name || user.email}`);
      onRefresh();
    } catch (err: any) {
      toast.error(`Error updating role: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusToggle = async (user: UserProfile) => {
    setUpdatingId(user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, is_active: !user.is_active }),
      });
      if (!res.ok) throw new Error("Failed to update user status");
      toast.success(`Account ${!user.is_active ? "activated" : "deactivated"}`);
      onRefresh();
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (u.display_name && u.display_name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.clerk_user_id && u.clerk_user_id.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-4 font-mono select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            REGISTERED APPLICANTS & USER DIRECTORY
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Manage user permissions, grant Admin privileges, or toggle active status.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search email or name..."
            className="h-8 pl-8 text-xs font-mono"
          />
        </div>
      </div>

      <div className="border border-border bg-card rounded-sm overflow-hidden text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold uppercase">
              <th className="py-2.5 px-4">USER</th>
              <th className="py-2.5 px-4">ROLE</th>
              <th className="py-2.5 px-4">LOGGED APPS</th>
              <th className="py-2.5 px-4">ACCOUNT STATUS</th>
              <th className="py-2.5 px-4">JOINED</th>
              <th className="py-2.5 px-4 text-right">ADMIN PERMISSION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-muted-foreground text-xs">
                  [No registered users found matching search criteria]
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{u.display_name || "Applicant"}</span>
                      <span className="text-[10px] text-muted-foreground">{u.email || u.clerk_user_id}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    {u.role === "admin" ? (
                      <Badge variant="purple" className="text-[10px] gap-1">
                        <ShieldCheck className="h-2.5 w-2.5" />
                        <span>ADMIN</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        USER
                      </Badge>
                    )}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-foreground">
                    {u.application_count ?? 0}
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={u.is_active}
                        onCheckedChange={() => handleStatusToggle(u)}
                        disabled={updatingId === u.id}
                      />
                      <span className="text-[11px] text-muted-foreground">
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-[11px] text-muted-foreground">
                    {formatDate(u.created_at)}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <Button
                      onClick={() => handleRoleToggle(u)}
                      variant={u.role === "admin" ? "outline" : "primary"}
                      size="sm"
                      className="h-7 px-2.5 text-xs font-mono gap-1"
                      disabled={updatingId === u.id}
                    >
                      {u.role === "admin" ? (
                        <>
                          <UserX className="h-3 w-3" />
                          <span>Demote</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-3 w-3" />
                          <span>Grant Admin</span>
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
