import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Box } from "@mui/material";
import app from "../../../../http_settings";

import ExpandSearchToolbar from "./ExpandSearchToolbar";
import FirearmDetailsDialog from "./FirearmDetailsDialog";
import FirearmImageDialog from "./FirearmImageDialog";
import EditFirearmDialog from "./EditFirearmDialog";

import { RankTableProps } from "./types";
import { logActivity } from "../../utils";

const RankTable: React.FC<RankTableProps> = ({ rows, setRows }) => {
  const [updatedRows, setUpdatedRows] = useState<any[]>(rows);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const [imageOpen, setImageOpen] = useState(false);
  const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setSuperIsAdmin] = useState<any>(false);

  const [editForm, setEditForm] = useState({
    faid: "",
    serial_no: "",
    make: "",
    model: "",
    kind: "",
    caliber: "",
    disposition: "",
    validated: "",
  });

  useEffect(() => {
    setUpdatedRows(rows);
    const role = localStorage.getItem("role");
    const isAdmin = role === "admin";
    setIsAdmin(isAdmin)
    const isSuperAdmin = role === "super_admin";
    setSuperIsAdmin(isSuperAdmin)

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
      setRows((prev: any[]) =>
        prev.map((r: any) => (r.id === newRow.id ? serverRow : r))
      );

      toast.success("Disposition updated");
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
      faid: selectedRow?.faid ?? "",
      serial_no: selectedRow?.serial_no ?? "",
      make: selectedRow?.make ?? "",
      model: selectedRow?.model ?? "",
      kind: selectedRow?.kind ?? "",
      caliber: selectedRow?.caliber ?? "",
      disposition: selectedRow?.disposition ?? "",
      validated: selectedRow?.validated ?? "",
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
        faid: selectedRow?.faid ?? "",
        serial_no: selectedRow?.serial_no ?? "",
        make: selectedRow?.make ?? "",
        model: selectedRow?.model ?? "",
        kind: selectedRow?.kind ?? "",
        caliber: selectedRow?.caliber ?? "",
        disposition: selectedRow?.disposition ?? "",
        validated: selectedRow?.validated ?? "",
      }

      const changes: string[] = [];

      const fd = new FormData();
      fd.append("faid", editForm.faid);
      fd.append("serial_no", editForm.serial_no);
      fd.append("make", editForm.make);
      fd.append("model", editForm.model);
      fd.append("kind", editForm.kind);
      fd.append("caliber", editForm.caliber);
      fd.append("disposition", editForm.disposition);
      fd.append("validated", editForm.validated);

      const res = await app.patch(`/api/guns/${selectedRow.id}/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const serverRow = res.data;

      setUpdatedRows((prev) =>
        prev.map((r: any) => (r.id === selectedRow.id ? serverRow : r))
      );
      setRows((prev: any[]) =>
        prev.map((r: any) => (r.id === selectedRow.id ? serverRow : r))
      );
      setSelectedRow(serverRow);


      if (oldData.faid !== editForm.faid) {
        {
          changes.push(`FAID: "${oldData.faid}" → "${editForm.faid}"`);
        }
      }
      if (oldData.serial_no !== editForm.serial_no) {
        {
          changes.push(`Serial No.: "${oldData.serial_no}" → "${editForm.serial_no}"`);
        }
      }
      if (oldData.make !== editForm.make) {
        {
          changes.push(`Make: "${oldData.make}" → "${editForm.make}"`);
        }
      }
      if (oldData.model !== editForm.model) {
        {
          changes.push(`Model : "${oldData.model}" → "${editForm.model}"`);
        }
      }
      if (oldData.kind !== editForm.kind) {
        {
          changes.push(`Kind: "${oldData.kind}" → "${editForm.faid}"`);
        }
      }
      if (oldData.caliber !== editForm.caliber) {
        {
          changes.push(`Caliber: "${oldData.caliber}" → "${editForm.caliber}"`);
        }
      }
      if (oldData.disposition !== editForm.disposition) {
        {
          changes.push(`Disposition: "${oldData.disposition}" → "${editForm.disposition}"`);
        }
      }
      if (oldData.validated !== editForm.validated) {
        {
          changes.push(`Validated: "${oldData.validated}" → "${editForm.validated}"`);
        }
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
      `Are you sure you want to delete firearm ${selectedRow?.faid ?? ""}?`
    );
    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);

      await app.delete(`/api/guns/${selectedRow.id}/`);

      setUpdatedRows((prev) => prev.filter((r: any) => r.id !== selectedRow.id));
      setRows((prev: any[]) => prev.filter((r: any) => r.id !== selectedRow.id));

      toast.success("Firearm deleted successfully.");
      closeDetailModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete firearm.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "faid", headerName: "Faid", flex: 1, minWidth: 160 },
    { field: "serial_no", headerName: "Serial No.", flex: 1, minWidth: 130 },
    { field: "make", headerName: "Make", flex: 1, minWidth: 150 },
    { field: "model", headerName: "Model", flex: 1, minWidth: 150 },
    { field: "kind", headerName: "Kind", flex: 0.8, minWidth: 110 },
    { field: "caliber", headerName: "Caliber", flex: 0.8, minWidth: 110 },
    {
      field: "disposition",
      headerName: "Disposition",
      flex: 1,
      minWidth: 140,
      editable: true,
      type: "singleSelect",
      valueOptions: ["ON_STOCK", "FOR_RELEASE", "ISSUED"],
    },
    { field: "validated", headerName: "Validated", flex: 1, minWidth: 120 },
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
          pagination
          pageSizeOptions={[5, 10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          slots={{ toolbar: ExpandSearchToolbar }}
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