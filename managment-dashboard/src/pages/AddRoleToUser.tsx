import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useUsers } from "@/hooks/useUsers"
import { UserWithRolesModel } from "@/types/UserWithRolesModel"
import { Copy, User, PenSquare, Trash2, Shield, UserCog, Users, MoreHorizontal } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  ColumnDef,
  Row,
  getCoreRowModel,
  useReactTable,
  flexRender
} from "@tanstack/react-table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ApiService } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { ToastProvider } from "@/components/ui/toast"

const AddRoleToUserCell = ({ row, name }: { row: Row<UserWithRolesModel>, name: string }) => {
  return (
    <div className="text-left">
      {row.getValue(name)}
    </div>
  )
}

const AddRoleToUserContent = () => {
  const { useUsersWithRoles } = useUsers()
  const { toast } = useToast()
  const [selectedRole, setSelectedRole] = useState<string>("")
  const { data, isLoading, error, refetch } = useUsersWithRoles()
  const [editingUser, setEditingUser] = useState<UserWithRolesModel | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleEditUser = (user: UserWithRolesModel) => {
    setEditingUser(user)
    const rolePriority = ['admin', 'manager', 'user']
    const matchedRole = rolePriority.find(role => user.roles?.includes(role))
    setSelectedRole(matchedRole || "")
    setIsDialogOpen(true)
  }

  const columns = useMemo<ColumnDef<UserWithRolesModel>[]>(() => [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <AddRoleToUserCell row={row} name={"id"} />
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <AddRoleToUserCell row={row} name={"email"} />
    },
    {
      accessorKey: "userName",
      header: "Username",
      cell: ({ row }) => <AddRoleToUserCell row={row} name={"userName"} />
    },
    {
      accessorKey: "roles",
      header: "Role",
      cell: ({ row }) => {
        const roles = row.original.roles || []
        return (
          <div className="flex gap-1">
            {roles.map((role, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded ${
                  role === 'admin'
                    ? 'bg-red-100 text-red-800'
                    : role === 'manager'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                }`}
              >
                {role}
              </span>
            ))}
          </div>
        )
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
                className="flex gap-2 items-center cursor-pointer"
              >
                <Copy className="h-4 w-4" /> Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                <User className="h-4 w-4" /> View Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEditUser(user)}
                className="flex gap-2 items-center cursor-pointer text-blue-600"
              >
                <PenSquare className="h-4 w-4" /> Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex gap-2 items-center cursor-pointer text-red-600">
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [])

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleSave = async () => {
    if (!editingUser || !selectedRole) {
      toast({
        title: "No role selected",
        description: "Please select a role before saving.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await ApiService.updateUserRole(editingUser.email, selectedRole)
      console.log("response ---> ", response);
      
      toast({
        title: "Role updated successfully",
        description: `Updated ${editingUser.userName}'s role to ${selectedRole}`,
      })

      refetch()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to update role:", error)
      toast({
        title: "Error updating role",
        description: "There was a problem updating the user's role",
        variant: "destructive",
      })
      setIsDialogOpen(false)
    } finally {
      setIsSaving(false)
      setIsDialogOpen(false)
    }
    setIsDialogOpen(false)
  }

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Select a role for this user. This will override any previous roles.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                value={editingUser?.email || ""}
                className="col-span-3"
                disabled
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id" className="text-right">User ID</Label>
              <Input
                id="id"
                value={editingUser?.id || ""}
                className="col-span-3"
                disabled
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roles" className="text-right">Role</Label>
              <div className="col-span-3">
                <ToggleGroup
                  type="single"
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                  className="justify-start"
                >
                  <ToggleGroupItem value="admin" aria-label="Admin role" className="flex gap-2 items-center">
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="manager" aria-label="Manager role" className="flex gap-2 items-center">
                    <UserCog className="h-4 w-4" />
                    <span>Manager</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="user" aria-label="User role" className="flex gap-2 items-center">
                    <Users className="h-4 w-4" />
                    <span>User</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSave}
              disabled={isSaving || !selectedRole || !editingUser}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const AddRoleToUser = () => {
  return (
    <ToastProvider>
      <AddRoleToUserContent />
    </ToastProvider>
  )
}

export default AddRoleToUser
