import { useEffect, useState, type FormEvent } from "react";
import "./App.css";

const API = "http://localhost:8080/api";

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
  customerId: number;
  customerName: string;
  priority: string;
  status: string;
  scheduledDate: string;
  createdAt: string;
}

type Page =
  | "dashboard"
  | "customers"
  | "technicians"
  | "serviceRequests"
  | "workOrders";

const statuses = [
  "OPEN",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const priorities = ["LOW", "MEDIUM", "HIGH"];

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const [page, setPage] = useState<Page>("dashboard");
  const [loading, setLoading] = useState(false);

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

  /* ============================================================
     CUSTOMER STATE
     ============================================================ */

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

  /* ============================================================
     TECHNICIAN STATE
     ============================================================ */

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

  /* ============================================================
     SERVICE REQUEST STATE
     ============================================================ */

  const [showServiceRequestForm, setShowServiceRequestForm] =
    useState(false);

  const [editingServiceRequestId, setEditingServiceRequestId] =
    useState<number | null>(null);

  const [serviceRequestForm, setServiceRequestForm] = useState({
    title: "",
    description: "",
    customerId: "",
    priority: "MEDIUM",
  });

  /* ============================================================
     WORK ORDER STATE
     ============================================================ */

  const [showWorkOrderForm, setShowWorkOrderForm] =
    useState(false);

  const [editingWorkOrderId, setEditingWorkOrderId] =
    useState<number | null>(null);

  const [workOrderForm, setWorkOrderForm] = useState({
    title: "",
    description: "",
    customerId: "",
    priority: "MEDIUM",
    status: "OPEN",
    scheduledDate: "",
  });

  const token = () =>
    localStorage.getItem("token");

  /* ============================================================
     GET DATA
     ============================================================ */

  async function getData<T>(
    endpoint: string
  ): Promise<T> {
    const currentToken = token();

    if (!currentToken) {
      throw new Error(
        "Session expired. Please login again."
      );
    }

    const response = await fetch(
      `${API}${endpoint}`,
      {
        headers: {
          Authorization:
            `Bearer ${currentToken}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Session expired. Please login again."
        );
      }

      throw new Error(
        `Request failed (${response.status})`
      );
    }

    return response.json();
  }

  /* ============================================================
     DASHBOARD
     ============================================================ */

  async function loadDashboard() {
    try {
      setLoading(true);

      const data =
        await getData<DashboardData>(
          "/dashboard"
        );

      setDashboard(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  /* ============================================================
     CUSTOMERS
     ============================================================ */

  async function loadCustomers() {
    try {
      setLoading(true);

      const data =
        await getData<Customer[]>(
          "/customers"
        );

      setCustomers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function resetCustomerForm() {
    setCustomerForm({
      fullName: "",
      email: "",
      phone: "",
      address: "",
    });

    setEditingCustomerId(null);
    setShowCustomerForm(false);
  }

  function startAddCustomer() {
    setCustomerForm({
      fullName: "",
      email: "",
      phone: "",
      address: "",
    });

    setEditingCustomerId(null);
    setShowCustomerForm(true);
  }

  function editCustomer(
    customer: Customer
  ) {
    setCustomerForm({
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });

    setEditingCustomerId(customer.id);
    setShowCustomerForm(true);
  }

  async function saveCustomer(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      const currentToken = token();

      if (!currentToken) {
        throw new Error(
          "Session expired. Please login again."
        );
      }

      const editing =
        editingCustomerId !== null;

      const endpoint = editing
        ? `/customers/${editingCustomerId}`
        : "/customers";

      const response = await fetch(
        `${API}${endpoint}`,
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${currentToken}`,
          },
          body: JSON.stringify(
            customerForm
          ),
        }
      );

      if (!response.ok) {
        const text =
          await response.text();

        throw new Error(
          text ||
            `Customer request failed (${response.status})`
        );
      }

      resetCustomerForm();
      await loadCustomers();
      await loadDashboard();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to save customer."
      );
    }
  }

  async function deleteCustomer(
    id: number
  ) {
    if (
      !window.confirm(
        "Are you sure you want to delete this customer?"
      )
    ) {
      return;
    }

    try {
      const currentToken = token();

      if (!currentToken) {
        throw new Error(
          "Session expired. Please login again."
        );
      }

      const response =
        await fetch(
          `${API}/customers/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization:
                `Bearer ${currentToken}`,
            },
          }
        );

      if (!response.ok) {
        const text =
          await response.text();

        throw new Error(
          text ||
            `Delete failed (${response.status})`
        );
      }

      await loadCustomers();
      await loadDashboard();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete customer."
      );
    }
  }

  /* ============================================================
     TECHNICIANS
     ============================================================ */

  async function loadTechnicians() {
    try {
      setLoading(true);

      const data =
        await getData<Technician[]>(
          "/technicians"
        );

      setTechnicians(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function resetTechnicianForm() {
    setTechnicianForm({
      fullName: "",
      email: "",
      phone: "",
      specialization: "",
    });

    setEditingTechnicianId(null);
    setShowTechnicianForm(false);
  }

  function startAddTechnician() {
    setTechnicianForm({
      fullName: "",
      email: "",
      phone: "",
      specialization: "",
    });

    setEditingTechnicianId(null);
    setShowTechnicianForm(true);
  }

  function editTechnician(
    technician: Technician
  ) {
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
  }

  async function saveTechnician(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      const currentToken = token();

      if (!currentToken) {
        throw new Error(
          "Session expired. Please login again."
        );
      }

      const editing =
        editingTechnicianId !== null;

      const endpoint = editing
        ? `/technicians/${editingTechnicianId}`
        : "/technicians";

      const response = await fetch(
        `${API}${endpoint}`,
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${currentToken}`,
          },
          body: JSON.stringify(
            technicianForm
          ),
        }
      );

      if (!response.ok) {
        const text =
          await response.text();

        throw new Error(
          text ||
            `Technician request failed (${response.status})`
        );
      }

      resetTechnicianForm();
      await loadTechnicians();
      await loadDashboard();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to save technician."
      );
    }
  }

  async function deleteTechnician(
    id: number
  ) {
    if (
      !window.confirm(
        "Are you sure you want to delete this technician?"
      )
    ) {
      return;
    }

    try {
      const currentToken = token();

      if (!currentToken) {
        throw new Error(
          "Session expired. Please login again."
        );
      }

      const response =
        await fetch(
          `${API}/technicians/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization:
                `Bearer ${currentToken}`,
            },
          }
        );

      if (!response.ok) {
        const text =
          await response.text();

        throw new Error(
          text ||
            `Delete failed (${response.status})`
        );
      }

      await loadTechnicians();
      await loadDashboard();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete technician."
      );
    }
  }

  /* ============================================================
     SERVICE REQUESTS
     ============================================================ */

  async function loadServiceRequests() {
    try {
      setLoading(true);

      const data =
        await getData<ServiceRequest[]>(
          "/service-requests"
        );

      setServiceRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function resetServiceRequestForm() {
    setServiceRequestForm({
      title: "",
      description: "",
      customerId: "",
      priority: "MEDIUM",
    });

    setEditingServiceRequestId(null);
    setShowServiceRequestForm(false);
  }

  function startAddServiceRequest() {
    setServiceRequestForm({
      title: "",
      description: "",
      customerId:
        customers.length > 0
          ? String(customers[0].id)
          : "",
      priority: "MEDIUM",
    });

    setEditingServiceRequestId(null);
    setShowServiceRequestForm(true);
  }

  function editServiceRequest(
    request: ServiceRequest
  ) {
    setServiceRequestForm({
      title: request.title,
      description:
        request.description,
      customerId:
        String(request.customerId),
      priority:
        request.priority || "MEDIUM",
    });

    setEditingServiceRequestId(
      request.id
    );

    setShowServiceRequestForm(true);
  }

  async function saveServiceRequest(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!serviceRequestForm.customerId) {
      alert("Please select a customer.");
      return;
    }

    try {
      const currentToken = token();

      if (!currentToken) {
        throw new Error(
          "Session expired. Please login again."
        );
      }

      const editing =
        editingServiceRequestId !== null;

      const endpoint = editing
        ? `/service-requests/${editingServiceRequestId}`
        : "/service-requests";

      const payload = {
        title:
          serviceRequestForm.title,
        description:
          serviceRequestForm.description,
        customerId: Number(
          serviceRequestForm.customerId
        ),
        priority:
          serviceRequestForm.priority,
      };

      const response = await fetch(
        `${API}${endpoint}`,
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${currentToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const text =
          await response.text();

        throw new Error(
          text ||
            `Service request failed (${response.status})`
        );
      }

      resetServiceRequestForm();
      await loadServiceRequests();
      await loadDashboard();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to save service request."
      );
    }
  }

  async function deleteServiceRequest(
    id: number
  ) {
    if (
      !window.confirm(
        "Are you sure you want to delete this service request?"
      )
    ) {
      return;
    }

    try {
      const currentToken = token();

      if (!currentToken) {
        throw new Error(
          "Session expired. Please login again."
        );
      }

      const response =
        await fetch(
          `${API}/service-requests/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization:
                `Bearer ${currentToken}`,
            },
          }
        );

      if (!response.ok) {
        const text =
          await response.text();

        throw new Error(
          text ||
            `Delete failed (${response.status})`
        );
      }

      await loadServiceRequests();
      await loadDashboard();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete service request."
      );
    }
  }

  async function updateServiceRequestStatus(
    id: number,
    status: string
  ) {
    try {
      const currentToken = token();

      if (!currentToken) {
        throw new Error(
          "Session expired. Please login again."
        );
      }

      const response =
        await fetch(
          `${API}/service-requests/${id}/status?status=${encodeURIComponent(
            status
          )}`,
          {
            method: "PUT",
            headers: {
              Authorization:
                `Bearer ${currentToken}`,
            },
          }
        );

      if (!response.ok) {
        const text =
          await response.text();

        throw new Error(
          text ||
            `Status update failed (${response.status})`
        );
      }

      await loadServiceRequests();
      await loadDashboard();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to update status."
      );
    }
  }

  async function assignTechnician(
    requestId: number,
    technicianId: number
  ) {
    if (!technicianId) {
      return;
    }

    try {
      const currentToken = token();

      if (!currentToken) {
        throw new Error(
          "Session expired. Please login again."
        );
      }

      const response =
        await fetch(
          `${API}/service-requests/${requestId}/assign-technician/${technicianId}`,
          {
            method: "PUT",
            headers: {
              Authorization:
                `Bearer ${currentToken}`,
            },
          }
        );

      if (!response.ok) {
        const text =
          await response.text();

        throw new Error(
          text ||
            `Assignment failed (${response.status})`
        );
      }

      await loadServiceRequests();
      await loadDashboard();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to assign technician."
      );
    }
  }

  /* ============================================================
     WORK ORDERS
     ============================================================ */

  async function loadWorkOrders() {
    try {
      setLoading(true);

      const data =
        await getData<WorkOrder[]>(
          "/workorders"
        );

      setWorkOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function resetWorkOrderForm() {
    setWorkOrderForm({
      title: "",
      description: "",
      customerId: "",
      priority: "MEDIUM",
      status: "OPEN",
      scheduledDate: "",
    });

    setEditingWorkOrderId(null);
    setShowWorkOrderForm(false);
  }

  function startAddWorkOrder() {
    setWorkOrderForm({
      title: "",
      description: "",
      customerId:
        customers.length > 0
          ? String(customers[0].id)
          : "",
      priority: "MEDIUM",
      status: "OPEN",
      scheduledDate: "",
    });

    setEditingWorkOrderId(null);
    setShowWorkOrderForm(true);
  }

  function editWorkOrder(
    order: WorkOrder
  ) {
    setWorkOrderForm({
      title: order.title,
      description:
        order.description,
      customerId:
        String(order.customerId),
      priority:
        order.priority || "MEDIUM",
      status:
        order.status || "OPEN",
      scheduledDate:
        order.scheduledDate || "",
    });

    setEditingWorkOrderId(order.id);
    setShowWorkOrderForm(true);
  }

  async function saveWorkOrder(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!workOrderForm.customerId) {
      alert("Please select a customer.");
      return;
    }

    try {
      const currentToken = token();

      if (!currentToken) {
        throw new Error(
          "Session expired. Please login again."
        );
      }

      const editing =
        editingWorkOrderId !== null;

      const endpoint = editing
        ? `/workorders/${editingWorkOrderId}`
        : "/workorders";

      const payload = {
        title:
          workOrderForm.title,
        description:
          workOrderForm.description,
        customerId: Number(
          workOrderForm.customerId
        ),
        priority:
          workOrderForm.priority,
        status:
          workOrderForm.status,
        scheduledDate:
          workOrderForm.scheduledDate
            ? workOrderForm.scheduledDate
            : null,
      };

      const response = await fetch(
        `${API}${endpoint}`,
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${currentToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const text =
          await response.text();

        throw new Error(
          text ||
            `Work order request failed (${response.status})`
        );
      }

      resetWorkOrderForm();
      await loadWorkOrders();
      await loadDashboard();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to save work order."
      );
    }
  }

  async function deleteWorkOrder(
    id: number
  ) {
    if (
      !window.confirm(
        "Are you sure you want to delete this work order?"
      )
    ) {
      return;
    }

    try {
      const currentToken = token();

      if (!currentToken) {
        throw new Error(
          "Session expired. Please login again."
        );
      }

      const response =
        await fetch(
          `${API}/workorders/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization:
                `Bearer ${currentToken}`,
            },
          }
        );

      if (!response.ok) {
        const text =
          await response.text();

        if (response.status === 403) {
          throw new Error(
            "Only ADMIN can delete work orders."
          );
        }

        throw new Error(
          text ||
            `Delete failed (${response.status})`
        );
      }

      await loadWorkOrders();
      await loadDashboard();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete work order."
      );
    }
  }

  /* ============================================================
     LOGIN
     ============================================================ */

  useEffect(() => {
    if (loggedIn) {
      loadDashboard();
    }
  }, [loggedIn]);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("Logging in...");

    try {
      const response =
        await fetch(
          `${API}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
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

      const data =
        await response.json();

      if (!data.token) {
        throw new Error(
          "Token not received"
        );
      }

      localStorage.setItem(
        "token",
        data.token
      );

      setLoggedIn(true);
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    }
  }

  function logout() {
    localStorage.removeItem("token");

    setLoggedIn(false);

    setDashboard(null);
    setCustomers([]);
    setTechnicians([]);
    setServiceRequests([]);
    setWorkOrders([]);

    setEmail("");
    setPassword("");

    resetCustomerForm();
    resetTechnicianForm();
    resetServiceRequestForm();
    resetWorkOrderForm();
  }

  /* ============================================================
     PAGE CHANGE
     ============================================================ */

  async function changePage(
    nextPage: Page
  ) {
    setPage(nextPage);

    if (nextPage === "dashboard") {
      await loadDashboard();
    }

    if (nextPage === "customers") {
      await loadCustomers();
    }

    if (nextPage === "technicians") {
      await loadTechnicians();
    }

    if (nextPage === "serviceRequests") {
      await loadCustomers();
      await loadTechnicians();
      await loadServiceRequests();
    }

    if (nextPage === "workOrders") {
      await loadCustomers();
      await loadWorkOrders();
    }
  }

  /* ============================================================
     LOGIN SCREEN
     ============================================================ */

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-brand-mark">
            K
          </div>

          <h1>Keystone</h1>

          <p>
            Service Management System
          </p>

          <form
            onSubmit={handleLogin}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
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

  /* ============================================================
     MAIN APP
     ============================================================ */

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="brand-block">
          <div className="brand-mark">
            K
          </div>

          <div>
            <h1>Keystone</h1>

            <p>
              Service Management System
            </p>
          </div>
        </div>

        <div className="header-right">
          <span className="online-pill">
            <span />
            System Online
          </span>

          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <nav className="navigation">
        <button
          className={
            page === "dashboard"
              ? "nav-button active"
              : "nav-button"
          }
          onClick={() =>
            changePage("dashboard")
          }
        >
          ⌂ Dashboard
        </button>

        <button
          className={
            page === "customers"
              ? "nav-button active"
              : "nav-button"
          }
          onClick={() =>
            changePage("customers")
          }
        >
          👥 Customers
        </button>

        <button
          className={
            page === "technicians"
              ? "nav-button active"
              : "nav-button"
          }
          onClick={() =>
            changePage("technicians")
          }
        >
          🛠️ Technicians
        </button>

        <button
          className={
            page === "serviceRequests"
              ? "nav-button active"
              : "nav-button"
          }
          onClick={() =>
            changePage(
              "serviceRequests"
            )
          }
        >
          📋 Service Requests
        </button>

        <button
          className={
            page === "workOrders"
              ? "nav-button active"
              : "nav-button"
          }
          onClick={() =>
            changePage("workOrders")
          }
        >
          ⚙️ Work Orders
        </button>
      </nav>

      <main className="dashboard-content">

        {/* =====================================================
            DASHBOARD
            ===================================================== */}

        {page === "dashboard" && (
          <section className="modern-dashboard">
            <div className="dashboard-hero">
              <div>
                <span className="dashboard-eyebrow">
                  SERVICE MANAGEMENT
                </span>

                <h2>
                  Dashboard Overview
                </h2>

                <p>
                  Monitor customers,
                  technicians, service
                  requests and work
                  orders from one place.
                </p>
              </div>

              <button
                className="dashboard-refresh"
                onClick={
                  loadDashboard
                }
              >
                ↻ Refresh
              </button>
            </div>

            {loading && (
              <p className="loading">
                Loading dashboard...
              </p>
            )}

            {dashboard && (
              <>
                <div className="kpi-grid">

                  <div className="kpi-card">
                    <div className="kpi-top">
                      <span className="kpi-icon">
                        👥
                      </span>

                      <span className="kpi-label">
                        CUSTOMERS
                      </span>
                    </div>

                    <div className="kpi-value">
                      {
                        dashboard.totalCustomers
                      }
                    </div>

                    <p>
                      Total registered
                      customers
                    </p>
                  </div>

                  <div className="kpi-card">
                    <div className="kpi-top">
                      <span className="kpi-icon">
                        🛠️
                      </span>

                      <span className="kpi-label">
                        TECHNICIANS
                      </span>
                    </div>

                    <div className="kpi-value">
                      {
                        dashboard.totalTechnicians
                      }
                    </div>

                    <p>
                      Available technicians
                    </p>
                  </div>

                  <div className="kpi-card">
                    <div className="kpi-top">
                      <span className="kpi-icon">
                        📋
                      </span>

                      <span className="kpi-label">
                        SERVICE REQUESTS
                      </span>
                    </div>

                    <div className="kpi-value">
                      {
                        dashboard.totalServiceRequests
                      }
                    </div>

                    <p>
                      Total service requests
                    </p>
                  </div>

                  <div className="kpi-card">
                    <div className="kpi-top">
                      <span className="kpi-icon">
                        ⚙️
                      </span>

                      <span className="kpi-label">
                        WORK ORDERS
                      </span>
                    </div>

                    <div className="kpi-value">
                      {
                        dashboard.totalWorkOrders
                      }
                    </div>

                    <p>
                      Total work orders
                    </p>
                  </div>

                </div>

                <div className="section-heading">
                  <h3>
                    Operations Overview
                  </h3>

                  <p>
                    Current service activity
                  </p>
                </div>

                <div className="status-grid">

                  <div className="status-card">
                    <div className="status-card-icon success">
                      ✓
                    </div>

                    <div>
                      <span>
                        Completed Requests
                      </span>

                      <strong>
                        {
                          dashboard.completedRequests
                        }
                      </strong>
                    </div>
                  </div>

                  <div className="status-card">
                    <div className="status-card-icon warning">
                      !
                    </div>

                    <div>
                      <span>
                        Pending Requests
                      </span>

                      <strong>
                        {
                          dashboard.pendingRequests
                        }
                      </strong>
                    </div>
                  </div>

                  <div className="status-card">
                    <div className="status-card-icon info">
                      ↗
                    </div>

                    <div>
                      <span>
                        Open Work Orders
                      </span>

                      <strong>
                        {
                          dashboard.openWorkOrders
                        }
                      </strong>
                    </div>
                  </div>

                  <div className="status-card">
                    <div className="status-card-icon closed">
                      ✓
                    </div>

                    <div>
                      <span>
                        Closed Work Orders
                      </span>

                      <strong>
                        {
                          dashboard.closedWorkOrders
                        }
                      </strong>
                    </div>
                  </div>

                </div>
              </>
            )}
          </section>
        )}

        {/* =====================================================
            CUSTOMERS
            ===================================================== */}

        {page === "customers" && (
          <section>
            <div className="page-title">
              <div>
                <h2>
                  Customers
                </h2>

                <p>
                  Manage customer records.
                </p>
              </div>

              <div>
                <button
                  className="add-button"
                  onClick={
                    startAddCustomer
                  }
                >
                  + Add Customer
                </button>

                <button
                  className="refresh-button"
                  onClick={
                    loadCustomers
                  }
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            {showCustomerForm && (
              <div className="customer-form-card">
                <h3>
                  {editingCustomerId !==
                  null
                    ? "Edit Customer"
                    : "Add Customer"}
                </h3>

                <form
                  onSubmit={
                    saveCustomer
                  }
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={
                      customerForm.fullName
                    }
                    onChange={(event) =>
                      setCustomerForm({
                        ...customerForm,
                        fullName:
                          event.target.value,
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
                    onChange={(event) =>
                      setCustomerForm({
                        ...customerForm,
                        email:
                          event.target.value,
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
                    onChange={(event) =>
                      setCustomerForm({
                        ...customerForm,
                        phone:
                          event.target.value,
                      })
                    }
                    required
                  />

                  <textarea
                    placeholder="Address"
                    value={
                      customerForm.address
                    }
                    onChange={(event) =>
                      setCustomerForm({
                        ...customerForm,
                        address:
                          event.target.value,
                      })
                    }
                    required
                  />

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="save-button"
                    >
                      {editingCustomerId !==
                      null
                        ? "Update Customer"
                        : "Save Customer"}
                    </button>

                    <button
                      type="button"
                      className="cancel-button"
                      onClick={
                        resetCustomerForm
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <p className="loading">
                Loading customers...
              </p>
            ) : customers.length ===
              0 ? (
              <p className="empty">
                No customers found.
              </p>
            ) : (
              <div className="data-grid">
                {customers.map(
                  (customer) => (
                    <div
                      className="data-card"
                      key={
                        customer.id
                      }
                    >
                      <div className="card-heading-row">
                        <h3>
                          {
                            customer.fullName
                          }
                        </h3>

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
                      </div>

                      <p>
                        <strong>
                          ID:
                        </strong>{" "}
                        {customer.id}
                      </p>

                      <p>
                        <strong>
                          Email:
                        </strong>{" "}
                        {customer.email}
                      </p>

                      <p>
                        <strong>
                          Phone:
                        </strong>{" "}
                        {customer.phone}
                      </p>

                      <p>
                        <strong>
                          Address:
                        </strong>{" "}
                        {customer.address}
                      </p>

                      <div className="card-actions">
                        <button
                          className="edit-button"
                          onClick={() =>
                            editCustomer(
                              customer
                            )
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteCustomer(
                              customer.id
                            )
                          }
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            TECHNICIANS
            ===================================================== */}

        {page === "technicians" && (
          <section>
            <div className="page-title">
              <div>
                <h2>
                  Technicians
                </h2>

                <p>
                  Manage service technicians.
                </p>
              </div>

              <div>
                <button
                  className="add-button"
                  onClick={
                    startAddTechnician
                  }
                >
                  + Add Technician
                </button>

                <button
                  className="refresh-button"
                  onClick={
                    loadTechnicians
                  }
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            {showTechnicianForm && (
              <div className="customer-form-card">
                <h3>
                  {editingTechnicianId !==
                  null
                    ? "Edit Technician"
                    : "Add Technician"}
                </h3>

                <form
                  onSubmit={
                    saveTechnician
                  }
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={
                      technicianForm.fullName
                    }
                    onChange={(event) =>
                      setTechnicianForm({
                        ...technicianForm,
                        fullName:
                          event.target.value,
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
                    onChange={(event) =>
                      setTechnicianForm({
                        ...technicianForm,
                        email:
                          event.target.value,
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
                    onChange={(event) =>
                      setTechnicianForm({
                        ...technicianForm,
                        phone:
                          event.target.value,
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
                    onChange={(event) =>
                      setTechnicianForm({
                        ...technicianForm,
                        specialization:
                          event.target.value,
                      })
                    }
                  />

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="save-button"
                    >
                      {editingTechnicianId !==
                      null
                        ? "Update Technician"
                        : "Save Technician"}
                    </button>

                    <button
                      type="button"
                      className="cancel-button"
                      onClick={
                        resetTechnicianForm
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <p className="loading">
                Loading technicians...
              </p>
            ) : technicians.length ===
              0 ? (
              <p className="empty">
                No technicians found.
              </p>
            ) : (
              <div className="data-grid">
                {technicians.map(
                  (technician) => (
                    <div
                      className="data-card"
                      key={
                        technician.id
                      }
                    >
                      <div className="card-heading-row">
                        <h3>
                          {
                            technician.fullName
                          }
                        </h3>

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
                      </div>

                      <p>
                        <strong>
                          ID:
                        </strong>{" "}
                        {technician.id}
                      </p>

                      <p>
                        <strong>
                          Email:
                        </strong>{" "}
                        {technician.email}
                      </p>

                      <p>
                        <strong>
                          Phone:
                        </strong>{" "}
                        {technician.phone}
                      </p>

                      <p>
                        <strong>
                          Specialization:
                        </strong>{" "}
                        {technician.specialization ||
                          "N/A"}
                      </p>

                      <div className="card-actions">
                        <button
                          className="edit-button"
                          onClick={() =>
                            editTechnician(
                              technician
                            )
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteTechnician(
                              technician.id
                            )
                          }
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            SERVICE REQUESTS
            ===================================================== */}

        {page === "serviceRequests" && (
          <section>
            <div className="page-title">
              <div>
                <h2>
                  Service Requests
                </h2>

                <p>
                  Create, update and manage service requests.
                </p>
              </div>

              <div>
                <button
                  className="add-button"
                  onClick={
                    startAddServiceRequest
                  }
                >
                  + Add Request
                </button>

                <button
                  className="refresh-button"
                  onClick={
                    loadServiceRequests
                  }
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            {showServiceRequestForm && (
              <div className="customer-form-card">
                <h3>
                  {editingServiceRequestId !==
                  null
                    ? "Edit Service Request"
                    : "Create Service Request"}
                </h3>

                <form
                  onSubmit={
                    saveServiceRequest
                  }
                >
                  <input
                    type="text"
                    placeholder="Title"
                    value={
                      serviceRequestForm.title
                    }
                    onChange={(event) =>
                      setServiceRequestForm({
                        ...serviceRequestForm,
                        title:
                          event.target.value,
                      })
                    }
                    required
                  />

                  <textarea
                    placeholder="Description"
                    value={
                      serviceRequestForm.description
                    }
                    onChange={(event) =>
                      setServiceRequestForm({
                        ...serviceRequestForm,
                        description:
                          event.target.value,
                      })
                    }
                    required
                  />

                  <select
                    value={
                      serviceRequestForm.customerId
                    }
                    onChange={(event) =>
                      setServiceRequestForm({
                        ...serviceRequestForm,
                        customerId:
                          event.target.value,
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
                          key={
                            customer.id
                          }
                          value={
                            customer.id
                          }
                        >
                          {
                            customer.fullName
                          }
                        </option>
                      )
                    )}
                  </select>

                  <select
                    value={
                      serviceRequestForm.priority
                    }
                    onChange={(event) =>
                      setServiceRequestForm({
                        ...serviceRequestForm,
                        priority:
                          event.target.value,
                      })
                    }
                    required
                  >
                    {priorities.map(
                      (priority) => (
                        <option
                          key={
                            priority
                          }
                          value={
                            priority
                          }
                        >
                          {priority}
                        </option>
                      )
                    )}
                  </select>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="save-button"
                    >
                      {editingServiceRequestId !==
                      null
                        ? "Update Request"
                        : "Create Request"}
                    </button>

                    <button
                      type="button"
                      className="cancel-button"
                      onClick={
                        resetServiceRequestForm
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
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
                      key={
                        request.id
                      }
                    >
                      <div className="card-heading-row">
                        <h3>
                          {
                            request.title
                          }
                        </h3>

                        <span className="status">
                          {
                            request.status
                          }
                        </span>
                      </div>

                      <p>
                        <strong>
                          ID:
                        </strong>{" "}
                        {request.id}
                      </p>

                      <p>
                        <strong>
                          Description:
                        </strong>{" "}
                        {
                          request.description
                        }
                      </p>

                      <p>
                        <strong>
                          Customer:
                        </strong>{" "}
                        {
                          request.customerName
                        }
                      </p>

                      <p>
                        <strong>
                          Priority:
                        </strong>{" "}
                        <span className="priority">
                          {
                            request.priority
                          }
                        </span>
                      </p>

                      <p>
                        <strong>
                          Technician:
                        </strong>{" "}
                        {
                          request.technicianName ||
                          "Not Assigned"
                        }
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

                      <div className="card-actions">
                        <button
                          className="edit-button"
                          onClick={() =>
                            editServiceRequest(
                              request
                            )
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteServiceRequest(
                              request.id
                            )
                          }
                        >
                          🗑️ Delete
                        </button>
                      </div>

                      <div className="customer-form-card">
                        <strong>
                          Update Status
                        </strong>

                        <select
                          value={
                            request.status
                          }
                          onChange={(event) =>
                            updateServiceRequestStatus(
                              request.id,
                              event.target.value
                            )
                          }
                        >
                          {statuses.map(
                            (status) => (
                              <option
                                key={
                                  status
                                }
                                value={
                                  status
                                }
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>

                        <strong>
                          Assign Technician
                        </strong>

                        <select
                          defaultValue=""
                          onChange={(event) =>
                            assignTechnician(
                              request.id,
                              Number(
                                event.target
                                  .value
                              )
                            )
                          }
                        >
                          <option value="">
                            Select Technician
                          </option>

                          {technicians.map(
                            (technician) => (
                              <option
                                key={
                                  technician.id
                                }
                                value={
                                  technician.id
                                }
                              >
                                {
                                  technician.fullName
                                }
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            WORK ORDERS
            ===================================================== */}

        {page === "workOrders" && (
          <section>
            <div className="page-title">
              <div>
                <h2>
                  Work Orders
                </h2>

                <p>
                  Create and manage work orders.
                </p>
              </div>

              <div>
                <button
                  className="add-button"
                  onClick={
                    startAddWorkOrder
                  }
                >
                  + Add Work Order
                </button>

                <button
                  className="refresh-button"
                  onClick={
                    loadWorkOrders
                  }
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            {showWorkOrderForm && (
              <div className="customer-form-card">
                <h3>
                  {editingWorkOrderId !==
                  null
                    ? "Edit Work Order"
                    : "Create Work Order"}
                </h3>

                <form
                  onSubmit={
                    saveWorkOrder
                  }
                >
                  <input
                    type="text"
                    placeholder="Title"
                    value={
                      workOrderForm.title
                    }
                    onChange={(event) =>
                      setWorkOrderForm({
                        ...workOrderForm,
                        title:
                          event.target.value,
                      })
                    }
                    required
                  />

                  <textarea
                    placeholder="Description"
                    value={
                      workOrderForm.description
                    }
                    onChange={(event) =>
                      setWorkOrderForm({
                        ...workOrderForm,
                        description:
                          event.target.value,
                      })
                    }
                    required
                  />

                  <select
                    value={
                      workOrderForm.customerId
                    }
                    onChange={(event) =>
                      setWorkOrderForm({
                        ...workOrderForm,
                        customerId:
                          event.target.value,
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
                          key={
                            customer.id
                          }
                          value={
                            customer.id
                          }
                        >
                          {
                            customer.fullName
                          }
                        </option>
                      )
                    )}
                  </select>

                  <select
                    value={
                      workOrderForm.priority
                    }
                    onChange={(event) =>
                      setWorkOrderForm({
                        ...workOrderForm,
                        priority:
                          event.target.value,
                      })
                    }
                    required
                  >
                    {priorities.map(
                      (priority) => (
                        <option
                          key={
                            priority
                          }
                          value={
                            priority
                          }
                        >
                          {priority}
                        </option>
                      )
                    )}
                  </select>

                  <select
                    value={
                      workOrderForm.status
                    }
                    onChange={(event) =>
                      setWorkOrderForm({
                        ...workOrderForm,
                        status:
                          event.target.value,
                      })
                    }
                    required
                  >
                    {statuses.map(
                      (status) => (
                        <option
                          key={
                            status
                          }
                          value={
                            status
                          }
                        >
                          {status}
                        </option>
                      )
                    )}
                  </select>

                  <input
                    type="date"
                    value={
                      workOrderForm.scheduledDate
                    }
                    onChange={(event) =>
                      setWorkOrderForm({
                        ...workOrderForm,
                        scheduledDate:
                          event.target.value,
                      })
                    }
                  />

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="save-button"
                    >
                      {editingWorkOrderId !==
                      null
                        ? "Update Work Order"
                        : "Create Work Order"}
                    </button>

                    <button
                      type="button"
                      className="cancel-button"
                      onClick={
                        resetWorkOrderForm
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
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
                      <div className="card-heading-row">
                        <h3>
                          {order.title}
                        </h3>

                        <span className="status">
                          {
                            order.status
                          }
                        </span>
                      </div>

                      <p>
                        <strong>
                          ID:
                        </strong>{" "}
                        {order.id}
                      </p>

                      <p>
                        <strong>
                          Description:
                        </strong>{" "}
                        {
                          order.description
                        }
                      </p>

                      <p>
                        <strong>
                          Customer:
                        </strong>{" "}
                        {
                          order.customerName
                        }
                      </p>

                      <p>
                        <strong>
                          Priority:
                        </strong>{" "}
                        <span className="priority">
                          {
                            order.priority
                          }
                        </span>
                      </p>

                      <p>
                        <strong>
                          Scheduled Date:
                        </strong>{" "}
                        {
                          order.scheduledDate ||
                          "Not Scheduled"
                        }
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

                      <div className="card-actions">
                        <button
                          className="edit-button"
                          onClick={() =>
                            editWorkOrder(
                              order
                            )
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteWorkOrder(
                              order.id
                            )
                          }
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
}

export default App;