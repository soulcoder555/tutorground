"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, getApiErrorMessage } from "@/lib/api";
import type { Role } from "@/types";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  async function loadUsers() {
    setError(null);
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data.data.users);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not load users."));
    }
  }

  React.useEffect(() => {
    void loadUsers();
  }, []);

  async function deactivateUser(id: string) {
    setError(null);
    setMessage(null);
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((items) => items.map((item) => (item.id === id ? { ...item, isActive: false } : item)));
      setMessage("User deactivated.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not deactivate user."));
    }
  }

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>User management</CardTitle>
        </CardHeader>
        <CardContent>
          {message ? <p className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
          {error ? <p className="mb-3 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "success" : "secondary"}>{user.isActive ? "Active" : "Inactive"}</Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString("en-IN")}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" disabled={!user.isActive} onClick={() => deactivateUser(user.id)}>
                          Deactivate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No users found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
