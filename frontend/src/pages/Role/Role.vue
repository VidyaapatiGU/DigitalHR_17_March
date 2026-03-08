<style scoped>
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

.customize-table {
  --easy-table-border: none;
  --easy-table-row-border: 1px solid #f1f5f9;
  --easy-table-header-font-size: 13px;
  --easy-table-header-font-color: #64748b;
  --easy-table-header-background-color: #f8fafc;
  --easy-table-header-height: 44px;
  --easy-table-body-row-height: 52px;
  --easy-table-body-row-font-size: 13px;
  --easy-table-body-row-font-color: #334155;
  --easy-table-body-row-hover-background-color: #f8fafc;
  --easy-table-footer-background-color: #f8fafc;
  --easy-table-footer-font-color: #64748b;
  --easy-table-footer-font-size: 13px;
  --easy-table-footer-height: 44px;
}

.page-wrapper { height: 100%; }
.page-header-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.85rem 1.5rem; border-bottom: 1px solid var(--border-color); background: #fff;
}
.page-header-bar h5 { font-weight: 600; color: var(--text-primary); margin: 0; font-size: 1.05rem; }

.table-container {
  background: #fff; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color); overflow: hidden;
}

.toolbar {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;
}
.search-input { max-width: 280px; font-size: 0.875rem; border-radius: var(--radius-md) !important; }
.action-buttons { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.btn-action {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.45rem 0.9rem; font-size: 0.82rem; font-weight: 500;
  border-radius: var(--radius-md); border: 1px solid var(--border-color);
  background: #fff; color: var(--text-primary); cursor: pointer; transition: var(--transition-fast); white-space: nowrap;
}
.btn-action:hover { background: var(--bg-body); border-color: var(--primary); color: var(--primary); }
.table-icon { cursor: pointer; font-size: 1rem; padding: 0.25rem; border-radius: 4px; transition: all 0.15s; }
.table-icon:hover { background: #f1f5f9; }
</style>

<template>
  <div class="modal fade" id="Modal" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title source-400" id="ModalLabel">Update team</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="">
            <input
              type="text"
              class="form-control"
              placeholder="Enter Team Name"
              aria-label="Enter Team Name"
              aria-describedby="addon-wrapping"
              v-model="updateRole.name"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
            Close
          </button>
          <button
            @click="handleUpdate"
            type="button"
            class="btn text-light border-0 button_bg btn-sm"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="ModalAdd"
    tabindex="-1"
    aria-labelledby="ModalAddLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title source-400" id="ModalAddLabel">Add Role</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="">
            <input
              type="text"
              class="form-control"
              placeholder="Enter Role Name"
              aria-label="Enter Role Name"
              aria-describedby="addon-wrapping"
              v-model="form.name"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
            Close
          </button>
          <button
            @click="handleAddRole"
            type="button"
            class="btn text-light border-0 button_bg btn-sm"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="ModalDelete"
    tabindex="-1"
    aria-labelledby="ModalDeleteLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header border-0">
          <h5 class="modal-title source-400 text-capitalize" id="ModalDeleteLabel">
            Delete Role {{ updateRole.name }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-footer border-0">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
            Close
          </button>
          <button
            @click="handleDelete(updateRole._id)"
            type="button"
            class="btn text-light border-0 button_bg btn-sm"
            data-bs-dismiss="modal"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
  <div class="page-wrapper main source-400 pt-2 h-100 scroll">
    <div class="page-header-bar"><h5>Roles</h5></div>

    <!-- <div class="overflow-y-hidden pb-5 h-100">
      <div class="h-100 overflow-y-auto">
        <div class="container py-3">
          </div>
        </div>
      </div> -->

    <div class="overflow-y-hidden pb-5 h-100">
      <div class="h-100 overflow-y-auto">
        <div class="p-4">
          <div class="d-flex justify-content-center">
            <div>
              <div class="toolbar mb-4">
                  <input
                    type="text"
                    class="form-control search-input"
                    placeholder="Search Role"
                    aria-label="Search Role"
                    aria-describedby="addon-wrapping"
                    v-model="search"
                  />

                <div class="action-buttons">
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#ModalAdd"
                    type="button"
                    class="btn-action"
                  >
                    Add Role
                  </button>
                </div>
              </div>
              <div class="table-container">
                <div class="w-100">
                  <EasyDataTable
                    table-class-name="customize-table rounded"
                    :headers="headers"
                    :items="items"
                    search-field="name"
                    :search-value="search"
                    :rows-per-page="10"
                    buttons-pagination
                  >
                    <template #item-actions="item">
                      <div class="d-flex justify-content-evenly">
                        <div
                          class="table-icon action_icon_color w-100"
                          @click="updateRole = item"
                          data-bs-toggle="modal"
                          data-bs-target="#Modal"
                        >
                          <el-tooltip content="Update Role" placement="bottom">
                            <i class="bi bi-pen-fill pointer" style="font-size"></i>
                          </el-tooltip>
                        </div>

                        <div
                          class="table-icon action_icon_color w-100"
                          @click="updateRole = item"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalDelete"
                        >
                          <el-tooltip content="Delete Role" placement="bottom">
                            <i class="bi bi-trash-fill pointer" style="font-size"></i>
                          </el-tooltip>
                        </div>
                      </div>
                    </template>
                  </EasyDataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ////////////////////////////////////////Modal////////////////////////////////////////////// -->
  </div>
</template>

<script>
import EasyDataTable from 'vue3-easy-data-table';
import axiosClient from '../../axiosClient';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default {
  name: 'VueDataTable',
  components: { EasyDataTable },

  data() {
    return {
      headers: [
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      form: {
        name: '',
      },
      showDeleteModal: false,
      updateRole: {},
      search: '',
      entries: 0,
      entriesPerPage: 10,
      entriesPerPageOptions: [5, 10, 15, 20],
      page: 1,
      items: [],
      originalItems: [],
    };
  },

  async created() {
    this.getCurrent();

    try {
      const res = await axiosClient.get(`/api/v1/role/getall`);
      this.originalItems = res.data.data;

      console.log(this.originalItems);
    } catch (err) {
      console.log('error: ', err);
    }
    this.items = this.originalItems;
    console.log(this.items);
  },

  mounted() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.scroll', {
      opacity: 0,
      y: 50,
      duration: 1.2,
      scrollTrigger: {
        trigger: '.scroll',
        delay: 0.7,
        start: 'top center',
        toggleActions: 'play none none reverse',
      },
    });
  },

  setup() {},

  methods: {
    async handleUpdate() {
      if (this.updateRole.name == '') {
        toast.info(` Role Name Cannot Be Empty`, {
          autoClose: 1500,
        });
        return;
      }

      try {
        const res = await axiosClient.put(`/api/v1/role/update/${this.updateRole._id}`, {
          name: this.updateRole.name,
        });
        if (res) {
          toast.success(`Updated Role `, {
            autoClose: 1500,
          });
          setTimeout(() => {
            this.$router.go(0);
          }, 2000);
        }
      } catch (err) {
        console.log('error: ', err);
        toast.error(`Some Thing Went Wrong`);
      }
    },

    async handleDelete(id) {
      try {
        const res = await axiosClient.put(`/api/v1/role/delete/${id}`);
        if (res) {
          toast.success(`Role Deleted`, {
            autoClose: 1500,
          });
          this.items = this.items.filter((item) => item._id != id);
        }
      } catch (err) {
        console.log('error: ', err);
        toast.error(`Some Thing Went Wrong`);
      }
    },

    async handleAddRole() {
      if (this.form.name == '') {
        toast.info(`Enter Role Name`, {
          autoClose: 1500,
        });
        return;
      }
      if (this.form.name.length < 3) {
        toast.info(`Min Length Should be 3!`, {
          autoClose: 1500,
        });
        this.form.name = '';
        return;
      }

      try {
        const res = await axiosClient.post(`/api/v1/role/add/`, this.form);
        if (res) {
          toast.success(`Role Added`, {
            autoClose: 1500,
          });
          setTimeout(() => {
            this.$router.go(0);
          }, 2000);
        }
      } catch (err) {
        console.log('error: ', err);
        toast.error(err.response.data.errors.map((error) => error.msg).join(', '));
      }
    },

    FilterByName() {
      if (!this.search) {
        this.items = [...this.originalItems];
        return;
      }

      this.items = this.items.filter((item) =>
        item.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },

    hanldeRow(item) {
      console.log('handleRow Called: ', item);
    },

    async getCurrent() {
      try {
        const token = await axiosClient.get(`api/v1/user/getCurrent/`);
        console.log('Token : ', token);
        if (!token) {
          this.$router.push('/login');
        }
      } catch (err) {
        console.log('error: ', err);
        this.$router.push('/login');
      }
    },
  },
};
</script>
