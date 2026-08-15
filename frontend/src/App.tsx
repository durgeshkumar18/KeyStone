import { useEffect, useState } from "react";
import "./App.css";

// ============================================================
// INTERFACES
// ============================================================

interface DashboardData {
  totalCustomers: number;
  totalTechnicians: number;
  totalServiceRequests: number;
  totalWorkOrders: number;
  completedRequests: number;
  pendingRequests: number;
  openWorkOrders: number;
  closedWorkOrders: number;
}

interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
}

interface Technician {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  active: boolean;
}

interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  customerName: string;
  customerId: number;
  priority: string;
  status: string;
  technicianName?: string;
  createdAt: string;
}

interface WorkOrder {
  id: number;
  title: string;
  description: string;
  customerName: string;
  customerId: number;
  priority: string;
  status: string;
  scheduledDate: string;
  createdAt: string;
}

// ============================================================
// PAGE TYPE
// ============================================================

type Page =
  | "dashboard"
  | "customers"
  | "technicians"
  | "serviceRequests"
  | "workOrders";

// ============================================================
// APP
// ============================================================

function App() {
  // ============================================================
  // LOGIN
  // ============================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // ============================================================
  // DATA
  // ============================================================

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [technicians, setTechnicians] =
    useState<Technician[]>([]);

  const [serviceRequests, setServiceRequests] =
    useState<ServiceRequest[]>([]);

  const [workOrders, setWorkOrders] =
    useState<WorkOrder[]>([]);

  // ============================================================
  // UI
  // ============================================================

  const [page, setPage] =
    useState<Page>("dashboard");

  const [loading, setLoading] =
    useState(false);

  // ============================================================
  // CUSTOMER FORM
  // ============================================================

  const [showCustomerForm, setShowCustomerForm] =
    useState(false);

  const [editingCustomerId, setEditingCustomerId] =
    useState<number | null>(null);

  const [customerForm, setCustomerForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  // ============================================================
  // TECHNICIAN FORM
  // ============================================================

  const [showTechnicianForm, setShowTechnicianForm] =
    useState(false);

  const [editingTechnicianId, setEditingTechnicianId] =
    useState<number | null>(null);

  const [technicianForm, setTechnicianForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "",
  });

  // ============================================================
  // SERVICE REQUEST FORM
  // ============================================================

  const [showServiceRequestForm, setShowServiceRequestForm] =
    useState(false);

  const [serviceRequestForm, setServiceRequestForm] =
    useState({
      title: "",
      description: "",
      customerId: "",
      priority: "MEDIUM",
    });

  // ============================================================
  // WORK ORDER FORM
  // ============================================================

  const [showWorkOrderForm, setShowWorkOrderForm] =
    useState(false);

  const [workOrderForm, setWorkOrderForm] =
    useState({
      title: "",
      description: "",
      customerId: "",
      priority: "MEDIUM",
      status: "OPEN",
      scheduledDate: "",
    });

  // ============================================================
  // TOKEN
  // ============================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ============================================================
  // INITIAL LOGIN CHECK
  // ============================================================

  useEffect(() => {
    const token = getToken();

    if (token) {
      setLoggedIn(true);
      loadDashboard(token);
    }
  }, []);

  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setMessage("Logging in...");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Invalid email or password"
        );
      }

      const data = await response.json();

      localStorage.setItem(
        "token",
        data.token
      );

      setLoggedIn(true);
      setMessage("Login successful!");

      await loadDashboard(data.token);

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    }
  };

  // ============================================================
  // DASHBOARD
  // ============================================================

  const loadDashboard = async (
    jwtToken: string
  ) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/dashboard",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load dashboard"
        );
      }

      const data =
        await response.json();

      setDashboard(data);

    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );
    }
  };

  // ============================================================
  // CUSTOMERS
  // ============================================================

  const loadCustomers = async (
    jwtToken: string
  ) => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/customers",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load customers"
        );
      }

      const data =
        await response.json();

      setCustomers(data);

    } catch (error) {
      console.error(
        "Customers error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CUSTOMER FORM RESET
  // ============================================================

  const resetCustomerForm = () => {
    setCustomerForm({
      fullName: "",
      email: "",
      phone: "",
      address: "",
    });

    setEditingCustomerId(null);
    setShowCustomerForm(false);
  };

  // ============================================================
  // CREATE / UPDATE CUSTOMER
  // ============================================================

  const handleSaveCustomer = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      setMessage("Authentication required");
      return;
    }

    try {
      setLoading(true);

      const isEditing =
        editingCustomerId !== null;

      const url = isEditing
        ? `http://localhost:8080/api/customers/${editingCustomerId}`
        : "http://localhost:8080/api/customers";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(customerForm),
      });

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            "Failed to save customer"
        );
      }

      resetCustomerForm();

      await loadCustomers(token);
      await loadDashboard(token);

      setMessage(
        isEditing
          ? "Customer updated successfully!"
          : "Customer created successfully!"
      );

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save customer"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // EDIT CUSTOMER
  // ============================================================

  const handleEditCustomer = (
    customer: Customer
  ) => {
    setCustomerForm({
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });

    setEditingCustomerId(customer.id);
    setShowCustomerForm(true);
  };

  // ============================================================
  // DELETE CUSTOMER
  // ============================================================

  const handleDeleteCustomer = async (
    id: number
  ) => {
    const token = getToken();

    if (!token) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this customer?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/api/customers/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            "Failed to delete customer"
        );
      }

      await loadCustomers(token);
      await loadDashboard(token);

      setMessage(
        "Customer deleted successfully!"
      );

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete customer"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // TECHNICIANS
  // ============================================================

  const loadTechnicians = async (
    jwtToken: string
  ) => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/technicians",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load technicians"
        );
      }

      const data =
        await response.json();

      setTechnicians(data);

    } catch (error) {
      console.error(
        "Technicians error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // TECHNICIAN FORM RESET
  // ============================================================

  const resetTechnicianForm = () => {
    setTechnicianForm({
      fullName: "",
      email: "",
      phone: "",
      specialization: "",
    });

    setEditingTechnicianId(null);
    setShowTechnicianForm(false);
  };

  // ============================================================
  // CREATE / UPDATE TECHNICIAN
  // ============================================================

  const handleSaveTechnician = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      setMessage("Authentication required");
      return;
    }

    try {
      setLoading(true);

      const isEditing =
        editingTechnicianId !== null;

      const url = isEditing
        ? `http://localhost:8080/api/technicians/${editingTechnicianId}`
        : "http://localhost:8080/api/technicians";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          technicianForm
        ),
      });

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            "Failed to save technician"
        );
      }

      resetTechnicianForm();

      await loadTechnicians(token);
      await loadDashboard(token);

      setMessage(
        isEditing
          ? "Technician updated successfully!"
          : "Technician created successfully!"
      );

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save technician"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // EDIT TECHNICIAN
  // ============================================================

  const handleEditTechnician = (
    technician: Technician
  ) => {
    setTechnicianForm({
      fullName: technician.fullName,
      email: technician.email,
      phone: technician.phone,
      specialization:
        technician.specialization || "",
    });

    setEditingTechnicianId(
      technician.id
    );

    setShowTechnicianForm(true);
  };

  // ============================================================
  // DELETE TECHNICIAN
  // ============================================================

  const handleDeleteTechnician = async (
    id: number
  ) => {
    const token = getToken();

    if (!token) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this technician?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/api/technicians/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            "Failed to delete technician"
        );
      }

      await loadTechnicians(token);
      await loadDashboard(token);

      setMessage(
        "Technician deleted successfully!"
      );

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete technician"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SERVICE REQUESTS
  // ============================================================

  const loadServiceRequests = async (
    jwtToken: string
  ) => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/service-requests",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load service requests"
        );
      }

      const data =
        await response.json();

      setServiceRequests(data);

    } catch (error) {
      console.error(
        "Service Requests error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CREATE SERVICE REQUEST
  // ============================================================

  const handleCreateServiceRequest =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      const token = getToken();

      if (!token) {
        setMessage(
          "Authentication required"
        );
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:8080/api/service-requests",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title:
                serviceRequestForm.title,
              description:
                serviceRequestForm.description,
              customerId:
                Number(
                  serviceRequestForm.customerId
                ),
              priority:
                serviceRequestForm.priority,
            }),
          }
        );

        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            errorText ||
              "Failed to create service request"
          );
        }

        setServiceRequestForm({
          title: "",
          description: "",
          customerId: "",
          priority: "MEDIUM",
        });

        setShowServiceRequestForm(
          false
        );

        await loadServiceRequests(
          token
        );

        await loadDashboard(token);

        setMessage(
          "Service request created successfully!"
        );

      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to create service request"
        );
      } finally {
        setLoading(false);
      }
    };

  // ============================================================
  // WORK ORDERS
  // ============================================================

  const loadWorkOrders = async (
    jwtToken: string
  ) => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/workorders",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load work orders"
        );
      }

      const data =
        await response.json();

      setWorkOrders(data);

    } catch (error) {
      console.error(
        "Work Orders error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CREATE WORK ORDER
  // ============================================================

  const handleCreateWorkOrder =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      const token = getToken();

      if (!token) {
        setMessage(
          "Authentication required"
        );
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:8080/api/workorders",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title:
                workOrderForm.title,
              description:
                workOrderForm.description,
              customerId:
                Number(
                  workOrderForm.customerId
                ),
              priority:
                workOrderForm.priority,
              status:
                workOrderForm.status,
              scheduledDate:
                workOrderForm.scheduledDate ||
                null,
            }),
          }
        );

        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            errorText ||
              "Failed to create work order"
          );
        }

        setWorkOrderForm({
          title: "",
          description: "",
          customerId: "",
          priority: "MEDIUM",
          status: "OPEN",
          scheduledDate: "",
        });

        setShowWorkOrderForm(false);

        await loadWorkOrders(token);
        await loadDashboard(token);

        setMessage(
          "Work order created successfully!"
        );

      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to create work order"
        );
      } finally {
        setLoading(false);
      }
    };

  // ============================================================
  // NAVIGATION
  // ============================================================

  const openDashboard = () => {
    setPage("dashboard");

    const token = getToken();

    if (token) {
      loadDashboard(token);
    }
  };

  const openCustomers = () => {
    setPage("customers");

    const token = getToken();

    if (token) {
      loadCustomers(token);
    }
  };

  const openTechnicians = () => {
    setPage("technicians");

    const token = getToken();

    if (token) {
      loadTechnicians(token);
    }
  };

  const openServiceRequests = () => {
    setPage("serviceRequests");

    const token = getToken();

    if (token) {
      loadServiceRequests(token);
    }
  };

  const openWorkOrders = () => {
    setPage("workOrders");

    const token = getToken();

    if (token) {
      loadWorkOrders(token);
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    setLoggedIn(false);

    setDashboard(null);
    setCustomers([]);
    setTechnicians([]);
    setServiceRequests([]);
    setWorkOrders([]);

    setEmail("");
    setPassword("");
    setMessage("");

    setPage("dashboard");

    setShowCustomerForm(false);
    setShowTechnicianForm(false);
    setShowServiceRequestForm(false);
    setShowWorkOrderForm(false);
  };

  // ============================================================
  // LOGGED-IN APPLICATION
  // ============================================================

  if (loggedIn) {
    return (
      <div className="dashboard-page">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>
            <h1>Keystone</h1>

            <p>
              Service Management System
            </p>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </header>

        {/* NAVIGATION */}

        <nav className="navigation">

          <button
            className={
              page === "dashboard"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={openDashboard}
          >
            Dashboard
          </button>

          <button
            className={
              page === "customers"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={openCustomers}
          >
            Customers
          </button>

          <button
            className={
              page === "technicians"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={openTechnicians}
          >
            Technicians
          </button>

          <button
            className={
              page === "serviceRequests"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={
              openServiceRequests
            }
          >
            Service Requests
          </button>

          <button
            className={
              page === "workOrders"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={openWorkOrders}
          >
            Work Orders
          </button>

        </nav>

        {/* MAIN */}

        <main className="dashboard-content">

          {/* ==================================================
              GLOBAL MESSAGE
          ================================================== */}

          {message && (
            <p className="message">
              {message}
            </p>
          )}

          {/* ==================================================
              DASHBOARD
          ================================================== */}

          {page === "dashboard" && (
            <>
              <h2>Dashboard</h2>

              {!dashboard ? (
                <p className="loading">
                  Loading dashboard...
                </p>
              ) : (
                <div className="dashboard-grid">

                  <div className="dashboard-card">
                    <h3>
                      Total Customers
                    </h3>

                    <strong>
                      {
                        dashboard.totalCustomers
                      }
                    </strong>
                  </div>

                  <div className="dashboard-card">
                    <h3>
                      Total Technicians
                    </h3>

                    <strong>
                      {
                        dashboard.totalTechnicians
                      }
                    </strong>
                  </div>

                  <div className="dashboard-card">
                    <h3>
                      Total Service Requests
                    </h3>

                    <strong>
                      {
                        dashboard.totalServiceRequests
                      }
                    </strong>
                  </div>

                  <div className="dashboard-card">
                    <h3>
                      Total Work Orders
                    </h3>

                    <strong>
                      {
                        dashboard.totalWorkOrders
                      }
                    </strong>
                  </div>

                  <div className="dashboard-card">
                    <h3>
                      Completed Requests
                    </h3>

                    <strong>
                      {
                        dashboard.completedRequests
                      }
                    </strong>
                  </div>

                  <div className="dashboard-card">
                    <h3>
                      Pending Requests
                    </h3>

                    <strong>
                      {
                        dashboard.pendingRequests
                      }
                    </strong>
                  </div>

                  <div className="dashboard-card">
                    <h3>
                      Open Work Orders
                    </h3>

                    <strong>
                      {
                        dashboard.openWorkOrders
                      }
                    </strong>
                  </div>

                  <div className="dashboard-card">
                    <h3>
                      Closed Work Orders
                    </h3>

                    <strong>
                      {
                        dashboard.closedWorkOrders
                      }
                    </strong>
                  </div>

                </div>
              )}
            </>
          )}

          {/* ==================================================
              CUSTOMERS
          ================================================== */}

          {page === "customers" && (
            <>
              <div className="page-title">

                <h2>Customers</h2>

                <div>

                  <button
                    className="refresh-button"
                    onClick={() =>
                      setShowCustomerForm(
                        !showCustomerForm
                      )
                    }
                  >
                    {showCustomerForm
                      ? "Cancel"
                      : editingCustomerId !== null
                      ? "Cancel Edit"
                      : "+ Add Customer"}
                  </button>

                  <button
                    className="refresh-button"
                    onClick={openCustomers}
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    Refresh
                  </button>

                </div>

              </div>

              {/* CUSTOMER FORM */}

              {showCustomerForm && (
                <form
                  className="customer-form"
                  onSubmit={
                    handleSaveCustomer
                  }
                >

                  <h3>
                    {editingCustomerId !== null
                      ? "Edit Customer"
                      : "Add New Customer"}
                  </h3>

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={
                      customerForm.fullName
                    }
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        fullName:
                          e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={
                      customerForm.email
                    }
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        email:
                          e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Phone"
                    value={
                      customerForm.phone
                    }
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        phone:
                          e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Address"
                    value={
                      customerForm.address
                    }
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        address:
                          e.target.value,
                      })
                    }
                    required
                  />

                  <button
                    type="submit"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editingCustomerId !==
                        null
                      ? "Update Customer"
                      : "Save Customer"}
                  </button>

                </form>
              )}

              {loading ? (
                <p className="loading">
                  Loading customers...
                </p>
              ) : customers.length === 0 ? (
                <p className="empty">
                  No customers found.
                </p>
              ) : (
                <div className="data-grid">

                  {customers.map(
                    (customer) => (
                      <div
                        className="data-card"
                        key={customer.id}
                      >

                        <h3>
                          {customer.fullName}
                        </h3>

                        <p>
                          <strong>ID:</strong>{" "}
                          {customer.id}
                        </p>

                        <p>
                          <strong>Email:</strong>{" "}
                          {customer.email}
                        </p>

                        <p>
                          <strong>Phone:</strong>{" "}
                          {customer.phone}
                        </p>

                        <p>
                          <strong>
                            Address:
                          </strong>{" "}
                          {customer.address}
                        </p>

                        <p>
                          <strong>
                            Status:
                          </strong>{" "}

                          <span
                            className={
                              customer.active
                                ? "status active"
                                : "status inactive"
                            }
                          >
                            {customer.active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </p>

                        <div className="card-actions">

                          <button
                            className="refresh-button"
                            onClick={() =>
                              handleEditCustomer(
                                customer
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="logout-button"
                            onClick={() =>
                              handleDeleteCustomer(
                                customer.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}
            </>
          )}

          {/* ==================================================
              TECHNICIANS
          ================================================== */}

          {page === "technicians" && (
            <>
              <div className="page-title">

                <h2>Technicians</h2>

                <div>

                  <button
                    className="refresh-button"
                    onClick={() =>
                      setShowTechnicianForm(
                        !showTechnicianForm
                      )
                    }
                  >
                    {showTechnicianForm
                      ? "Cancel"
                      : "+ Add Technician"}
                  </button>

                  <button
                    className="refresh-button"
                    onClick={
                      openTechnicians
                    }
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    Refresh
                  </button>

                </div>

              </div>

              {/* TECHNICIAN FORM */}

              {showTechnicianForm && (
                <form
                  className="customer-form"
                  onSubmit={
                    handleSaveTechnician
                  }
                >

                  <h3>
                    {editingTechnicianId !==
                    null
                      ? "Edit Technician"
                      : "Add New Technician"}
                  </h3>

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={
                      technicianForm.fullName
                    }
                    onChange={(e) =>
                      setTechnicianForm({
                        ...technicianForm,
                        fullName:
                          e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={
                      technicianForm.email
                    }
                    onChange={(e) =>
                      setTechnicianForm({
                        ...technicianForm,
                        email:
                          e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Phone"
                    value={
                      technicianForm.phone
                    }
                    onChange={(e) =>
                      setTechnicianForm({
                        ...technicianForm,
                        phone:
                          e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Specialization"
                    value={
                      technicianForm.specialization
                    }
                    onChange={(e) =>
                      setTechnicianForm({
                        ...technicianForm,
                        specialization:
                          e.target.value,
                      })
                    }
                  />

                  <button
                    type="submit"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editingTechnicianId !==
                        null
                      ? "Update Technician"
                      : "Save Technician"}
                  </button>

                </form>
              )}

              {loading ? (
                <p className="loading">
                  Loading technicians...
                </p>
              ) : technicians.length === 0 ? (
                <p className="empty">
                  No technicians found.
                </p>
              ) : (
                <div className="data-grid">

                  {technicians.map(
                    (technician) => (
                      <div
                        className="data-card"
                        key={technician.id}
                      >

                        <h3>
                          {
                            technician.fullName
                          }
                        </h3>

                        <p>
                          <strong>ID:</strong>{" "}
                          {technician.id}
                        </p>

                        <p>
                          <strong>Email:</strong>{" "}
                          {technician.email}
                        </p>

                        <p>
                          <strong>Phone:</strong>{" "}
                          {technician.phone}
                        </p>

                        <p>
                          <strong>
                            Specialization:
                          </strong>{" "}
                          {
                            technician.specialization
                          }
                        </p>

                        <p>
                          <strong>
                            Status:
                          </strong>{" "}

                          <span
                            className={
                              technician.active
                                ? "status active"
                                : "status inactive"
                            }
                          >
                            {technician.active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </p>

                        <div className="card-actions">

                          <button
                            className="refresh-button"
                            onClick={() =>
                              handleEditTechnician(
                                technician
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="logout-button"
                            onClick={() =>
                              handleDeleteTechnician(
                                technician.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}
            </>
          )}

          {/* ==================================================
              SERVICE REQUESTS
          ================================================== */}

          {page === "serviceRequests" && (
            <>
              <div className="page-title">

                <h2>
                  Service Requests
                </h2>

                <div>

                  <button
                    className="refresh-button"
                    onClick={() =>
                      setShowServiceRequestForm(
                        !showServiceRequestForm
                      )
                    }
                  >
                    {showServiceRequestForm
                      ? "Cancel"
                      : "+ Create Request"}
                  </button>

                  <button
                    className="refresh-button"
                    onClick={
                      openServiceRequests
                    }
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    Refresh
                  </button>

                </div>

              </div>

              {/* SERVICE REQUEST FORM */}

              {showServiceRequestForm && (
                <form
                  className="customer-form"
                  onSubmit={
                    handleCreateServiceRequest
                  }
                >

                  <h3>
                    Create Service Request
                  </h3>

                  <input
                    type="text"
                    placeholder="Title"
                    value={
                      serviceRequestForm.title
                    }
                    onChange={(e) =>
                      setServiceRequestForm({
                        ...serviceRequestForm,
                        title:
                          e.target.value,
                      })
                    }
                    required
                  />

                  <textarea
                    placeholder="Description"
                    value={
                      serviceRequestForm.description
                    }
                    onChange={(e) =>
                      setServiceRequestForm({
                        ...serviceRequestForm,
                        description:
                          e.target.value,
                      })
                    }
                    required
                  />

                  <select
                    value={
                      serviceRequestForm.customerId
                    }
                    onChange={(e) =>
                      setServiceRequestForm({
                        ...serviceRequestForm,
                        customerId:
                          e.target.value,
                      })
                    }
                    required
                  >

                    <option value="">
                      Select Customer
                    </option>

                    {customers.map(
                      (customer) => (
                        <option
                          key={customer.id}
                          value={customer.id}
                        >
                          {customer.fullName}
                        </option>
                      )
                    )}

                  </select>

                  <select
                    value={
                      serviceRequestForm.priority
                    }
                    onChange={(e) =>
                      setServiceRequestForm({
                        ...serviceRequestForm,
                        priority:
                          e.target.value,
                      })
                    }
                  >

                    <option value="LOW">
                      LOW
                    </option>

                    <option value="MEDIUM">
                      MEDIUM
                    </option>

                    <option value="HIGH">
                      HIGH
                    </option>

                    <option value="URGENT">
                      URGENT
                    </option>

                  </select>

                  <button
                    type="submit"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating..."
                      : "Create Service Request"}
                  </button>

                </form>
              )}

              {loading ? (
                <p className="loading">
                  Loading service requests...
                </p>
              ) : serviceRequests.length ===
                0 ? (
                <p className="empty">
                  No service requests found.
                </p>
              ) : (
                <div className="data-grid">

                  {serviceRequests.map(
                    (request) => (
                      <div
                        className="data-card"
                        key={request.id}
                      >

                        <h3>
                          {request.title}
                        </h3>

                        <p>
                          <strong>ID:</strong>{" "}
                          {request.id}
                        </p>

                        <p>
                          <strong>
                            Description:
                          </strong>{" "}
                          {request.description}
                        </p>

                        <p>
                          <strong>
                            Customer:
                          </strong>{" "}
                          {request.customerName}
                        </p>

                        <p>
                          <strong>
                            Customer ID:
                          </strong>{" "}
                          {request.customerId}
                        </p>

                        <p>
                          <strong>
                            Priority:
                          </strong>{" "}

                          <span className="priority">
                            {request.priority}
                          </span>
                        </p>

                        <p>
                          <strong>
                            Status:
                          </strong>{" "}

                          <span className="status">
                            {request.status}
                          </span>
                        </p>

                        <p>
                          <strong>
                            Technician:
                          </strong>{" "}
                          {request.technicianName ||
                            "Not Assigned"}
                        </p>

                        <p>
                          <strong>
                            Created:
                          </strong>{" "}

                          {request.createdAt
                            ? new Date(
                                request.createdAt
                              ).toLocaleString()
                            : "N/A"}
                        </p>

                      </div>
                    )
                  )}

                </div>
              )}
            </>
          )}

          {/* ==================================================
              WORK ORDERS
          ================================================== */}

          {page === "workOrders" && (
            <>
              <div className="page-title">

                <h2>Work Orders</h2>

                <div>

                  <button
                    className="refresh-button"
                    onClick={() =>
                      setShowWorkOrderForm(
                        !showWorkOrderForm
                      )
                    }
                  >
                    {showWorkOrderForm
                      ? "Cancel"
                      : "+ Create Work Order"}
                  </button>

                  <button
                    className="refresh-button"
                    onClick={
                      openWorkOrders
                    }
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    Refresh
                  </button>

                </div>

              </div>

              {/* WORK ORDER FORM */}

              {showWorkOrderForm && (
                <form
                  className="customer-form"
                  onSubmit={
                    handleCreateWorkOrder
                  }
                >

                  <h3>
                    Create Work Order
                  </h3>

                  <input
                    type="text"
                    placeholder="Title"
                    value={
                      workOrderForm.title
                    }
                    onChange={(e) =>
                      setWorkOrderForm({
                        ...workOrderForm,
                        title:
                          e.target.value,
                      })
                    }
                    required
                  />

                  <textarea
                    placeholder="Description"
                    value={
                      workOrderForm.description
                    }
                    onChange={(e) =>
                      setWorkOrderForm({
                        ...workOrderForm,
                        description:
                          e.target.value,
                      })
                    }
                    required
                  />

                  <select
                    value={
                      workOrderForm.customerId
                    }
                    onChange={(e) =>
                      setWorkOrderForm({
                        ...workOrderForm,
                        customerId:
                          e.target.value,
                      })
                    }
                    required
                  >

                    <option value="">
                      Select Customer
                    </option>

                    {customers.map(
                      (customer) => (
                        <option
                          key={customer.id}
                          value={customer.id}
                        >
                          {customer.fullName}
                        </option>
                      )
                    )}

                  </select>

                  <select
                    value={
                      workOrderForm.priority
                    }
                    onChange={(e) =>
                      setWorkOrderForm({
                        ...workOrderForm,
                        priority:
                          e.target.value,
                      })
                    }
                  >

                    <option value="LOW">
                      LOW
                    </option>

                    <option value="MEDIUM">
                      MEDIUM
                    </option>

                    <option value="HIGH">
                      HIGH
                    </option>

                    <option value="URGENT">
                      URGENT
                    </option>

                  </select>

                  <select
                    value={
                      workOrderForm.status
                    }
                    onChange={(e) =>
                      setWorkOrderForm({
                        ...workOrderForm,
                        status:
                          e.target.value,
                      })
                    }
                  >

                    <option value="OPEN">
                      OPEN
                    </option>

                    <option value="IN_PROGRESS">
                      IN_PROGRESS
                    </option>

                    <option value="COMPLETED">
                      COMPLETED
                    </option>

                    <option value="CLOSED">
                      CLOSED
                    </option>

                  </select>

                  <input
                    type="date"
                    value={
                      workOrderForm.scheduledDate
                    }
                    onChange={(e) =>
                      setWorkOrderForm({
                        ...workOrderForm,
                        scheduledDate:
                          e.target.value,
                      })
                    }
                  />

                  <button
                    type="submit"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating..."
                      : "Create Work Order"}
                  </button>

                </form>
              )}

              {loading ? (
                <p className="loading">
                  Loading work orders...
                </p>
              ) : workOrders.length ===
                0 ? (
                <p className="empty">
                  No work orders found.
                </p>
              ) : (
                <div className="data-grid">

                  {workOrders.map(
                    (order) => (
                      <div
                        className="data-card"
                        key={order.id}
                      >

                        <h3>
                          {order.title}
                        </h3>

                        <p>
                          <strong>ID:</strong>{" "}
                          {order.id}
                        </p>

                        <p>
                          <strong>
                            Description:
                          </strong>{" "}
                          {order.description}
                        </p>

                        <p>
                          <strong>
                            Customer:
                          </strong>{" "}
                          {order.customerName}
                        </p>

                        <p>
                          <strong>
                            Customer ID:
                          </strong>{" "}
                          {order.customerId}
                        </p>

                        <p>
                          <strong>
                            Priority:
                          </strong>{" "}

                          <span className="priority">
                            {order.priority}
                          </span>
                        </p>

                        <p>
                          <strong>
                            Status:
                          </strong>{" "}

                          <span className="status">
                            {order.status}
                          </span>
                        </p>

                        <p>
                          <strong>
                            Scheduled Date:
                          </strong>{" "}
                          {order.scheduledDate ||
                            "Not Scheduled"}
                        </p>

                        <p>
                          <strong>
                            Created:
                          </strong>{" "}

                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleString()
                            : "N/A"}
                        </p>

                      </div>
                    )
                  )}

                </div>
              )}
            </>
          )}

        </main>
      </div>
    );
  }

  // ============================================================
  // LOGIN PAGE
  // ============================================================

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Keystone</h1>

        <p>
          Service Management System
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default App;