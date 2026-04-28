import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import { Box } from "@mui/material";
import app from "../../../../../http_settings";

import ExpandSearchToolbar from "./ExpandSearchToolbar";
import FirearmDetailsDialog from "./FirearmDetailsDialog";
import ParImagesDialog from "./ParImagesDialog";
import TurnInDialog from "./TurnInDialog";
import EditFirearmDialog from "./EditFirearmDialog";

import {
  getGun,
  getGunId,
  getLatestIssuedImages,
} from "../../utils/firearmRow";
import { logActivity } from "../../../utils";

type PersonTableProps = {
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

const IssuedTable: React.FC<PersonTableProps> = ({
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

  const [parOpen, setParOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [turnInOpen, setTurnInOpen] = useState(false);
  const [turnInRow, setTurnInRow] = useState<any | null>(null);
  const [turnInDate, setTurnInDate] = useState<string>("");
  const [turnInFiles, setTurnInFiles] = useState<File[]>([]);
  const [turnInSaving, setTurnInSaving] = useState(false);
  const [turnInFileError, setTurnInFileError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    unit: "",
    sub_unit: "",
    // station: "",
    // issued_unit: "",
    // faid: "",
    serial_no: "",
    make: "",
    type: "",
    // kind: "",
    caliber: "",
    // validated: "",
  });

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setSuperIsAdmin] = useState(false);

  useEffect(() => {
    setUpdatedRows(rows);

    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
    setSuperIsAdmin(role === "super_admin");

    logActivity({
      action: "VIEW",
      module: "Issued Firearms",
      description: "Viewed Issued Firearms table",
    });
  }, [rows]);

  const handleOpenDetails = (row: any) => {
    setSelectedRow(row);
    setDetailOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailOpen(false);
    setSelectedRow(null);
  };

  const handleOpenPar = (row: any) => {
    const imgs = getLatestIssuedImages(row);
    setSelectedImages(imgs);
    setParOpen(true);
  };

  const handleClosePar = () => {
    setParOpen(false);
    setSelectedImages([]);
  };

  const handleOpenTurnIn = (row: any) => {
    const gunId = getGunId(row);
    if (!gunId) {
      toast.error("Missing gun id for this row.");
      return;
    }

    setTurnInRow(row);
    setTurnInDate("");
    setTurnInFiles([]);
    setTurnInFileError("");
    setTurnInOpen(true);
  };

  const handleCloseTurnIn = () => {
    if (turnInSaving) return;
    setTurnInOpen(false);
    setTurnInRow(null);
    setTurnInDate("");
    setTurnInFiles([]);
    setTurnInFileError("");
  };

  const handlePickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    if (files.length === 0) {
      setTurnInFiles([]);
      setTurnInFileError("Please upload at least 1 image.");
      e.target.value = "";
      return;
    }

    if (files.length > 2) {
      toast.error("You can only upload a maximum of 2 images.");
    }

    setTurnInFiles(files.slice(0, 2));
    setTurnInFileError("");
    e.target.value = "";
  };

  const handleSubmitTurnIn = async () => {
    if (!turnInRow) return;

    const gunId = getGunId(turnInRow);
    if (!gunId) {
      toast.error("Missing gun id for this row.");
      return;
    }

    if (turnInFiles.length === 0) {
      setTurnInFileError("Photo is required.");
      toast.error("Please upload at least 1 image.");
      return;
    }

    try {
      setTurnInSaving(true);

      const fd = new FormData();
      if (turnInDate) fd.append("date", turnInDate);
      turnInFiles.slice(0, 2).forEach((f) => fd.append("img", f));

      await app.post(`/api/guns/${gunId}/turn_in/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Turn in successful!");
      handleCloseTurnIn();
      handleCloseDetails();
      onRefresh();
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data
        ? JSON.stringify(err.response.data)
        : err?.message || "Turn in failed";
      toast.error(msg);
    } finally {
      setTurnInSaving(false);
    }
  };

  const handleOpenEdit = () => {
    if (!selectedRow) return;

    const gun = getGun(selectedRow);

    setEditForm({
      full_name: selectedRow?.full_name ?? selectedRow?.issued_to?.full_name ?? "",
      unit: selectedRow?.issued_to?.unit ?? "",
      sub_unit: selectedRow?.issued_to?.sub_unit ?? "",
      // station: selectedRow?.issued_to?.station ?? "",
      // issued_unit: selectedRow?.issued_to?.issued_unit ?? "",
      // faid: gun?.faid ?? "",
      serial_no: gun?.serial_no ?? "",
      make: gun?.make ?? "",
      type: gun?.type ?? "",
      // kind: gun?.kind ?? "",
      caliber: gun?.caliber ?? "",
      // validated: gun?.validated ?? "",
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

    const gunId = getGunId(selectedRow);
    if (!gunId) {
      toast.error("Missing gun id.");
      return;
    }

    try {
      setEditSaving(true);

      const personPayload = {
        full_name: editForm.full_name,
        unit: editForm.unit,
        sub_unit: editForm.sub_unit,
        // station: editForm.station,
        // issued_unit: editForm.issued_unit,
      };

      const oldData = {
        full_name: selectedRow?.full_name ?? selectedRow?.issued_to?.full_name ?? "",
        unit: selectedRow?.issued_to?.unit ?? "",
        sub_unit: selectedRow?.issued_to?.sub_unit ?? "",
        station: selectedRow?.issued_to?.station ?? "",
        issued_unit: selectedRow?.issued_to?.issued_unit ?? "",
      };

      await app.patch(`/api/guns/${gunId}/`, personPayload);

      const updatedLocalRow = {
        ...selectedRow,
        issued_to: {
          ...selectedRow?.issued_to,
          full_name: editForm.full_name,
          unit: editForm.unit,
          sub_unit: editForm.sub_unit,
          // station: editForm.station,
          // issued_unit: editForm.issued_unit,
        },
      };

      setUpdatedRows((prev) =>
        prev.map((r) => (r.id === selectedRow.id ? updatedLocalRow : r))
      );

      const username = localStorage.getItem("username");
      const user_id = localStorage.getItem("id");

      const changes: string[] = [];

      if (oldData.full_name !== editForm.full_name) {
        changes.push(`Full Name: "${oldData.full_name}" → "${editForm.full_name}"`);
      }
      if (oldData.unit !== editForm.unit) {
        changes.push(`Unit: "${oldData.unit}" → "${editForm.unit}"`);
      }
      if (oldData.sub_unit !== editForm.sub_unit) {
        changes.push(`Sub Unit: "${oldData.sub_unit}" → "${editForm.sub_unit}"`);
      }
      // if (oldData.station !== editForm.station) {
      //   changes.push(`Station: "${oldData.station}" → "${editForm.station}"`);
      // }
      // if (oldData.issued_unit !== editForm.issued_unit) {
      //   changes.push(`Issued Unit: "${oldData.issued_unit}" → "${editForm.issued_unit}"`);
      // }

      logActivity({
        action: "UPDATE",
        module: "Record Updated (Issue Firearm)",
        description:
          changes.length > 0
            ? `User "${username}" updated firearm record. Changes: ${changes.join(", ")}`
            : `User "${username}" opened update but no changes were made.`,
        target_id: user_id,
        target_name: username,
      });

      setSelectedRow(updatedLocalRow);
      toast.success("Record updated successfully.");
      setEditOpen(false);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data
          ? JSON.stringify(err.response.data)
          : err?.message || "Update failed";
      toast.error(msg);
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRow) return;

    const gunId = getGunId(selectedRow);
    if (!gunId) {
      toast.error("Missing gun id.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this firearm record?"
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);

      await app.delete(`/api/guns/${gunId}/`);

      toast.success("Record deleted successfully.");
      handleCloseDetails();
      onRefresh();
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data
          ? JSON.stringify(err.response.data)
          : err?.message || "Delete failed";
      toast.error(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "full_name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      valueGetter: (_value, row: any) =>
        row?.full_name ?? row?.issued_to?.full_name ?? "-",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 1,
      minWidth: 120,
      valueGetter: (_value, row: any) => row?.issued_to?.unit ?? "RHQ",
    },
    {
      field: "sub_unit",
      headerName: "Sub Unit",
      flex: 1,
      minWidth: 150,
      valueGetter: (_value, row: any) => row?.issued_to?.sub_unit ?? "RSAO on stock",
    },
    {
      field: "serial_no",
      headerName: "Serial No.",
      flex: 1,
      minWidth: 150,
      valueGetter: (_value, row: any) => getGun(row)?.serial_no ?? "",
    },
    {
      field: "baril",
      headerName: "Make / Type / Caliber",
      flex: 2,
      minWidth: 280,
      valueGetter: (_value, row: any) => {
        const g = getGun(row);
        if (!g) return "";
        return `${g.make ?? ""} / ${g.type ?? ""} / ${g.caliber ?? ""}`.trim();
      },
    },
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
          rowCount={count}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) =>
            onPaginationChange(model.page, model.pageSize)
          }
          disableColumnFilter
          disableDensitySelector
          disableRowSelectionOnClick
          slots={{ toolbar: ExpandSearchToolbar }}
          slotProps={{
            toolbar: {
              searchText,
              onSearchChange,
            } as any,
          }}
          getRowId={(row) => row.id}
          onRowClick={(params: GridRowParams) => handleOpenDetails(params.row)}
        />
      </Box>

      <FirearmDetailsDialog
        open={detailOpen}
        onClose={handleCloseDetails}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        onOpenPar={handleOpenPar}
        onOpenEdit={handleOpenEdit}
        onDelete={handleDelete}
        onOpenTurnIn={handleOpenTurnIn}
        deleteLoading={deleteLoading}
        isAdmin={isAdmin}
        isSuperAdmin={isSuperAdmin}
      />

      <ParImagesDialog
        open={parOpen}
        onClose={handleClosePar}
        selectedImages={selectedImages}
      />

      <TurnInDialog
        open={turnInOpen}
        onClose={handleCloseTurnIn}
        row={turnInRow}
        turnInDate={turnInDate}
        setTurnInDate={setTurnInDate}
        turnInFiles={turnInFiles}
        turnInFileError={turnInFileError}
        turnInSaving={turnInSaving}
        onPickFiles={handlePickFiles}
        onSubmit={handleSubmitTurnIn}
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

export default IssuedTable;