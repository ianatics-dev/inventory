import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
    Box,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton,
    Typography,
    Switch,
    FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import app from "../../http_settings";

type UserRow = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    unit: string;
    is_active: boolean;
};

type UserForm = {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    role: string;
    unit: string;
    is_active: boolean;
};

const defaultForm: UserForm = {
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    role: "viewer",
    unit: "",
    is_active: true,
};

function CustomToolbar({ onAdd }: { onAdd: () => void }) {
    return (
        <GridToolbarContainer>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1,
                }}
            >
                <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
                    Add User
                </Button>
                <GridToolbarQuickFilter />
            </Box>
        </GridToolbarContainer>
    );
}

export default function UsersTable() {
    const [rows, setRows] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState<UserForm>(defaultForm);
    const [saving, setSaving] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await app.get("/api/accounts/users/");
            setRows(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenAdd = () => {
        setEditId(null);
        setForm(defaultForm);
        setOpen(true);
    };

    const handleOpenEdit = (row: UserRow) => {
        setEditId(row.id);
        setForm({
            username: row.username || "",
            email: row.email || "",
            first_name: row.first_name || "",
            last_name: row.last_name || "",
            password: "",
            role: row.role || "viewer",
            unit: row.unit || "",
            is_active: row.is_active ?? true,
        });
        setOpen(true);
    };

    const handleClose = () => {
        if (saving) return;
        setOpen(false);
        setEditId(null);
        setForm(defaultForm);
    };

    const handleChange = (field: keyof UserForm, value: string | boolean) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const getErrorMessage = (err: any) => {
        const data = err?.response?.data;

        if (!data) return "Something went wrong.";

        if (typeof data.detail === "string") return data.detail;
        if (Array.isArray(data.username)) return data.username[0];
        if (Array.isArray(data.email)) return data.email[0];
        if (Array.isArray(data.password)) return data.password[0];
        if (Array.isArray(data.role)) return data.role[0];
        if (Array.isArray(data.unit)) return data.unit[0];

        const firstKey = Object.keys(data)[0];
        if (firstKey && Array.isArray(data[firstKey])) {
            return data[firstKey][0];
        }

        return "Something went wrong.";
    };

    const handleSubmit = async () => {
        if (!form.username.trim()) {
            toast.error("Username is required.");
            return;
        }

        if (!editId && !form.password.trim()) {
            toast.error("Password is required.");
            return;
        }

        try {
            setSaving(true);

            const payload: any = {
                username: form.username,
                email: form.email,
                first_name: form.first_name,
                last_name: form.last_name,
                role: form.role,
                unit: form.unit,
                is_active: form.is_active,
            };

            if (form.password.trim()) {
                payload.password = form.password;
            }

            if (editId) {
                await app.put(`/api/accounts/users/${editId}/`, payload);
                toast.success("User updated successfully.");
            } else {
                await app.post("/api/accounts/users/", payload);
                toast.success("User created successfully.");
            }

            handleClose();
            fetchUsers();
        } catch (err: any) {
            console.error(err);
            toast.error(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (row: UserRow) => {
        const ok = window.confirm(
            `Are you sure you want to delete "${row.username}"?`
        );
        if (!ok) return;

        try {
            await app.delete(`/api/accounts/users/${row.id}/`);
            toast.success("User deleted successfully.");
            fetchUsers();
        } catch (err: any) {
            console.error(err);
            toast.error(getErrorMessage(err));
        }
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "username", headerName: "Username", flex: 1, minWidth: 140 },
        { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
        { field: "first_name", headerName: "First Name", flex: 1, minWidth: 130 },
        { field: "last_name", headerName: "Last Name", flex: 1, minWidth: 130 },
        { field: "role", headerName: "Role", flex: 1, minWidth: 120 },
        { field: "unit", headerName: "Unit", flex: 1, minWidth: 130 },
        {
            field: "is_active",
            headerName: "Active",
            width: 100,
            renderCell: (params) => (params.value ? "Yes" : "No"),
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 140,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => handleOpenEdit(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(params.row)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ p: 2 }}>
            <ToastContainer />
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    User Management
                </Typography>

                <Box sx={{ height: 600, width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        disableRowSelectionOnClick
                        pageSizeOptions={[5, 10, 20, 50]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    page: 0,
                                    pageSize: 10,
                                },
                            },
                        }}
                        slots={{
                            toolbar: () => <CustomToolbar onAdd={handleOpenAdd} />,
                        }}
                    />
                </Box>
            </Paper>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    {editId ? "Edit User" : "Add User"}
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <Box
                        sx={{
                            display: "grid",
                            gap: 2,
                            mt: 1,
                        }}
                    >
                        <TextField
                            label="Username"
                            value={form.username}
                            onChange={(e) => handleChange("username", e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label="Email"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label="First Name"
                            value={form.first_name}
                            onChange={(e) => handleChange("first_name", e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label="Last Name"
                            value={form.last_name}
                            onChange={(e) => handleChange("last_name", e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label={editId ? "Password (optional)" : "Password"}
                            type="password"
                            value={form.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            fullWidth
                        />

                        <TextField
                            select
                            label="Role"
                            value={form.role}
                            onChange={(e) => handleChange("role", e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="viewer">Viewer</MenuItem>
                        </TextField>

                        <TextField
                            label="Unit"
                            value={form.unit}
                            onChange={(e) => handleChange("unit", e.target.value)}
                            fullWidth
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={form.is_active}
                                    onChange={(e) => handleChange("is_active", e.target.checked)}
                                />
                            }
                            label="Active"
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={saving}>
                        {editId ? "Update" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}