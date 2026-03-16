<style scoped>
:root {
  --primary: #0f172a;
  --primary-600: #1d4ed8;
  --muted: #64748b;
  --surface: #ffffff;
  --border: #e2e8f0;
  --success: #10b981;
  --danger: #ef4444;
}

.page-shell {
  background: #f8fafc;
  min-height: 100vh;
  padding: 32px;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-weight: 800;
  font-size: 28px;
  color: var(--primary);
  margin: 0;
}

.sub {
  color: var(--muted);
  margin: 4px 0 0;
  font-size: 14px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: var(--primary);
  margin: 0;
}

.stat-label {
  color: var(--muted);
  font-size: 13px;
  margin: 2px 0 0;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #eef2ff;
  color: #312e81;
  border-radius: 999px;
  font-weight: 600;
  font-size: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.grid-column-2 {
  grid-column: span 2;
}

.divider {
  height: 1px;
  background: var(--border);
  margin: 14px 0;
}

.btn-primary {
  background: var(--primary-600);
  border: none;
}

.btn-primary:hover {
  background: #1e40af;
}

.table-wrapper {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px;
  margin-top: 18px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 10px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

th {
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
  font-weight: 700;
}

tr:hover td {
  background: #f8fafc;
}

.status-dot {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.green {
  background: var(--success);
}

.dot.red {
  background: var(--danger);
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-outline {
  border: 1px solid var(--border);
  background: #fff;
  color: var(--primary);
}

.btn-outline:hover {
  border-color: var(--primary-600);
  color: var(--primary-600);
}

.badge-soft {
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
}

.badge-soft.green {
  background: #ecfdf3;
  color: #166534;
}

.badge-soft.red {
  background: #fef2f2;
  color: #b91c1c;
}

.badge-soft.amber {
  background: #fffbeb;
  color: #92400e;
}

.form-help {
  color: var(--muted);
  font-size: 12px;
  margin-top: 4px;
}

.search-box {
  max-width: 320px;
}

.modal.fade .modal-dialog {
  transform: translateY(10%);
  transition: transform 0.2s ease-out;
}

.modal.fade.show .modal-dialog {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .page-shell {
    padding: 18px;
  }

  .header-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>

<template>
  <div class="page-shell">
    <div class="header-bar">
      <div>
        <h1 class="title">Admin Control Center</h1>
        <p class="sub">Create clients, manage access, and nudge them with notifications.</p>
      </div>
      <div class="pill">
        <i class="bi bi-shield-lock"></i>
        <span>Authenticated</span>
      </div>
    </div>

    <div class="card-grid">
      <div class="card">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <div class="stat-value">{{ clients.length }}</div>
            <div class="stat-label">Total Clients</div>
          </div>
          <span class="badge-soft amber">Live</span>
        </div>
        <div class="divider" />
        <div class="d-flex gap-3">
          <div>
            <div class="stat-value" style="font-size:22px">{{ activeClients }}</div>
            <div class="stat-label">Active</div>
          </div>
          <div>
            <div class="stat-value" style="font-size:22px">{{ disabledClients }}</div>
            <div class="stat-label">Disabled</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <div class="stat-value" style="font-size:22px">Create Client</div>
            <div class="stat-label">Username & password issued instantly</div>
          </div>
          <span class="badge-soft green">New</span>
        </div>
        <div class="divider" />
        <form @submit.prevent="handleCreateClient">
          <div class="form-grid">
            <div>
              <label class="form-label">Name</label>
              <input
                v-model="createForm.name"
                type="text"
                class="form-control form-control-sm"
                placeholder="Acme Pvt Ltd"
                required
              />
            </div>
            <div>
              <label class="form-label">Email</label>
              <input
                v-model="createForm.email"
                type="email"
                class="form-control form-control-sm"
                placeholder="ops@acme.com"
              />
            </div>
            <div>
              <label class="form-label">Username Prefix</label>
              <input
                v-model="createForm.username_prefix"
                type="text"
                class="form-control form-control-sm"
                placeholder="CL"
                required
              />
              <p class="form-help">Will auto-append next client number.</p>
            </div>
            <div>
              <label class="form-label">Password</label>
              <input
                v-model="createForm.password"
                type="password"
                class="form-control form-control-sm"
                placeholder="Minimum 5 characters"
                required
              />
            </div>
            <div>
              <label class="form-label">Phone / WhatsApp</label>
              <input
                v-model="createForm.whatsapp_no"
                type="text"
                class="form-control form-control-sm"
                placeholder="9876543210"
              />
            </div>
            <div>
              <label class="form-label">City</label>
              <input
                v-model="createForm.city"
                type="text"
                class="form-control form-control-sm"
                placeholder="Mumbai"
              />
            </div>
            <div>
              <label class="form-label">State</label>
              <input
                v-model="createForm.state"
                type="text"
                class="form-control form-control-sm"
                placeholder="Maharashtra"
              />
            </div>
            <div>
              <label class="form-label">Country</label>
              <input
                v-model="createForm.country"
                type="text"
                class="form-control form-control-sm"
                placeholder="India"
              />
            </div>
            <div>
              <label class="form-label">PIN Code</label>
              <input
                v-model="createForm.pin_code"
                type="text"
                class="form-control form-control-sm"
                placeholder="400001"
              />
            </div>
            <div class="grid-column-2">
              <label class="form-label">Address</label>
              <textarea
                v-model="createForm.address"
                rows="2"
                class="form-control form-control-sm"
                placeholder="Full address"
              ></textarea>
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button class="btn btn-outline btn-sm" type="button" @click="resetForm">Reset</button>
            <button class="btn btn-primary btn-sm text-white" type="submit" :disabled="creating">
              <span v-if="creating" class="spinner-border spinner-border-sm me-2" role="status"></span>
              Create & Issue Login
            </button>
          </div>
          <div v-if="lastCreatedCreds" class="alert alert-success mt-3 mb-0 py-2">
            <strong>Login ready:</strong>
            Username <code>{{ lastCreatedCreds.username }}</code> · Password <code>{{ lastCreatedCreds.password }}</code>
            <button class="btn btn-link btn-sm p-0 ms-2" @click.prevent="$router.push('/client/login')">
              Open client login
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="table-wrapper mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h5 class="mb-0">Clients</h5>
          <p class="sub mb-0">Allow / disable access and send notifications.</p>
        </div>
        <input
          v-model="search"
          type="search"
          class="form-control form-control-sm search-box"
          placeholder="Search name, email or username"
        />
      </div>

      <div v-if="loadingClients" class="text-center py-4">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else>
        <table v-if="filteredClients.length">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Status</th>
              <th style="width:200px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in filteredClients" :key="client._id">
              <td class="fw-semibold">{{ client.name }}</td>
              <td><code>{{ client.username }}</code></td>
              <td>{{ client.email || '—' }}</td>
              <td>
                <span class="status-dot">
                  <span class="dot" :class="client.approved ? 'green' : 'red'"></span>
                  <span class="badge-soft" :class="client.approved ? 'green' : 'red'">
                    {{ client.approved ? 'Allowed' : 'Disabled' }}
                  </span>
                </span>
              </td>
              <td>
                <div class="actions">
                  <button class="btn btn-outline btn-sm" @click="toggleClient(client)">
                    <i :class="[client.approved ? 'bi bi-pause-circle' : 'bi bi-check-circle', 'me-1']"></i>
                    {{ client.approved ? 'Disable' : 'Allow' }}
                  </button>
                  <button class="btn btn-primary btn-sm text-white" @click="openNotify(client)">
                    <i class="bi bi-megaphone me-1"></i> Notify
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="alert alert-light mb-0">No clients found.</div>
      </div>
    </div>

    <!-- Notification Modal -->
    <div class="modal fade" id="notifyModal" tabindex="-1" aria-hidden="true" ref="notifyModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Send notification to {{ selectedClient ? selectedClient.name : '' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-2">
              <label class="form-label">Type</label>
              <select v-model="notificationForm.type" class="form-select form-select-sm">
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
              </select>
            </div>
            <div>
              <label class="form-label">Message</label>
              <textarea
                v-model="notificationForm.text"
                rows="3"
                class="form-control"
                placeholder="Write a short update"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline btn-sm" data-bs-dismiss="modal">Cancel</button>
            <button
              type="button"
              class="btn btn-primary btn-sm text-white"
              :disabled="sendingNotification"
              @click="sendNotification"
            >
              <span v-if="sendingNotification" class="spinner-border spinner-border-sm me-2"></span>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { Modal } from 'bootstrap';
import axiosClient from '../../axiosClient';

export default {
  name: 'AdminPage',
  data() {
    return {
      user: {},
      clients: [],
      loadingClients: false,
      creating: false,
      sendingNotification: false,
      search: '',
      selectedClient: null,
      notifyModalInstance: null,
      lastCreatedCreds: null,
      createForm: {
        username_prefix: 'CL',
        password: '',
        name: '',
        email: '',
        whatsapp_no: '',
        city: '',
        state: '',
        country: '',
        address: '',
        pin_code: '',
      },
      notificationForm: {
        text: '',
        type: 'info',
      },
    };
  },

  computed: {
    filteredClients() {
      if (!this.search) return this.clients;
      const q = this.search.toLowerCase();
      return this.clients.filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          (c.username && c.username.toLowerCase().includes(q))
      );
    },
    activeClients() {
      return this.clients.filter((c) => c.approved).length;
    },
    disabledClients() {
      return this.clients.filter((c) => !c.approved).length;
    },
  },

  async created() {
    await this.fetchCurrentUser();
    await this.fetchClients();
  },

  methods: {
    async fetchCurrentUser() {
      try {
        const res = await axiosClient.get('/api/v1/user/getCurrent/');
        this.user = res.data.user;
      } catch (error) {
        this.$router.push('/login');
      }
    },

    async fetchClients() {
      this.loadingClients = true;
      try {
        const res = await axiosClient.get('/api/v1/client/get/all/clients');
        this.clients = res.data.data || [];
      } catch (error) {
        if (error?.response?.status === 401) {
          this.$router.push('/login');
        } else {
          toast.error('Unable to load clients');
        }
      } finally {
        this.loadingClients = false;
      }
    },

    resetForm() {
      const prefix = this.createForm.username_prefix || 'CL';
      this.createForm = {
        username_prefix: prefix,
        password: '',
        name: '',
        email: '',
        whatsapp_no: '',
        city: '',
        state: '',
        country: '',
        address: '',
        pin_code: '',
      };
    },

    async handleCreateClient() {
      if (this.createForm.password.length < 5) {
        toast.info('Password must have at least 5 characters');
        return;
      }

      this.creating = true;
      try {
        const payload = { ...this.createForm };
        const res = await axiosClient.post('/api/v1/client/add', payload);
        if (res?.data) {
          this.clients.unshift(res.data);
          this.lastCreatedCreds = {
            username: res.data.username,
            password: this.createForm.password,
          };
          toast.success('Client created & login issued');
          this.resetForm();
        }
      } catch (error) {
        const message = error?.response?.data?.message || 'Unable to create client';
        toast.error(message);
      } finally {
        this.creating = false;
      }
    },

    async toggleClient(client) {
      const id = client.user_id || client._id;
      if (!id) {
        toast.info('Client is missing a linked user id; cannot toggle access yet.');
        return;
      }

      try {
        await axiosClient.put(`/api/v1/client/app_dis/${id}`);
        client.approved = !client.approved;
        client.active = client.approved;
        toast.success(`Client ${client.approved ? 'allowed' : 'disabled'}`);
      } catch (error) {
        toast.error('Update failed');
      }
    },

    openNotify(client) {
      this.selectedClient = client;
      this.notificationForm.text = '';
      this.notificationForm.type = 'info';

      if (!this.notifyModalInstance) {
        this.notifyModalInstance = new Modal(this.$refs.notifyModal);
      }
      this.notifyModalInstance.show();
    },

    async sendNotification() {
      if (!this.notificationForm.text.trim()) {
        toast.info('Enter a message');
        return;
      }

      this.sendingNotification = true;
      try {
        await axiosClient.post('/api/v1/notification/add', {
          text: this.notificationForm.text,
          type: this.notificationForm.type,
          to_user: this.selectedClient?.user_id || this.selectedClient?._id,
          by_user: this.user?._id,
        });
        toast.success('Notification sent');
        const modal = Modal.getInstance(this.$refs.notifyModal);
        modal?.hide();
      } catch (error) {
        toast.error('Unable to send notification');
      } finally {
        this.sendingNotification = false;
      }
    },
  },
};
</script>
