import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import { Box } from "@mui/material";
import app from "../../../../../http_settings";

import ExpandSearchToolbar from "./ExpandSearchToolbar";
import FirearmDetailsDialog from "./FirearmDetailsDialog";
import FirearmImageDialog from "./FirearmImageDialog";
import EditFirearmDialog from "./EditFirearmDialog";

import { logActivity } from "../../../utils";

type RankTableProps = {
  rows: any[];
  count: number;
  loading: boolean;
  page: number;
  pageSize: number;
  searchText: string;
  onSearchChange: (value: string) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
  onRefresh: () => void;
};

const RankTable: React.FC<RankTableProps> = ({
  rows,
  count,
  loading,
  page,
  pageSize,
  searchText,
  onSearchChange,
  onPaginationChange,
  onRefresh,
}) => {
  const [updatedRows, setUpdatedRows] = useState<any[]>(rows);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const [imageOpen, setImageOpen] = useState(false);
  const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setSuperIsAdmin] = useState(false);

  const [editForm, setEditForm] = useState({
    serial_no: "",
    make: "",
    type: "",
    caliber: "",
    property_no: "",
    acquisition_date: "",
    acquisition_cost: "",
    cost_of_repair: "",
    current_depreciated_value: "",
    source: "PROCURED",
    status: "",
    validated: "No",
    balance_qty: "",
    balance_value: "",
    on_hand_qty: "",
    on_hand_value: "",
    short_qty: "",
    short_value: "",
    over_qty: "",
    over_value: "",
  });

  useEffect(() => {
    setUpdatedRows(rows);

    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
    setSuperIsAdmin(role === "super_admin");

    logActivity({
      action: "VIEW",
      module: "Firearms",
      description: "Viewed Firearms table",
    });
  }, [rows]);

  const handleProcessRowUpdate = async (newRow: any, oldRow: any) => {
    try {
      if (oldRow.disposition === "ISSUED") {
        toast.info("Cannot change disposition of an ISSUED firearm here.");
        return oldRow;
      }

      const fd = new FormData();
      fd.append("disposition", newRow.disposition);

      const res = await app.patch(`/api/guns/${newRow.id}/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const serverRow = res.data;

      setUpdatedRows((prev) =>
        prev.map((r: any) => (r.id === newRow.id ? serverRow : r))
      );

      toast.success("Disposition updated");
      onRefresh();
      return serverRow;
    } catch (e) {
      console.error(e);
      toast.error("Failed to update disposition");
      throw e;
    }
  };

  const openDetailModal = (row: any) => {
    setSelectedRow(row);
    setDetailOpen(true);
  };

  const closeDetailModal = () => {
    setDetailOpen(false);
    setSelectedRow(null);
  };

  const openImageModal = (urls?: string[] | null) => {
    const safe = (urls ?? []).filter(Boolean);

    if (!safe.length) {
      toast.info("No image available.");
      return;
    }

    setSelectedImageUrls(safe.slice(0, 2));
    setImageOpen(true);
  };

  const closeImageModal = () => {
    setImageOpen(false);
    setSelectedImageUrls([]);
  };

  const handleOpenEdit = () => {
    if (!selectedRow) return;

    setEditForm({
      serial_no: selectedRow?.serial_no ?? "",
      make: selectedRow?.make ?? "",
      type: selectedRow?.type ?? "",
      caliber: selectedRow?.caliber ?? "",
      property_no: selectedRow?.property_no ?? "",
      acquisition_date: selectedRow?.acquisition_date ?? "",
      acquisition_cost: selectedRow?.acquisition_cost ?? "",
      cost_of_repair: selectedRow?.cost_of_repair ?? "",
      current_depreciated_value: selectedRow?.current_depreciated_value ?? "",
      source: selectedRow?.source ?? "PROCURED",
      status: selectedRow?.status ?? "",
      validated: selectedRow?.validated ?? "No",
      balance_qty: selectedRow?.balance_qty ?? "",
      balance_value: selectedRow?.balance_value ?? "",
      on_hand_qty: selectedRow?.on_hand_qty ?? "",
      on_hand_value: selectedRow?.on_hand_value ?? "",
      short_qty: selectedRow?.short_qty ?? "",
      short_value: selectedRow?.short_value ?? "",
      over_qty: selectedRow?.over_qty ?? "",
      over_value: selectedRow?.over_value ?? "",
    });

    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    if (editSaving) return;
    setEditOpen(false);
  };

  const handleEditChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitEdit = async () => {
    if (!selectedRow) return;

    try {
      setEditSaving(true);

      const oldData = {
        serial_no: selectedRow?.serial_no ?? "",
        make: selectedRow?.make ?? "",
        type: selectedRow?.type ?? "",
        caliber: selectedRow?.caliber ?? "",
      };

      const changes: string[] = [];

      const fd = new FormData();
      fd.append("serial_no", editForm.serial_no);
      fd.append("make", editForm.make);
      fd.append("type", editForm.type);
      fd.append("caliber", editForm.caliber);
      fd.append("property_no", editForm.property_no);
      fd.append("acquisition_date", editForm.acquisition_date);
      fd.append("acquisition_cost", editForm.acquisition_cost);
      fd.append("cost_of_repair", editForm.cost_of_repair);
      fd.append(
        "current_depreciated_value",
        editForm.current_depreciated_value
      );
      fd.append("source", editForm.source);
      fd.append("status", editForm.status);
      fd.append("validated", editForm.validated);
      fd.append("balance_qty", editForm.balance_qty);
      fd.append("balance_value", editForm.balance_value);
      fd.append("on_hand_qty", editForm.on_hand_qty);
      fd.append("on_hand_value", editForm.on_hand_value);
      fd.append("short_qty", editForm.short_qty);
      fd.append("short_value", editForm.short_value);
      fd.append("over_qty", editForm.over_qty);
      fd.append("over_value", editForm.over_value);

      const res = await app.patch(`/api/guns/${selectedRow.id}/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const serverRow = res.data;

      setUpdatedRows((prev) =>
        prev.map((r: any) => (r.id === selectedRow.id ? serverRow : r))
      );
      setSelectedRow(serverRow);

      if (oldData.serial_no !== editForm.serial_no) {
        changes.push(`Serial No.: "${oldData.serial_no}" → "${editForm.serial_no}"`);
      }
      if (oldData.make !== editForm.make) {
        changes.push(`Make: "${oldData.make}" → "${editForm.make}"`);
      }
      if (oldData.type !== editForm.type) {
        changes.push(`Type: "${oldData.type}" → "${editForm.type}"`);
      }
      if (oldData.caliber !== editForm.caliber) {
        changes.push(`Caliber: "${oldData.caliber}" → "${editForm.caliber}"`);
      }

      const username = localStorage.getItem("username");
      const user_id = localStorage.getItem("id");

      logActivity({
        action: "UPDATE",
        module: "Record Updated (Firearm)",
        description:
          changes.length > 0
            ? `User "${username}" updated firearm record. Changes: ${changes.join(", ")}`
            : `User "${username}" opened update but no changes were made.`,
        target_id: user_id,
        target_name: username,
      });

      toast.success("Firearm updated successfully.");
      setEditOpen(false);
      onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update firearm.");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRow) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete firearm ${selectedRow?.serial_no ?? ""}?`
    );
    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);

      await app.delete(`/api/guns/${selectedRow.id}/`);

      toast.success("Firearm deleted successfully.");
      closeDetailModal();
      onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete firearm.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "serial_no", headerName: "Serial No.", flex: 1, minWidth: 130 },
    { field: "make", headerName: "Make", flex: 1, minWidth: 150 },
    { field: "type", headerName: "Type", flex: 0.8, minWidth: 110 },
    { field: "caliber", headerName: "Caliber", flex: 0.8, minWidth: 110 },
    { field: "property_no", headerName: "Property No.", flex: 0.8, minWidth: 110 },
    { field: "acquisition_date", headerName: "Acquisition Date", flex: 0.8, minWidth: 140 },
    { field: "acquisition_cost", headerName: "Acquisition Cost", flex: 0.8, minWidth: 140 },
    { field: "cost_of_repair", headerName: "Cost of Repair", flex: 0.8, minWidth: 130 },
    { field: "disposition", headerName: "Disposition", flex: 0.8, minWidth: 130 },
  ];

  return (
    <>
      <Box
        sx={{
          width: "100%",
          position: "relative",
          pb: "70px",
          "& .MuiDataGrid-scrollbar--horizontal": {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 3,
          },
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
        }}
      >
        <DataGrid
          autoHeight
          rows={updatedRows}
          columns={columns}
          loading={loading}
          pagination
          paginationMode="server"
          filterMode="server"
          rowCount={count}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) =>
            onPaginationChange(model.page, model.pageSize)
          }
          slots={{ toolbar: ExpandSearchToolbar }}
          slotProps={{
            toolbar: {
              searchText,
              onSearchChange,
            } as any,
          }}
          processRowUpdate={handleProcessRowUpdate}
          onProcessRowUpdateError={(err) => console.error(err)}
          getRowId={(row) => row.id}
          onRowClick={(params: GridRowParams) => openDetailModal(params.row)}
        />
      </Box>

      <FirearmDetailsDialog
        open={detailOpen}
        onClose={closeDetailModal}
        selectedRow={selectedRow}
        onOpenImage={openImageModal}
        onOpenEdit={handleOpenEdit}
        onDelete={handleDelete}
        deleteLoading={deleteLoading}
        isAdmin={isAdmin}
        isSuperAdmin={isSuperAdmin}
      />

      <FirearmImageDialog
        open={imageOpen}
        onClose={closeImageModal}
        selectedImageUrls={selectedImageUrls}
      />

      <EditFirearmDialog
        open={editOpen}
        onClose={handleCloseEdit}
        editForm={editForm}
        editSaving={editSaving}
        onChange={handleEditChange}
        onSubmit={handleSubmitEdit}
      />

      <ToastContainer />
    </>
  );
};

export default RankTable;