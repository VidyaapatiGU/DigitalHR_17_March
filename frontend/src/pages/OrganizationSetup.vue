<template>
  <main class="organization-page">
    <section class="organization-heading">
      <div>
        <p class="organization-eyebrow">PEOPLE CONFIGURATION</p>
        <h1>Organization setup</h1>
        <p class="organization-description">
          Manage the teams, roles, and departments used across your workforce.
        </p>
      </div>
    </section>

    <section class="summary-grid" aria-label="Organization setup totals">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="summary-card"
        :class="{ 'summary-card-active': activeTab === tab.id }"
        @click="setTab(tab.id)"
      >
        <span class="summary-icon" :class="`summary-icon-${tab.id}`">
          <i :class="tab.icon" aria-hidden="true"></i>
        </span>
        <span class="summary-copy">
          <span class="summary-label">{{ tab.label }}</span>
          <strong>{{ sections[tab.id].items.length }}</strong>
        </span>
        <i class="bi bi-arrow-up-right summary-arrow" aria-hidden="true"></i>
      </button>
    </section>

    <section class="organization-panel">
      <div class="tab-list" role="tablist" aria-label="Organization lists">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :id="`organization-tab-${tab.id}`"
          type="button"
          role="tab"
          class="organization-tab"
          :class="{ 'organization-tab-active': activeTab === tab.id }"
          :aria-selected="activeTab === tab.id"
          :aria-controls="'organization-tabpanel'"
          @click="setTab(tab.id)"
        >
          <i :class="tab.icon" aria-hidden="true"></i>
          <span>{{ tab.label }}</span>
          <span class="tab-count">{{ sections[tab.id].items.length }}</span>
        </button>
      </div>

      <div
        id="organization-tabpanel"
        class="tab-panel"
        role="tabpanel"
        :aria-labelledby="`organization-tab-${activeTab}`"
      >
        <div class="panel-heading">
          <div>
            <h2>{{ currentTab.label }}</h2>
            <p>{{ currentTab.description }}</p>
          </div>
          <button type="button" class="btn-add" @click="openAdd">
            <i class="bi bi-plus-lg" aria-hidden="true"></i>
            Add {{ currentTab.singular }}
          </button>
        </div>

        <div class="table-toolbar">
          <label class="search-box">
            <i class="bi bi-search" aria-hidden="true"></i>
            <span class="visually-hidden">Search {{ currentTab.label.toLowerCase() }}</span>
            <input
              v-model="search"
              type="search"
              :placeholder="`Search ${currentTab.label.toLowerCase()}...`"
              autocomplete="off"
            />
          </label>
          <span class="results-count">
            {{ filteredItems.length }} {{ filteredItems.length === 1 ? 'entry' : 'entries' }}
          </span>
        </div>

        <div v-if="loading[activeTab]" class="table-state" role="status">
          <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          Loading {{ currentTab.label.toLowerCase() }}…
        </div>
        <div v-else-if="loadErrors[activeTab]" class="table-state table-state-error" role="alert">
          <i class="bi bi-exclamation-circle" aria-hidden="true"></i>
          <span>{{ loadErrors[activeTab] }}</span>
          <button type="button" class="btn-retry" @click="loadSection(activeTab)">Retry</button>
        </div>
        <div v-else-if="!filteredItems.length" class="empty-state">
          <span class="empty-icon"><i :class="currentTab.icon" aria-hidden="true"></i></span>
          <h3>{{ search ? 'No matching entries' : `No ${currentTab.label.toLowerCase()} yet` }}</h3>
          <p>
            {{ search ? 'Try a different search.' : `Add a ${currentTab.singular.toLowerCase()} to get started.` }}
          </p>
          <button v-if="!search" type="button" class="btn-add btn-add-empty" @click="openAdd">
            <i class="bi bi-plus-lg" aria-hidden="true"></i>
            Add {{ currentTab.singular }}
          </button>
        </div>
        <div v-else class="table-wrap">
          <table class="organization-table">
            <thead>
              <tr>
                <th scope="col">{{ currentTab.singular }} name</th>
                <th scope="col" class="date-column">Created</th>
                <th scope="col" class="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in pagedItems" :key="item._id">
                <td>
                  <span class="entity-cell">
                    <span class="entity-icon"><i :class="currentTab.icon" aria-hidden="true"></i></span>
                    <span class="entity-name">{{ item.name }}</span>
                  </span>
                </td>
                <td class="date-column">{{ formatDate(item.createDate) }}</td>
                <td class="actions-column">
                  <div class="row-actions">
                    <button
                      type="button"
                      class="icon-action"
                      :aria-label="`Edit ${item.name}`"
                      title="Edit"
                      @click="openEdit(item)"
                    >
                      <i class="bi bi-pencil" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      class="icon-action icon-action-danger"
                      :aria-label="`Delete ${item.name}`"
                      title="Delete"
                      @click="openDelete(item)"
                    >
                      <i class="bi bi-trash3" aria-hidden="true"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="pageCount > 1" class="pagination-bar">
            <span>Page {{ page }} of {{ pageCount }}</span>
            <div class="pagination-actions">
              <button type="button" :disabled="page <= 1" @click="page--">Previous</button>
              <button type="button" :disabled="page >= pageCount" @click="page++">Next</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="dialog" class="dialog-backdrop" @click.self="closeDialog">
      <section
        class="organization-dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'organization-dialog-title'"
        @keydown.esc="closeDialog"
      >
        <template v-if="dialog === 'delete'">
          <span class="dialog-icon dialog-icon-danger"><i class="bi bi-trash3" aria-hidden="true"></i></span>
          <h2 id="organization-dialog-title">Delete {{ currentTab.singular.toLowerCase() }}?</h2>
          <p>
            <strong>{{ selectedItem?.name }}</strong> will be removed from the active {{ currentTab.label.toLowerCase() }} list.
          </p>
          <div class="dialog-actions">
            <button type="button" class="btn-cancel" @click="closeDialog">Cancel</button>
            <button type="button" class="btn-confirm-danger" :disabled="saving" @click="confirmDelete">
              {{ saving ? 'Deleting…' : 'Delete' }}
            </button>
          </div>
        </template>
        <template v-else>
          <div class="dialog-heading">
            <div>
              <p class="organization-eyebrow">{{ dialog === 'add' ? 'NEW ENTRY' : 'UPDATE ENTRY' }}</p>
              <h2 id="organization-dialog-title">
                {{ dialog === 'add' ? `Add ${currentTab.singular.toLowerCase()}` : `Edit ${currentTab.singular.toLowerCase()}` }}
              </h2>
            </div>
            <button type="button" class="dialog-close" aria-label="Close" @click="closeDialog">
              <i class="bi bi-x-lg" aria-hidden="true"></i>
            </button>
          </div>
          <label class="field-label" for="organization-name">{{ currentTab.singular }} name</label>
          <input
            id="organization-name"
            v-model.trim="form.name"
            class="name-field"
            type="text"
            minlength="3"
            maxlength="80"
            autocomplete="off"
            :placeholder="`Enter ${currentTab.singular.toLowerCase()} name`"
            @keydown.enter.prevent="saveEntry"
          />
          <p class="field-hint">Use at least 3 characters.</p>
          <div class="dialog-actions">
            <button type="button" class="btn-cancel" :disabled="saving" @click="closeDialog">Cancel</button>
            <button type="button" class="btn-confirm" :disabled="saving" @click="saveEntry">
              {{ saving ? 'Saving…' : dialog === 'add' ? 'Add' : 'Save changes' }}
            </button>
          </div>
        </template>
      </section>
    </div>
  </main>
