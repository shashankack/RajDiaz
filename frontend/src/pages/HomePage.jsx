import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  LinearProgress,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Snackbar,
  TableFooter,
  TablePagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import api from "../utils/api";

const HomePage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // Dialog state
  const [selectedClient, setSelectedClient] = useState(null); // State for selected client
  const [mode, setMode] = useState("view"); // "view", "edit", "add", "delete"
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    sales: "0.00",
  });
  const [alert, setAlert] = useState({ message: "", type: "", open: false }); // Snackbar notifications

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("clients/");
        const formattedData = response.data.map((client) => ({
          ...client,
          sales: parseFloat(client.sales).toFixed(2),
        }));
        setData(formattedData);
        setFilteredData(formattedData);
      } catch (err) {
        setAlert({
          message: "Failed to fetch data.",
          type: "error",
          open: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = data.filter(
      (client) =>
        `${client.firstName} ${client.lastName}`
          .toLowerCase()
          .includes(lowerSearch) ||
        client.email?.toLowerCase().includes(lowerSearch) ||
        client.phone?.toLowerCase().includes(lowerSearch)
    );
    setFilteredData(filtered);
    setPage(0); // Reset page when search is updated
  }, [search, data]);

  const handleOpen = (client = null, dialogMode = "view") => {
    setSelectedClient(client);
    setMode(dialogMode);
    if (!client && dialogMode === "add") {
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        sales: "0.00",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedClient(null);
    setMode("view");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (mode === "edit") {
      setSelectedClient({
        ...selectedClient,
        [name]:
          name === "sales"
            ? isNaN(value) || value === ""
              ? "0.00"
              : value
            : value,
      });
    } else if (mode === "add") {
      setNewUser({
        ...newUser,
        [name]:
          name === "sales"
            ? isNaN(value) || value === ""
              ? "0.00"
              : value
            : value,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (mode === "edit") {
        await api.put(`clients/${selectedClient.id}/`, selectedClient);
        setData((prevData) =>
          prevData.map((client) =>
            client.id === selectedClient.id
              ? {
                  ...selectedClient,
                  sales: parseFloat(selectedClient.sales).toFixed(2),
                }
              : client
          )
        );
        setAlert({
          message: "Client updated successfully.",
          type: "success",
          open: true,
        });
      } else if (mode === "add") {
        const response = await api.post("clients/", newUser);
        const addedUser = {
          ...response.data,
          sales: parseFloat(response.data.sales).toFixed(2),
        };
        setData((prevData) => [...prevData, addedUser]);
        setAlert({
          message: "Client added successfully.",
          type: "success",
          open: true,
        });
      }
      setFilteredData(data);
      handleClose();
    } catch (err) {
      setAlert({
        message: "Failed to submit data.",
        type: "error",
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`clients/${selectedClient.id}/`);
      setData((prevData) =>
        prevData.filter((client) => client.id !== selectedClient.id)
      );
      setFilteredData((prevData) =>
        prevData.filter((client) => client.id !== selectedClient.id)
      );
      setAlert({
        message: "Client deleted successfully.",
        type: "success",
        open: true,
      });
      handleClose();
    } catch (err) {
      setAlert({
        message: "Failed to delete client.",
        type: "error",
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box p={3}>
      <Box
        display="flex"
        maxWidth={"1200px"}
        margin={"3rem auto"}
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Clients</Typography>
        <Box display="flex" gap={2}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={search}
            autoComplete="off"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen(null, "add")}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {loading && <LinearProgress style={{ marginBottom: 16 }} />}

      <Box
        sx={{
          maxWidth: "1200px", // Set desired max-width
          margin: "0 auto", // Center horizontally
          textAlign: "center",
        }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell
                  sx={{
                    display: { xs: "none", sm: "table-cell" }, // Hide on xs, show on sm+
                  }}
                >
                  Sales (₹)
                </TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && filteredData.length > 0 ? (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((client) => (
                    <TableRow
                      key={client.id}
                      onClick={() => handleOpen(client, "view")}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell>{client.firstName}</TableCell>
                      <TableCell>{client.lastName}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.sales}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpen(client, "edit");
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpen(client, "delete");
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {loading ? "Loading..." : "No data found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15]}
                  count={filteredData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {mode === "view"
            ? "Client Details"
            : mode === "edit"
            ? "Edit Client"
            : mode === "add"
            ? "Add New User"
            : "Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          {mode === "view" || mode === "edit" || mode === "add" ? (
            <>
              <TextField
                label="First Name"
                name="firstName"
                variant="outlined"
                fullWidth
                margin="normal"
                value={
                  selectedClient ? selectedClient.firstName : newUser.firstName
                }
                onChange={handleChange}
                disabled={mode === "view"}
              />
              <TextField
                label="Last Name"
                name="lastName"
                variant="outlined"
                fullWidth
                margin="normal"
                value={
                  selectedClient ? selectedClient.lastName : newUser.lastName
                }
                onChange={handleChange}
                disabled={mode === "view"}
              />
              <TextField
                label="Email"
                name="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={selectedClient ? selectedClient.email : newUser.email}
                onChange={handleChange}
                disabled={mode === "view"}
              />
              <TextField
                label="Phone"
                name="phone"
                variant="outlined"
                fullWidth
                margin="normal"
                value={selectedClient ? selectedClient.phone : newUser.phone}
                onChange={handleChange}
                disabled={mode === "view"}
              />
              <TextField
                label="Address"
                name="address"
                variant="outlined"
                fullWidth
                margin="normal"
                value={
                  selectedClient ? selectedClient.address : newUser.address
                }
                onChange={handleChange}
                disabled={mode === "view"}
              />
              <TextField
                label="Sales (₹)"
                name="sales"
                variant="outlined"
                fullWidth
                margin="normal"
                value={selectedClient ? selectedClient.sales : newUser.sales}
                onChange={handleChange}
                disabled={mode === "view"}
              />
            </>
          ) : (
            <Typography variant="body1">
              Are you sure you want to delete this client?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          {(mode === "edit" || mode === "add") && (
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {mode === "edit" ? "Save" : "Create"}
            </Button>
          )}
          {mode === "delete" && (
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.type}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;
