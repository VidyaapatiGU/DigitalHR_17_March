<style scoped>
.account-page {
  padding: 2rem;
  min-height: 100vh;
  overflow-y: auto;
}

.account-header {
  margin-bottom: 2rem;
}

.account-header h4 {
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.account-header p {
  color: var(--text-secondary);
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
}

.profile-card {
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  overflow: hidden;
  height: 100%;
}

.profile-card-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  padding: 2rem 1.5rem 3rem;
  text-align: center;
  position: relative;
}

.profile-card-body {
  padding: 1.5rem;
  text-align: center;
  margin-top: -2.5rem;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: var(--shadow-md);
  background: #fff;
}

.document-list-row {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 0.85rem 0; border-bottom: 1px solid var(--border-color);
}
.document-list-row:last-child { border-bottom: 0; }
.document-status { font-size: 0.8rem; font-weight: 600; }
.document-status.uploaded { color: #15803d; }
.document-status.pending { color: #b45309; }

.profile-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-top: 0.75rem;
  font-size: 1.15rem;
}

.details-card {
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.details-card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
}

.details-card-body {
  padding: 1.5rem;
}

.info-group {
  margin-bottom: 1.25rem;
}

.info-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.35rem;
}

.info-group .form-control:disabled {
  background-color: var(--bg-body);
  border-color: var(--border-color);
  color: var(--text-primary);
  opacity: 1;
  cursor: default;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.capitalize {
  text-transform: capitalize;
}

@media (max-width: 991px) {
  .account-page {
    padding: 1.25rem;
  }
  .profile-avatar {
    width: 100px;
    height: 100px;
  }
}
</style>

<template>
  <div class="account-page">
    <div class="account-header scroll">
      <h4>My Account</h4>
      <p>View and update your profile information</p>
    </div>

    <div class="row g-4">
      <div class="col-xl-4">
        <div class="profile-card">
          <div class="profile-card-header"></div>
          <div class="profile-card-body scroll">
            <div class="position-relative d-inline-block">
              <img
                v-if="profile"
                class="profile-avatar"
                :src="profile"
                alt="Profile Picture"
              />
              <img
                v-else
                class="profile-avatar"
                src="../assets/profile-circle.svg"
                alt="Default Profile Picture"
              />
              <label v-if="isEditing" class="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 cursor-pointer shadow-sm" style="width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;">
                <i class="bi bi-camera"></i>
                <input type="file" @change="onFileChange" class="d-none" accept="image/*" />
              </label>
            </div>
            <div class="profile-name">{{ user.name }}</div>
          </div>
        </div>
      </div>

      <div class="col-xl-8">
        <div class="details-card scroll">
          <div class="details-card-header d-flex justify-content-between align-items-center">
            <span>Account Details</span>
            <button v-if="!isEditing" type="button" @click="startEditing" class="btn btn-primary btn-sm">
              <i class="bi bi-pencil me-1"></i> Edit Profile
            </button>
          </div>
          <div class="details-card-body">
            <div class="info-group">
              <label for="name">Name</label>
              <input
                :disabled="!isEditing"
                class="form-control"
                id="name"
                type="text"
                v-model="editForm.name"
              />
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <div class="info-group">
                  <label for="email">Email</label>
                  <input
                    :disabled="!isEditing || !isAdminRole"
                    class="form-control"
                    id="email"
                    type="email"
                    autocomplete="email"
                    v-model="editForm.email"
                  />
                  <small class="text-muted" v-if="isEditing && !isAdminRole">Only admins can change the account email.</small>
                </div>
                <div class="info-group" v-if="isAdminRole">
                  <label for="account-role">Account Type</label>
                  <input
                    :disabled="true"
                    class="form-control capitalize"
                    id="account-role"
                    type="text"
                    :value="user.roleType?.name || 'admin'"
                  />
                </div>
                <template v-else>
                  <div class="info-group">
                    <label for="team">Team</label>
                    <input
                      :disabled="true"
                      class="form-control"
                      id="team"
                      type="text"
                      :value="profileTeamName"
                    />
                  </div>
                  <div class="info-group">
                    <label for="role">Role</label>
                    <input
                      :disabled="true"
                      class="form-control capitalize"
                      id="role"
                      type="text"
                      :value="profileRoleName"
                    />
                  </div>
                </template>
              </div>
              <div class="col-md-6">
                <div class="info-group">
                  <label for="whatsapp">WhatsApp Number</label>
                  <input
                    :disabled="!isEditing"
                    class="form-control"
                    id="whatsapp"
                    type="text"
                    v-model="editForm.whatsapp_no"
                  />
                </div>
                <div class="info-group" v-if="!isAdminRole">
                  <label for="department">Department</label>
                  <input
                    :disabled="true"
                    class="form-control capitalize"
                    id="department"
                    type="text"
                    :value="profileDepartmentName"
                  />
                </div>
              </div>
            </div>

            <div v-if="isEditing" class="edit-actions">
              <button @click="cancelEditing" class="btn btn-light">Cancel</button>
              <button @click="saveProfile" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section v-if="isClientRole" class="details-card mt-4">
      <div class="details-card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
        <span>Client Documents</span>
        <span v-if="pendingRequiredDocuments.length" class="badge text-bg-warning">
          {{ pendingRequiredDocuments.length }} required document(s) pending
        </span>
        <span v-else class="badge text-bg-success">Required documents complete</span>
      </div>
      <div class="details-card-body">
        <p class="text-secondary small">
          Upload PDF, JPG, or PNG files up to 4 MB. Aadhaar and PAN are required; GST and CIN are
          required when those numbers are on your account.
        </p>
        <input
          ref="clientDocumentInput"
          class="d-none"
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          @change="uploadClientDocument"
        />
        <div v-for="document in clientDocuments" :key="document.type" class="document-list-row">
          <div>
            <div class="fw-semibold">{{ document.label }}</div>
            <div class="document-status" :class="document.uploaded ? 'uploaded' : (document.required ? 'pending' : 'text-secondary')">
              <span v-if="document.uploaded"><i class="bi bi-check-circle-fill me-1"></i>Uploaded</span>
              <span v-else-if="document.required"><i class="bi bi-exclamation-circle-fill me-1"></i>Required</span>
              <span v-else>Optional</span>
            </div>
          </div>
          <button
            class="btn btn-outline-primary btn-sm"
            type="button"
            :disabled="isUploadingClientDocument"
            @click="chooseClientDocument(document.type)"
          >
            <span v-if="isUploadingClientDocument && selectedClientDocument === document.type" class="spinner-border spinner-border-sm me-1"></span>
            {{ isUploadingClientDocument && selectedClientDocument === document.type ? 'Uploading…' : (document.uploaded ? 'Replace' : 'Upload') }}
          </button>
        </div>
        <div v-if="isUploadingClientDocument" class="mt-3" role="status" aria-live="polite">
          <div class="d-flex justify-content-between small mb-1">
            <span>Uploading…</span>
            <span>{{ uploadProgress }}%</span>
          </div>
          <div class="progress" role="progressbar" :aria-valuenow="uploadProgress" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar progress-bar-striped progress-bar-animated" :style="{ width: `${Math.max(uploadProgress, 5)}%` }"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import axiosClient from '../axiosClient';
export default {
  name: 'MyAccount',
  data() {
    return {
      user: {
        team: {},
        department: {},
        roleType: {},
      },
      editForm: {
        name: '',
        email: '',
        whatsapp_no: '',
        profile: null,
        profileData: '',
      },
      isEditing: false,
      loading: false,
      isUploadingClientDocument: false,
      selectedClientDocument: '',
      uploadProgress: 0,
      id: '',
      name: 'xyz',
      mobile_no: '11111111',
      email: 'xyz@gmail.com',

      profile: null,
      profile_url: '',

      token: '',
    };
  },

  computed: {
    isAdminRole() {
      return ['admin', 'super_admin'].includes(this.user.roleType?.name);
    },
    isClientRole() {
      return Boolean(
        this.user.client_code ||
        this.user.industry_type ||
        this.user.roleType?.name === 'client'
      );
    },
    profileDepartmentName() {
      return (
        this.user.department?.name ||
        this.user.user_id?.department?.name ||
        this.user.notificationDepartment?.name ||
        '—'
      );
    },
    profileTeamName() {
      return this.user.team?.name || this.user.user_id?.team?.name || '—';
    },
    profileRoleName() {
      return (
        this.user.roleType?.name ||
        this.user.user_id?.roleType?.name ||
        this.user.notificationRole?.name ||
        (this.isClientRole ? 'Client' : '—')
      );
    },
    clientDocuments() {
      const documents = [
        { type: 'adhar', label: 'Aadhaar card', proofField: 'adhar_proof', required: true },
        { type: 'pan', label: 'PAN card', proofField: 'pan_proof', required: true },
        { type: 'gst', label: 'GST certificate', proofField: 'gst_proof', required: Boolean(this.user.gst_no) },
        { type: 'cin', label: 'CIN certificate', proofField: 'cin_proof', required: Boolean(this.user.cin_no) },
      ];
      return documents.map((document) => ({
        ...document,
        uploaded: Boolean(this.user[document.proofField]),
      }));
    },
    pendingRequiredDocuments() {
      return this.clientDocuments.filter((document) => document.required && !document.uploaded);
    },
  },

  created() {
    this.getCurrent();
  },

  mounted() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.scroll', {
      opacity: 0,
      y: 50,
      duration: 0.5,
      scrollTrigger: {
        trigger: '.scroll',
        delay: 0.5,
        start: 'top center',
        toggleActions: 'play none none reverse',
      },
    });
  },

  methods: {
    startEditing() {
      this.editForm.name = this.user.name;
      this.editForm.email = this.user.email || '';
      this.editForm.whatsapp_no = this.user.whatsapp_no || '';
      this.isEditing = true;
    },

    cancelEditing() {
      this.editForm.name = this.user.name || '';
      this.editForm.email = this.user.email || '';
      this.editForm.whatsapp_no = this.user.whatsapp_no || '';
      this.profile = this.user.profile_url || this.user.profile || null;
      this.editForm.profile = null;
      this.editForm.profileData = '';
      this.isEditing = false;
    },

    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.editForm.profile = file;
        const reader = new FileReader();
        reader.onload = (ev) => {
          this.editForm.profileData = ev.target.result;
          this.profile = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    async saveProfile() {
      const email = this.editForm.email.trim().toLowerCase();
      if (!this.editForm.name.trim()) {
        window.alert('Enter a name.');
        return;
      }
      if (this.isAdminRole && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        window.alert('Enter a valid email address.');
        return;
      }

      this.loading = true;
      try {
        const updateData = {
          name: this.editForm.name.trim(),
          whatsapp_no: this.editForm.whatsapp_no,
          profile_url: this.editForm.profileData || this.user.profile_url,
        };
        if (this.isAdminRole) updateData.email = email;

        if (this.user.roleType && this.user.roleType._id) updateData.roleType = this.user.roleType._id;
        if (this.user.department && this.user.department._id) updateData.department = this.user.department._id;
        if (this.user.team && this.user.team._id) updateData.team = this.user.team._id;

        // Remove optional fields if left blank to satisfy backend validators
        if (!updateData.whatsapp_no) delete updateData.whatsapp_no;
        if (!updateData.profile_url) delete updateData.profile_url;

        await axiosClient.put(`api/v1/user/update/${this.user._id}`, updateData);

        await this.getCurrent();
        this.isEditing = false;
        alert('Profile updated successfully!');
      } catch (err) {
        console.log('error: ', err);
        window.alert(err.response?.data?.message || 'Failed to update profile.');
      } finally {
        this.loading = false;
      }
    },

    chooseClientDocument(type) {
      if (this.isUploadingClientDocument) return;
      this.selectedClientDocument = type;
      this.$nextTick(() => this.$refs.clientDocumentInput?.click());
    },

    async uploadClientDocument(event) {
      const file = event.target.files?.[0];
      const type = this.selectedClientDocument;
      event.target.value = '';
      if (!file || !type || this.isUploadingClientDocument) return;

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        window.alert('Choose a PDF, JPG, or PNG file.');
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        window.alert('Documents must be 4 MB or smaller.');
        return;
      }

      this.isUploadingClientDocument = true;
      this.uploadProgress = 0;
      try {
        const formData = new FormData();
        formData.append('file', file);
        const uploaded = await axiosClient.post(
          `/api/v1/document/upload/${type}/${this.user._id}`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                this.uploadProgress = Math.min(100, Math.round((progressEvent.loaded * 100) / progressEvent.total));
              }
            },
          }
        );
        this.uploadProgress = 100;
        const linked = await axiosClient.put(`/api/v1/client/update/document/${this.user._id}`, {
          document_type: type,
          document_url: uploaded.data.location.Location,
          document_url_id: uploaded.data.file_id,
        });
        Object.assign(this.user, linked.data.data || {});
        window.dispatchEvent(new CustomEvent('client-documents-updated', { detail: this.user }));
        window.alert(`${this.clientDocuments.find((document) => document.type === type)?.label || 'Document'} uploaded successfully.`);
      } catch (error) {
        window.alert(error.response?.data?.message || 'Unable to upload document.');
      } finally {
        this.isUploadingClientDocument = false;
        this.uploadProgress = 0;
        this.selectedClientDocument = '';
      }
    },

    async getCurrent() {
      try {
        const token = await axiosClient.get(`api/v1/user/getCurrent/`);
        if (!token) {
          this.$router.push('/login');
        }
        this.user = token.data.user;
        this.editForm.name = this.user.name || '';
        this.editForm.email = this.user.email || '';
        this.editForm.whatsapp_no = this.user.whatsapp_no || '';
        if (this.user.profile_url) {
          this.profile = this.user.profile_url;
        } else if (this.user.profile) {
          this.profile = this.user.profile;
        }
      } catch (err) {
        console.log('error: ', err);
        this.$router.push('/login');
      }

      return;
    },
  },
};
</script>