</template>

<script>
import axiosClient from '../axiosClient';
import { toast } from 'vue3-toastify';

const sectionConfig = {
  teams: {
    label: 'Teams',
    singular: 'Team',
    endpoint: 'team',
    icon: 'bi bi-people',
    description: 'Group people into teams for easier workforce management.',
  },
  roles: {
    label: 'Roles',
    singular: 'Role',
    endpoint: 'role',
    icon: 'bi bi-shield-check',
    description: 'Manage the roles available when creating and updating users.',
  },
  departments: {
    label: 'Departments',
    singular: 'Department',
    endpoint: 'department',
    icon: 'bi bi-building',
    description: 'Keep your departments organized in one place.',
  },
};

export default {
  name: 'OrganizationSetup',
  data() {
    const requestedTab = this.$route.query.tab;
    return {
      tabs: Object.entries(sectionConfig).map(([id, config]) => ({ id, ...config })),
      sections: {
        teams: { ...sectionConfig.teams, items: [] },
        roles: { ...sectionConfig.roles, items: [] },
        departments: { ...sectionConfig.departments, items: [] },
      },
      loading: { teams: false, roles: false, departments: false },
      loadErrors: { teams: '', roles: '', departments: '' },
      activeTab: Object.prototype.hasOwnProperty.call(sectionConfig, requestedTab) ? requestedTab : 'teams',
      search: '',
      page: 1,
      pageSize: 10,
      dialog: '',
      form: { name: '' },
      selectedItem: null,
      saving: false,
    };
  },
  computed: {
    currentTab() {
      return this.sections[this.activeTab];
    },
    filteredItems() {
      const query = this.search.trim().toLocaleLowerCase();
      const items = this.currentTab.items || [];
      return query ? items.filter((item) => (item.name || '').toLocaleLowerCase().includes(query)) : items;
    },
    pageCount() {
      return Math.max(1, Math.ceil(this.filteredItems.length / this.pageSize));
    },
    pagedItems() {
      const start = (this.page - 1) * this.pageSize;
      return this.filteredItems.slice(start, start + this.pageSize);
    },
  },
  watch: {
    '$route.query.tab'(tab) {
      if (Object.prototype.hasOwnProperty.call(sectionConfig, tab) && tab !== this.activeTab) {
        this.activeTab = tab;
        this.search = '';
        this.page = 1;
      }
    },
    search() {
      this.page = 1;
    },
  },
  created() {
    if (!Object.prototype.hasOwnProperty.call(sectionConfig, this.$route.query.tab)) {
      this.$router.replace({ path: '/organization', query: { tab: this.activeTab } });
    }
    this.loadAll();
  },
  methods: {
    async loadAll() {
      await Promise.all(this.tabs.map((tab) => this.loadSection(tab.id)));
    },
    async loadSection(tabId) {
      const config = this.sections[tabId];
      this.loading[tabId] = true;
      this.loadErrors[tabId] = '';
      try {
        const response = await axiosClient.get(`/api/v1/${config.endpoint}/getall`);
        const items = response.data?.data;
        if (!Array.isArray(items)) throw new Error('The server returned an unexpected list.');
        this.sections[tabId].items = items;
      } catch (error) {
        this.loadErrors[tabId] = error.response?.data?.message || `Unable to load ${config.label.toLowerCase()}.`;
      } finally {
        this.loading[tabId] = false;
      }
    },
    setTab(tabId) {
      if (!Object.prototype.hasOwnProperty.call(sectionConfig, tabId) || tabId === this.activeTab) return;
      this.activeTab = tabId;
      this.search = '';
      this.page = 1;
      this.$router.replace({ path: '/organization', query: { tab: tabId } });
    },
    formatDate(value) {
      if (!value) return '—';
      const date = new Date(value);
      return Number.isNaN(date.getTime())
        ? '—'
        : new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
    },
    openAdd() {
      this.dialog = 'add';
      this.selectedItem = null;
      this.form.name = '';
    },
    openEdit(item) {
      this.dialog = 'edit';
      this.selectedItem = item;
      this.form.name = item.name || '';
    },
    openDelete(item) {
      this.dialog = 'delete';
      this.selectedItem = item;
    },
    closeDialog() {
      if (this.saving) return;
      this.dialog = '';
      this.selectedItem = null;
      this.form.name = '';
    },
    async saveEntry() {
      const name = this.form.name.trim();
      if (name.length < 3) {
        toast.info(`${this.currentTab.singular} name must be at least 3 characters.`, { autoClose: 1800 });
        return;
      }

      const config = this.currentTab;
      const isEditing = this.dialog === 'edit';
      this.saving = true;
      try {
        if (isEditing) {
          await axiosClient.put(`/api/v1/${config.endpoint}/update/${this.selectedItem._id}`, { name });
          toast.success(`${config.singular} updated.`, { autoClose: 1500 });
        } else {
          await axiosClient.post(`/api/v1/${config.endpoint}/add`, { name });
          toast.success(`${config.singular} added.`, { autoClose: 1500 });
        }
        this.dialog = '';
        this.selectedItem = null;
        this.form.name = '';
        await this.loadSection(this.activeTab);
      } catch (error) {
        const validationMessage = error.response?.data?.errors?.map((item) => item.msg).join(', ');
        toast.error(error.response?.data?.message || validationMessage || `Unable to save ${config.singular.toLowerCase()}.`, {
          autoClose: 2200,
        });
      } finally {
        this.saving = false;
      }
    },
    async confirmDelete() {
      if (!this.selectedItem || this.saving) return;
      const config = this.currentTab;
      this.saving = true;
      try {
        await axiosClient.put(`/api/v1/${config.endpoint}/delete/${this.selectedItem._id}`);
        this.sections[this.activeTab].items = this.sections[this.activeTab].items.filter(
          (item) => item._id !== this.selectedItem._id
        );
        this.page = Math.min(this.page, this.pageCount);
        toast.success(`${config.singular} deleted.`, { autoClose: 1500 });
        this.dialog = '';
        this.selectedItem = null;
      } catch (error) {
        toast.error(error.response?.data?.message || `Unable to delete ${config.singular.toLowerCase()}.`, {
          autoClose: 2200,
        });
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.organization-page {
  min-height: 100%;
  padding: clamp(1rem, 2.2vw, 2rem);
  color: var(--text-primary);
}
.organization-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}
.organization-eyebrow {
  margin: 0 0 0.35rem;
  color: var(--text-muted);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.11em;
}
.organization-heading h1 {
  margin: 0;
  font-size: clamp(1.35rem, 2vw, 1.8rem);
  font-weight: 750;
  letter-spacing: -0.035em;
}
.organization-description {
  margin: 0.35rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;
  margin-bottom: 1.15rem;
}
.summary-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  box-shadow: var(--shadow-xs);
  color: inherit;
  text-align: left;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
  cursor: pointer;
}
.summary-card:hover, .summary-card-active {
  border-color: var(--primary-200);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}
.summary-card-active { outline: 2px solid color-mix(in srgb, var(--primary-light) 14%, transparent); }
.summary-icon, .entity-icon, .empty-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 2.65rem;
  height: 2.65rem;
  border-radius: 0.8rem;
  background: var(--primary-50);
  color: var(--primary-light);
  font-size: 1.05rem;
}
.summary-icon-roles { background: #f3e8ff; color: #8b5cf6; }
.summary-icon-departments { background: #ccfbf1; color: #0f9f8f; }
.summary-copy { display: flex; flex-direction: column; min-width: 0; }
.summary-label { color: var(--text-secondary); font-size: 0.76rem; font-weight: 600; }
.summary-copy strong { margin-top: 0.05rem; font-size: 1.3rem; line-height: 1.35; }
.summary-arrow { margin-left: auto; color: var(--text-muted); font-size: 0.85rem; }
.organization-panel {
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  box-shadow: var(--shadow-sm);
}
.tab-list {
  display: flex;
  gap: 0.3rem;
  padding: 0.55rem 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-muted);
}
.organization-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-height: 2.75rem;
  padding: 0.55rem 1rem;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.84rem;
  font-weight: 650;
  cursor: pointer;
}
.organization-tab:hover { color: var(--primary-light); }
.organization-tab-active {
  border-bottom-color: var(--primary-light);
  color: var(--primary);
}
.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.3rem;
  height: 1.3rem;
  padding: 0 0.3rem;
  border-radius: var(--radius-full);
  background: #e9eef6;
  color: var(--text-secondary);
  font-size: 0.68rem;
  font-weight: 700;
}
.organization-tab-active .tab-count { background: var(--primary-100); color: var(--primary); }
.tab-panel { padding: clamp(1rem, 2vw, 1.5rem); }
.panel-heading, .table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.panel-heading { margin-bottom: 1.1rem; }
.panel-heading h2 { margin: 0; font-size: 1.05rem; font-weight: 700; }
.panel-heading p { margin: 0.2rem 0 0; color: var(--text-muted); font-size: 0.8rem; }
.btn-add, .btn-confirm, .btn-confirm-danger, .btn-cancel, .btn-retry {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-height: 2.45rem;
  padding: 0.55rem 0.9rem;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  font-weight: 650;
  cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
}
.btn-add, .btn-confirm { background: var(--primary); color: #fff; }
.btn-add:hover, .btn-confirm:hover { background: var(--primary-light); }
.table-toolbar { min-height: 3.2rem; margin-bottom: 0.7rem; }
.search-box {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: min(100%, 22rem);
  min-height: 2.45rem;
  padding: 0 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: #fff;
  color: var(--text-muted);
}
.search-box:focus-within { border-color: var(--primary-light); box-shadow: 0 0 0 3px var(--primary-50); }
.search-box input { width: 100%; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--text-primary); font: inherit; font-size: 0.82rem; }
.search-box input::placeholder { color: var(--text-muted); }
.results-count { color: var(--text-muted); font-size: 0.76rem; white-space: nowrap; }
.table-wrap { overflow-x: auto; border: 1px solid var(--border-color); border-radius: var(--radius-md); }
.organization-table { width: 100%; border-collapse: collapse; min-width: 520px; }
.organization-table th {
  padding: 0.8rem 1rem;
  background: var(--bg-muted);
  color: var(--text-secondary);
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.04em;
  text-align: left;
  text-transform: uppercase;
}
.organization-table td { padding: 0.75rem 1rem; border-top: 1px solid var(--border-light); font-size: 0.84rem; }
.organization-table tbody tr:hover { background: #fbfdff; }
.entity-cell { display: inline-flex; align-items: center; gap: 0.7rem; min-width: 0; }
.entity-icon { width: 2rem; height: 2rem; border-radius: 0.6rem; font-size: 0.83rem; }
.entity-name { overflow-wrap: anywhere; font-weight: 650; }
.date-column { width: 10rem; color: var(--text-muted); }
.actions-column { width: 7rem; text-align: right !important; }
.row-actions { display: flex; justify-content: flex-end; gap: 0.35rem; }
.icon-action, .dialog-close {
  display: inline-grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
}
.icon-action:hover { border-color: var(--border-color); background: var(--bg-muted); color: var(--primary); }
.icon-action-danger:hover { border-color: #fecaca; background: #fff1f2; color: #dc2626; }
.pagination-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.7rem 0.9rem; color: var(--text-muted); font-size: 0.76rem; }
.pagination-actions { display: flex; gap: 0.4rem; }
.pagination-actions button, .btn-cancel, .btn-retry { border-color: var(--border-color); background: #fff; color: var(--text-secondary); }
.pagination-actions button { min-height: 2rem; padding: 0.3rem 0.65rem; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: #fff; color: var(--text-secondary); font-size: 0.74rem; cursor: pointer; }
.pagination-actions button:disabled { opacity: 0.45; cursor: not-allowed; }
.table-state, .empty-state { display: flex; align-items: center; justify-content: center; gap: 0.55rem; min-height: 12rem; color: var(--text-muted); font-size: 0.85rem; }
.table-state-error { color: #b91c1c; }
.btn-retry { min-height: 2rem; padding: 0.35rem 0.7rem; }
.empty-state { flex-direction: column; text-align: center; }
.empty-icon { width: 3rem; height: 3rem; border-radius: 1rem; font-size: 1.2rem; }
.empty-state h3 { margin: 0.25rem 0 0; color: var(--text-primary); font-size: 0.95rem; }
.empty-state p { margin: 0; font-size: 0.8rem; }
.btn-add-empty { margin-top: 0.55rem; }
.dialog-backdrop { position: fixed; z-index: 1200; inset: 0; display: grid; place-items: center; padding: 1rem; background: rgb(15 23 42 / 45%); backdrop-filter: blur(3px); }
.organization-dialog { width: min(100%, 26rem); padding: 1.35rem; border: 1px solid var(--border-color); border-radius: var(--radius-xl); background: #fff; box-shadow: var(--shadow-xl); }
.dialog-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; margin-bottom: 1.25rem; }
.dialog-heading h2, .organization-dialog > h2 { margin: 0; color: var(--text-primary); font-size: 1.15rem; font-weight: 750; }
.dialog-close { margin-top: 0.2rem; border-color: var(--border-color); }
.field-label { display: block; margin-bottom: 0.4rem; color: var(--text-secondary); font-size: 0.78rem; font-weight: 650; }
.name-field { width: 100%; min-height: 2.7rem; padding: 0.6rem 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); outline: none; color: var(--text-primary); font: inherit; font-size: 0.86rem; }
.name-field:focus { border-color: var(--primary-light); box-shadow: 0 0 0 3px var(--primary-50); }
.field-hint { margin: 0.35rem 0 1.15rem; color: var(--text-muted); font-size: 0.72rem; }
.dialog-icon { display: grid; place-items: center; width: 2.65rem; height: 2.65rem; margin-bottom: 0.9rem; border-radius: 0.85rem; font-size: 1.05rem; }
.dialog-icon-danger { background: #fff1f2; color: #dc2626; }
.organization-dialog > p { margin: 0.5rem 0 1.25rem; color: var(--text-secondary); font-size: 0.85rem; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 0.55rem; margin-top: 0.75rem; }
.btn-cancel:hover { background: var(--bg-muted); }
.btn-confirm-danger { background: #dc2626; color: #fff; }
.btn-confirm-danger:hover { background: #b91c1c; }
.dialog-actions button:disabled { opacity: 0.6; cursor: wait; }
@media (max-width: 720px) {
  .summary-grid { grid-template-columns: 1fr; gap: 0.55rem; }
  .summary-card { padding: 0.75rem; }
  .summary-icon { width: 2.3rem; height: 2.3rem; }
  .tab-list { gap: 0; padding-inline: 0.35rem; }
  .organization-tab { flex: 1; gap: 0.35rem; padding-inline: 0.35rem; font-size: 0.74rem; }
  .organization-tab > i { display: none; }
  .panel-heading { align-items: flex-start; }
  .panel-heading p { max-width: 16rem; }
  .date-column { display: none; }
  .organization-table { min-width: 0; }
  .organization-table th, .organization-table td { padding-inline: 0.65rem; }
}
@media (max-width: 440px) {
  .organization-page { padding: 0.85rem; }
  .organization-description { max-width: 23rem; font-size: 0.82rem; }
  .panel-heading { flex-direction: column; }
  .panel-heading .btn-add { width: 100%; }
  .table-toolbar { align-items: flex-start; flex-direction: column; }
  .search-box { width: 100%; }
  .results-count { align-self: flex-end; }
  .organization-tab { font-size: 0.69rem; }
  .tab-count { min-width: 1.15rem; height: 1.15rem; }
}
</style>
