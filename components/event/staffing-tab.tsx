"use client"

import { useEffect, useState } from "react"
import { Check, CircleDashed, Edit2, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { CulinaryEvent, StaffGroup, StaffMember } from "@/lib/data"

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean)
  if (parts[0] === "Open") return "?"
  return parts.slice(0, 2).map((p) => p[0]).join("").toUpperCase()
}

const defaultMember = {
  id: "",
  name: "",
  role: "",
  confirmed: false,
}

export function StaffingTab({ event }: { event: CulinaryEvent }) {
  const [staffingGroups, setStaffingGroups] = useState<StaffGroup[]>(() => event.staffing)
  const [isAdding, setIsAdding] = useState(false)
  const [newMember, setNewMember] = useState({
    ...defaultMember,
    team: event.staffing[0]?.team ?? "Prep Team",
  } as StaffMember & { team: string })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTeam, setEditingTeam] = useState(event.staffing[0]?.team ?? "Prep Team")
  const [editMember, setEditMember] = useState<StaffMember>({ ...defaultMember })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    setStaffingGroups(event.staffing)
    setIsAdding(false)
    setEditingId(null)
    setDeletingId(null)
  }, [event.id])

  const handleAddVolunteer = () => {
    setIsAdding(true)
    setNewMember({
      ...defaultMember,
      team: event.staffing[0]?.team ?? "Prep Team",
    } as StaffMember & { team: string })
  }

  const saveNewMember = () => {
    if (!newMember.name.trim() || !newMember.role.trim()) return
    setStaffingGroups((prev) =>
      prev.map((group) =>
        group.team === newMember.team
          ? {
              ...group,
              members: [
                ...group.members,
                {
                  id: `staff-${Date.now()}`,
                  name: newMember.name,
                  role: newMember.role,
                  confirmed: newMember.confirmed,
                },
              ],
            }
          : group,
      ),
    )
    setIsAdding(false)
    setNewMember({
      ...defaultMember,
      team: event.staffing[0]?.team ?? "Prep Team",
    } as StaffMember & { team: string })
    // TODO: persist new volunteer via backend mutation
  }

  const startEditMember = (group: StaffGroup, member: StaffMember) => {
    setEditingId(member.id)
    setEditingTeam(group.team)
    setEditMember(member)
    setDeletingId(null)
  }

  const saveEditMember = () => {
    if (!editingId || !editMember.name.trim() || !editMember.role.trim()) return
    setStaffingGroups((prev) =>
      prev.map((group) =>
        group.team === editingTeam
          ? {
              ...group,
              members: group.members.map((member) =>
                member.id === editingId ? editMember : member,
              ),
            }
          : group,
      ),
    )
    setEditingId(null)
    // TODO: persist volunteer changes via backend mutation
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditMember({ ...defaultMember })
  }

  const confirmDeleteMember = (id: string) => {
    setDeletingId(id)
    setEditingId(null)
  }

  const deleteMember = (id: string) => {
    setStaffingGroups((prev) =>
      prev.map((group) => ({
        ...group,
        members: group.members.filter((member) => member.id !== id),
      })),
    )
    setDeletingId(null)
    // TODO: persist volunteer deletion via backend mutation
  }

  const memberCount = staffingGroups.reduce((acc, group) => acc + group.members.length, 0)
  const confirmedCount = staffingGroups.reduce(
    (acc, group) => acc + group.members.filter((member) => member.confirmed).length,
    0,
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{memberCount} volunteers assigned</p>
          <p className="text-sm font-medium">{confirmedCount}/{memberCount} confirmed</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
          onClick={handleAddVolunteer}
        >
          <Plus className="size-4" />
          Add Volunteer
        </Button>
      </div>

      {isAdding ? (
        <Card>
          <CardHeader className="items-start gap-4">
            <CardTitle className="text-sm">New volunteer</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                <X className="size-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={saveNewMember}>
                Save
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Name
                </div>
                <Input
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Volunteer name"
                />
              </div>
              <div>
                <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Role
                </div>
                <Input
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  placeholder="Prep Volunteer, Server"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Team
                </div>
                <select
                  value={newMember.team}
                  onChange={(e) => setNewMember({ ...newMember, team: e.target.value })}
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                >
                  {staffingGroups.map((group) => (
                    <option key={group.team} value={group.team}>
                      {group.team}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={newMember.confirmed}
                  onChange={(e) => setNewMember({ ...newMember, confirmed: e.target.checked })}
                  className="h-4 w-4 rounded border-input text-foreground focus-visible:ring-ring"
                />
                <span className="text-sm text-foreground">Confirmed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {staffingGroups.map((group) => {
          const confirmed = group.members.filter((m) => m.confirmed).length
          return (
            <Card key={group.team} className="group/card">
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-sm">{group.team}</CardTitle>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {confirmed}/{group.members.length} confirmed
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {group.members.map((member, i) => {
                  const isEditing = editingId === member.id
                  const isDeleting = deletingId === member.id
                  return (
                    <div key={member.id} className="flex flex-col gap-3">
                      {i > 0 ? <Separator /> : null}
                      {isEditing ? (
                        <div className="grid gap-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                                Name
                              </div>
                              <Input
                                className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                                value={editMember.name}
                                onChange={(e) => setEditMember({ ...editMember, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                                Role
                              </div>
                              <Input
                                className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                                value={editMember.role}
                                onChange={(e) => setEditMember({ ...editMember, role: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={editMember.confirmed}
                              onChange={(e) => setEditMember({ ...editMember, confirmed: e.target.checked })}
                              className="h-4 w-4 rounded border-input text-foreground focus-visible:ring-ring"
                            />
                            <span className="text-sm text-foreground">Confirmed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm" onClick={saveEditMember}>
                              Save
                            </Button>
                            <Button variant="ghost" size="sm" onClick={cancelEdit}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarFallback>{initials(member.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-1 flex-col leading-tight">
                              <span className="text-sm font-medium">{member.name}</span>
                              <span className="text-xs text-muted-foreground">{member.role}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              {member.confirmed ? (
                                <span className="flex items-center gap-1 text-emerald-600">
                                  <Check className="size-3.5" />
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-amber-600">
                                  <CircleDashed className="size-3.5" />
                                </span>
                              )}
                            </div>
                            <div className="opacity-0 transition-opacity group-hover/card:opacity-100">
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:bg-muted"
                                  onClick={() => startEditMember(group, member)}
                                >
                                  <Edit2 />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:bg-muted"
                                  onClick={() => confirmDeleteMember(member.id)}
                                >
                                  <Trash2 />
                                </Button>
                              </div>
                            </div>
                          </div>
                          {isDeleting ? (
                            <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
                              <p className="text-sm">Delete this volunteer?</p>
                              <div className="mt-3 flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setDeletingId(null)}>
                                  Cancel
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => deleteMember(member.id)}>
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
