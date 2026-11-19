<style scoped>
.page-wrapper { min-height: 100%; }
.page-header-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.85rem 1.5rem; border-bottom: 1px solid var(--border-color); background: var(--bg-surface);
}
.page-header-bar h5 { margin: 0; color: var(--text-primary); font-size: 1.05rem; font-weight: 600; }
.back-button {
  display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.4rem 0.75rem;
  border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-surface);
  color: var(--text-primary); font-size: 0.85rem;
}
.back-button:hover { border-color: var(--primary); color: var(--primary); }
.content { padding: 1.5rem; }
.documents-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
.document-card {
  padding: 1.25rem; border: 1px solid var(--border-color); border-radius: var(--radius-lg);
  background: var(--bg-surface); box-shadow: var(--shadow-sm);
}
.document-card h6 { margin: 0; color: var(--text-primary); font-weight: 600; }
.document-card-header { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
.document-status { padding: 0.2rem 0.55rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.document-status.uploaded { color: #166534; background: #dcfce7; }
.document-status.pending { color: #9a3412; background: #ffedd5; }
.file-input { min-height: 42px; font-size: 0.82rem; }
.document-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
.document-actions .btn { font-size: 0.82rem; }
.preview-backdrop {
  position: fixed; inset: 0; z-index: 1100; display: flex; align-items: center; justify-content: center;
  padding: 1rem; background: rgb(15 23 42 / 72%);
}
.preview-dialog {
  display: flex; flex-direction: column; width: min(100%, 1000px); height: min(90vh, 800px);
  overflow: hidden; border-radius: 0.75rem; background: var(--bg-surface);
}
.preview-header { display: flex; align-items: center; justify-content: space-between; padding: 0.8rem 1rem; border-bottom: 1px solid var(--border-color); }
.preview-body { display: flex; flex: 1; align-items: center; justify-content: center; min-height: 0; padding: 0.75rem; }
.preview-image { max-width: 100%; max-height: 100%; object-fit: contain; }
.preview-frame { width: 100%; height: 100%; border: 0; }
</style>

<template>
  <div class="page-wrapper">
    <div class="page-header-bar">
      <div>
        <h5>Client documents</h5>
        <small v-if="client" class="text-secondary">{{ client.name }} · {{ client.email }}</small>
      </div>
      <button type="button" class="back-button" @click="$router.push('/manage/clients')">
        <i class="bi bi-arrow-left"></i> Back to clients
      </button>
    </div>

    <div class="content">
      <div v-if="loading" class="text-secondary" role="status" aria-live="polite">
        Loading client documents…
      </div>
      <div v-else-if="loadError" class="alert alert-danger" role="alert">{{ loadError }}</div>
      <template v-else>
        <div class="alert alert-light border mb-4">
          Upload PDF, JPG, or PNG files up to 4 MB each.
        </div>

        <div class="documents-grid">
          <section v-for="document in documents" :key="document.type" class="document-card">
            <div class="document-card-header">
              <h6>{{ document.label }}</h6>
              <span class="document-status" :class="isUploaded(document) ? 'uploaded' : 'pending'">
                {{ isUploaded(document) ? 'Uploaded' : 'Pending' }}
              </span>
            </div>

            <p class="small text-secondary mt-2 mb-3">
              {{ isUploaded(document) ? 'A document is on file. You can view, replace, or remove it.' : 'No document has been uploaded yet.' }}
            </p>

            <input
              class="form-control file-input"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              :aria-label="`Choose ${document.label}`"
              @change="selectFile($event, document.type)"
            />
            <div v-if="selectedFiles[document.type]" class="small text-secondary mt-2 text-break">
              {{ selectedFiles[document.type].name }}
            </div>

            <div class="document-actions">
              <button
                type="button"
                class="btn btn-primary"
                :disabled="!selectedFiles[document.type] || busyType"
                @click="uploadDocument(document)"
              >
                <span v-if="uploadingType === document.type" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                {{ uploadingType === document.type ? 'Uploading…' : (isUploaded(document) ? 'Replace' : 'Upload') }}
              </button>
              <button
                v-if="isUploaded(document)"
                type="button"
                class="btn btn-outline-secondary"
                :disabled="busyType"
                @click="viewDocument(document)"
              >
                <i class="bi bi-eye me-1"></i> View
              </button>
              <button
                v-if="isUploaded(document)"
                type="button"
                class="btn btn-outline-danger"
                :disabled="busyType"
                @click="deleteDocument(document)"
              >
                <span v-if="deletingType === document.type" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                {{ deletingType === document.type ? 'Deleting…' : 'Delete' }}
              </button>
            </div>
          </section>
        </div>
      </template>
    </div>

    <div v-if="previewDocument" class="preview-backdrop" @click.self="closePreview">
      <section class="preview-dialog" role="dialog" aria-modal="true" :aria-label="previewDocument.label">
        <header class="preview-header">
          <strong>{{ previewDocument.label }}</strong>
          <button type="button" class="btn-close" aria-label="Close preview" @click="closePreview"></button>
        </header>
        <div v-if="previewLoading" class="preview-body text-secondary" role="status">Loading document…</div>
        <div v-else-if="previewError" class="preview-body text-danger" role="alert">{{ previewError }}</div>
        <div v-else class="preview-body">
          <img v-if="previewMimeType.startsWith('image/')" :src="previewUrl" :alt="previewDocument.label" class="preview-image" />
          <iframe v-else :src="previewUrl" :title="previewDocument.label" class="preview-frame"></iframe>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axiosClient from '../../axiosClient';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: 'UpdateClientDocuments',
  props: {
    clientId: { type: String, required: true },
  },
  data() {
    return {
      client: null,
      loading: true,
      loadError: '',
      documents: [
        { type: 'pan', label: 'PAN card', proofField: 'pan_proof', urlField: 'pan_proof_url', idField: 'pan_proof_url_id' },
        { type: 'adhar', label: 'Aadhaar card', proofField: 'adhar_proof', urlField: 'adhar_proof_url', idField: 'adhar_proof_url_id' },
        { type: 'gst', label: 'GST certificate', proofField: 'gst_proof', urlField: 'gst_proof_url', idField: 'gst_proof_url_id' },
        { type: 'cin', label: 'CIN certificate', proofField: 'cin_proof', urlField: 'cin_proof_url', idField: 'cin_proof_url_id' },
      ],
      selectedFiles: { pan: null, adhar: null, gst: null, cin: null },
      uploadingType: '',
      deletingType: '',
      previewDocument: null,
      previewUrl: '',
      previewMimeType: '',
      previewLoading: false,
      previewError: '',
    };
  },
  computed: {
    busyType() {
      return Boolean(this.uploadingType || this.deletingType);
    },
  },
  created() {
    this.loadClient();
  },
  beforeUnmount() {
    this.releasePreviewUrl();
  },
  methods: {
    async loadClient() {
      this.loading = true;
      this.loadError = '';
      try {
        const response = await axiosClient.get(`/api/v1/client/get/${this.clientId}`);
        this.client = response.data.data?.[0] || null;
        if (!this.client) this.loadError = 'Client not found.';
      } catch (error) {
        this.loadError = error.response?.data?.message || 'Unable to load this client’s documents.';
      } finally {
        this.loading = false;
      }
    },
    isUploaded(document) {
      return Boolean(this.client?.[document.idField] || this.client?.[document.urlField] || this.client?.[document.proofField]);
    },
    selectFile(event, type) {
      const file = event.target.files?.[0] || null;
      if (!file) {
        this.selectedFiles[type] = null;
        return;
      }
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Choose a PDF, JPG, or PNG file.');
        event.target.value = '';
        this.selectedFiles[type] = null;
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        toast.error('The file must be 4 MB or smaller.');
        event.target.value = '';
        this.selectedFiles[type] = null;
        return;
      }
      this.selectedFiles[type] = file;
    },
    async uploadDocument(document) {
      const file = this.selectedFiles[document.type];
      if (!file || this.busyType) return;

      const formData = new FormData();
      formData.append('file', file);
      this.uploadingType = document.type;
      try {
        await axiosClient.post(`/api/v1/document/upload/client/${document.type}/${this.client._id}`, formData);
        this.selectedFiles[document.type] = null;
        await this.loadClient();
        toast.success(`${document.label} uploaded successfully.`);
      } catch (error) {
        toast.error(error.response?.data?.message || `Unable to upload ${document.label.toLowerCase()}.`);
      } finally {
        this.uploadingType = '';
      }
    },
    async viewDocument(document) {
      this.closePreview();
      this.previewDocument = document;
      this.previewLoading = true;
      this.previewError = '';
      try {
        const source = this.client?.[document.urlField];
        if (!source) throw new Error('Document link is missing.');
        if (source.startsWith('/api/v1/document/file/')) {
          const response = await axiosClient.get(source, { responseType: 'blob' });
          this.previewMimeType = response.data.type || response.headers['content-type'] || '';
          this.previewUrl = URL.createObjectURL(response.data);
        } else {
          this.previewMimeType = /\.(png|jpe?g)(?:$|\?)/i.test(source) ? 'image/*' : 'application/pdf';
          this.previewUrl = source;
        }
      } catch (error) {
        this.previewError = error.response?.data?.message || error.message || 'Unable to load this document.';
      } finally {
        this.previewLoading = false;
      }
    },
    closePreview() {
      this.releasePreviewUrl();
      this.previewDocument = null;
      this.previewMimeType = '';
      this.previewError = '';
      this.previewLoading = false;
    },
    releasePreviewUrl() {
      if (this.previewUrl.startsWith('blob:')) URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = '';
    },
    async deleteDocument(document) {
      if (this.busyType) return;
      const fileId = this.client?.[document.idField];
      if (!fileId || !window.confirm(`Delete the ${document.label.toLowerCase()}?`)) return;

      this.deletingType = document.type;
      try {
        await axiosClient.delete(`/api/v1/document/delete/${this.client._id}/${fileId}/${document.type}`);
        await this.loadClient();
        toast.success(`${document.label} deleted successfully.`);
      } catch (error) {
        toast.error(error.response?.data?.message || `Unable to delete ${document.label.toLowerCase()}.`);
      } finally {
        this.deletingType = '';
      }
    },
  },
};
</script>
