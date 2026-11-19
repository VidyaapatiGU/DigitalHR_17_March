<style scoped>
.page-wrapper { height: 100%; }
.page-header-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.85rem 1.5rem; border-bottom: 1px solid var(--border-color); background: #fff;
}
.page-header-bar h5 { font-weight: 600; color: var(--text-primary); margin: 0; font-size: 1.05rem; }

.form-container {
  width: 100%; max-width: 960px; padding: 2rem; margin: auto;
  background: #fff; border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm); border: 1px solid var(--border-color);
}

.form-title {
  font-weight: 600; color: var(--text-primary); font-size: 1.15rem; margin-bottom: 1.5rem;
}

.form-group label {
  font-size: 0.82rem; font-weight: 500; color: var(--text-secondary);
  margin-bottom: 0.25rem; display: block;
}

.btn-submit {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.6rem 2rem; font-size: 0.9rem; font-weight: 500;
  border-radius: var(--radius-md); border: none;
  background: var(--primary); color: #fff; cursor: pointer;
  transition: var(--transition-fast);
}
.btn-submit:hover { background: var(--primary-light); transform: translateY(-1px); }

.employee-documents-content { max-width: 1100px; margin: 0 auto; padding: 1.5rem; }
.documents-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
.document-card {
  padding: 1.25rem; border: 1px solid var(--border-color); border-radius: var(--radius-lg);
  background: #fff; box-shadow: var(--shadow-sm);
}
.document-card h6 { margin: 0; color: var(--text-primary); font-weight: 600; }
.document-card-header { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
.document-status { padding: 0.2rem 0.55rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.document-status.uploaded { color: #166534; background: #dcfce7; }
.document-status.pending { color: #9a3412; background: #ffedd5; }
.document-file-input { min-height: 42px; font-size: 0.82rem; }
.document-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
.document-actions .btn { font-size: 0.82rem; }
.preview-backdrop {
  position: fixed; inset: 0; z-index: 1100; display: flex; align-items: center; justify-content: center;
  padding: 1rem; background: rgb(15 23 42 / 72%);
}
.preview-dialog {
  display: flex; flex-direction: column; width: min(100%, 1000px); height: min(90vh, 800px);
  overflow: hidden; border-radius: 0.75rem; background: #fff;
}
.preview-header { display: flex; align-items: center; justify-content: space-between; padding: 0.8rem 1rem; border-bottom: 1px solid #e2e8f0; }
.preview-body { display: flex; flex: 1; align-items: center; justify-content: center; min-height: 0; padding: 0.75rem; }
.preview-image { max-width: 100%; max-height: 100%; object-fit: contain; }
.preview-frame { width: 100%; height: 100%; border: 0; }

@media (max-width: 576px) {
  .form-container { padding: 1.25rem; }
}
</style>

<template>
  <div v-auto-animate class="page-wrapper">
    <div class="page-header-bar">
      <div>
        <h5>Update Employee</h5>
      </div>
      <div class="d-flex align-items-center capitalize source-400">
        <div v-auto-animate class="border-end px-2">
          <span
            @click="handleUpdateDocuments(false)"
            class="pointer"
            v-if="UpdateDocuments == true"
          >
            Details
          </span>
          <span class="text-secondary opacity-50" v-if="UpdateDocuments == false">Details</span>
        </div>
        <div v-auto-animate class="px-2">
          <span
            @click="handleUpdateDocuments(true)"
            class="pointer"
            v-if="UpdateDocuments == false"
          >
            Documents
          </span>
          <span class="text-secondary opacity-50" v-if="UpdateDocuments == true">Documents</span>
        </div>
      </div>
    </div>

    <div class="overflow-y-hidden pb-5 h-100">
      <div class="h-100 overflow-y-auto">
        <div class="p-4">
          <div class="main2">
            <div class="container-xl px-4">
              <div v-if="UpdateDocuments == false" v-auto-animate class="row">
                <!--  <div class="col-xl-4">
                  <div v-auto-animate class="card mb-4 mb-xl-0">
                    <div class="card-header">Profile Picture</div>
                    <div
                      v-auto-animate
                      class="card-body text-center scroll d-flex justify-content-center"
                    >
                      <div>
                        <img
                          v-if="profile"
                          class="img-account-profile profile-image rounded-circle mb-2"
                          :src="profile"
                          alt="Profile Picture"
                        />
                        <img
                          v-else
                          class="img-account-profile rounded-circle mb-2"
                          src="../../assets/profile-circle.svg"
                          alt="Default Profile Picture"
                        />

                        <div class="small font-italic text-muted mb-4">
                          <h5>{{ form.name }}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> -->
                <div class="col-xl-12">
                  <div class="card mb-4 scroll">
                    <div class="card-header">Employee Details</div>
                    <div class="card-body">
                      <div v-auto-animate>
                        <div class="row mb3">
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="name " class="mt-2">Name</label>
                            <span class="text-danger">*</span>
                            <input
                              v-model="form.name"
                              type="text"
                              class="form-control border"
                              id="name"
                              placeholder="Enter Name"
                            />
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="name " class="mt-2">Father/Husbands Name</label>
                            <span class="text-danger">*</span>
                            <input
                              v-model="form.fatherHusband_name"
                              type="text"
                              class="form-control border"
                              id="name"
                              placeholder="Enter Father/Husband Name"
                            />
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label class="small mb-1" for="name">Email</label>
                            <span class="text-danger">*</span>
                            <input
                              disabled
                              class="form-control"
                              id="email"
                              type="text"
                              v-model="form.email"
                            />
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="gender" class="mt-2">Gender</label>
                            <span class="text-danger">*</span>
                            <select v-model="form.gender" class="form-control border" id="gender">
                              <option disabled value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="mt-2">
                              <label class="small mt-2" for="designation">Designation</label>
                              <span class="text-danger">*</span>
                              <input
                                class="form-control"
                                id="designation"
                                type="text"
                                v-model="form.designation"
                              />
                            </div>
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="mt-2">
                              <label class="small mb-1" for="mobile_no">WhatsApp Number</label>
                              <span class="text-danger">*</span>
                              <input
                                class="form-control"
                                id="mobile_no"
                                type="text"
                                v-model="form.whatsapp_no"
                              />
                            </div>
                          </div>

                          <!-- <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="mt-2">
                              <label class="small mb-1" for="mobile_no">Date of Joining</label>
                              <span class="text-danger">*</span>
                              <input
                                class="form-control"
                                id="mobile_no"
                                type="date"
                                v-model="formattedDate"
                                @change="handleDateChange"
                              />
                            </div>
                          </div> -->

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="mt-2">
                              <label class="small mb-1" for="city">City</label>
                              <span class="text-danger">*</span>
                              <input
                                class="form-control"
                                id="city"
                                type="text"
                                v-model="form.city"
                              />
                            </div>
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="mt-2">
                              <label class="small mb-1" for="address">Address</label>
                              <span class="text-danger">*</span>
                              <textarea
                                class="form-control"
                                id="address"
                                type="text"
                                v-model="form.address"
                              />
                            </div>
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="mt-2">
                              <label class="small mb-1" for="state">State</label>
                              <span class="text-danger">*</span>
                              <input
                                class="form-control"
                                id="state"
                                type="text"
                                v-model="form.state"
                              />
                            </div>
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="mt-2">
                              <label class="small mb-1" for="country">Country</label>
                              <span class="text-danger">*</span>
                              <input
                                class="form-control"
                                id="country"
                                type="text"
                                v-model="form.country"
                              />
                            </div>
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="mt-2">
                              <label class="small mb-1" for="pin_code">Pin Code</label>
                              <span class="text-danger">*</span>
                              <input
                                class="form-control"
                                id="pin_code"
                                type="text"
                                v-model="form.pin_code"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="form-group col-12 col-sm-6 col-md-4">
                          <label for="weekly_off" class="mt-2">Weekly Off</label>
                          <multiselect
                            v-model="form.weeklyOff"
                            :options="weekOffOptions"
                            placeholder="Select Weekly Off"
                            label="label"
                            track-by="value"
                            :multiple="true"
                          ></multiselect>
                        </div>
                        <hr />
                        <!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

                        <div class="row source-400 mt-3">
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="Adhar " class="mt-2">Adhar No</label>
                            <span class="text-danger">*</span>
                            <input
                              disabled
                              v-model="form.adhar_card"
                              type="number"
                              class="form-control border"
                              id="Adhar"
                              placeholder="Enter ADHAR No"
                            />
                          </div>
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="UAN " class="mt-2">UAN No</label>
                            <input
                              v-model="form.uan_no"
                              type="number"
                              class="form-control border"
                              id="UAN"
                              placeholder="Enter UAN No"
                            />
                          </div>
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="PF" class="mt-2">PF No</label>
                            <input
                              v-model="form.pf_no"
                              type="number"
                              class="form-control border"
                              id="PF"
                              placeholder="Enter  PF No"
                            />
                          </div>
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="ESIC No" class="mt-2">ESIC No</label>
                            <input
                              v-model="form.esic_no"
                              type="number"
                              class="form-control border"
                              id="ESIC No"
                              placeholder="ESIC No"
                            />
                          </div>
                        </div>
                        <hr />
                        <div class="row source-400 mt-3">
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="Bank_name" class="mt-2">Bank Name</label>
                            <span class="text-danger">*</span>
                            <input
                              v-model="form.bank_name"
                              type="text"
                              class="form-control border"
                              id="Bank_name"
                              placeholder="Enter Bank Name"
                            />
                          </div>
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="bankAc" class="mt-2">Bank A/C No</label>
                            <span class="text-danger">*</span>
                            <input
                              v-model="form.bank_ac_no"
                              type="number"
                              class="form-control border"
                              id="bankAc"
                              placeholder="Enter Bank A/C No"
                            />
                          </div>
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="bankIfsc" class="mt-2">Bank IFSC</label>
                            <span class="text-danger">*</span>
                            <input
                              v-model="form.bank_ifsc"
                              type="text"
                              class="form-control border"
                              id="bankIfsc"
                              placeholder="Enter Bank IFSC"
                            />
                          </div>
                        </div>
                        <!-- <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for=" PFBasic" class="mt-2">PF Basic</label>
                            <input
                              v-model="form.pf_basic"
                              type="number"
                              class="form-control border"
                              id="PFBasic"
                              placeholder="Enter  PF Basic"
                            />
                          </div> -->
                        <hr />
                        <div class="row source-400 mt-3">
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="">
                              <label for=" number" class="mt-2">Basic</label>
                              <span class="text-danger">*</span>
                              <input
                                v-model="form.basic"
                                type="number"
                                class="form-control border"
                                id="Basic"
                                placeholder="Enter Basic"
                                @change="handleGrossCal"
                              />
                            </div>
                          </div>
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="">
                              <label for="  D.A" class="mt-2">D.A</label>
                              <span class="text-danger">*</span>
                              <input
                                v-model="form.da"
                                type="number"
                                class="form-control border"
                                id=" D.A"
                                placeholder="Enter D.A"
                                @change="handleGrossCal"
                              />
                            </div>
                          </div>
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="HRA  " class="mt-2">HRA</label>
                            <span class="text-danger">*</span>
                            <input
                              v-model="form.hra"
                              type="number"
                              class="form-control border"
                              id="HRA"
                              placeholder="Enter HRA"
                              @change="handleGrossCal"
                            />
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for=" FoodAllow" class="mt-2">Food Allow</label>
                            <span class="text-danger">*</span>
                            <input
                              v-model="form.food_allow"
                              type="number"
                              class="form-control border"
                              id=" FoodAllow"
                              placeholder="Enter  Food Allow"
                              @change="handleGrossCal"
                            />
                          </div>
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="Conveyance" class="mt-2">Conveyance</label>
                            <span class="text-danger">*</span>
                            <input
                              v-model="form.conveyance"
                              type="number"
                              class="form-control border"
                              id="Conveyance"
                              placeholder="Enter Conveyance"
                              @change="handleGrossCal"
                            />
                          </div>
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="">
                              <label for=" number" class="mt-2">Gross</label>
                              <span class="text-danger">*</span>
                              <input
                                v-model="form.gross"
                                type="number"
                                class="form-control border"
                                id="Basic"
                                placeholder="Enter Basic"
                              />
                            </div>
                          </div>
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="ESIC" class="mt-2">ESIC (%)</label>
                            <input
                              v-model.number="form.esic"
                              type="number"
                              class="form-control border"
                              id="ESIC"
                              placeholder="Enter ESIC contribution"
                            />
                          </div>
                          <div
                            class="form-group col-12 col-sm-6 col-md-4 d-flex align-items-center py-2"
                          >
                            <div class="form-check">
                              <input
                                v-model="form.lwf"
                                type="checkbox"
                                class="form-check-input"
                                id="LWF"
                              />
                              <label class="form-check-label" for="LWF">LWF</label>
                            </div>
                          </div>
                          <div
                            class="form-group col-12 col-sm-6 col-md-4 d-flex align-items-center py-2"
                          >
                            <div class="form-check">
                              <input
                                v-model="form.esi"
                                type="checkbox"
                                class="form-check-input"
                                id="ESIC"
                              />
                              <label class="form-check-label" for="LWF">ESIC</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex justify-content-center align-items-center">
                    <button
                      @click="handleUpdate"
                      type="button"
                      class="btn-sm d-block d-sm-none btn-submit mt-4"
                    >
                      Update
                    </button>
                    <button
                      @click="handleUpdate"
                      type="button"
                      class="d-none d-sm-block btn-submit mt-4"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="UpdateDocuments == true" v-auto-animate class="h-100 overflow-y-auto">
                <div class="employee-documents-content">
                  <div class="alert alert-light border mb-4">
                    Upload PDF, JPG, or PNG files up to 4 MB each.
                  </div>
                  <div class="documents-grid">
                    <section v-for="document in employeeDocuments" :key="document.type" class="document-card">
                      <div class="document-card-header">
                        <h6>{{ document.label }}</h6>
                        <span class="document-status" :class="isEmployeeDocumentUploaded(document) ? 'uploaded' : 'pending'">
                          {{ isEmployeeDocumentUploaded(document) ? 'Uploaded' : 'Pending' }}
                        </span>
                      </div>
                      <p class="small text-secondary mt-2 mb-3">
                        {{ isEmployeeDocumentUploaded(document) ? 'A document is on file. You can view, replace, or remove it.' : 'No document has been uploaded yet.' }}
                      </p>
                      <input
                        class="form-control document-file-input"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        :aria-label="`Choose ${document.label}`"
                        :disabled="isDocumentBusy"
                        @change="selectEmployeeDocument($event, document.type)"
                      />
                      <div v-if="selectedDocumentFiles[document.type]" class="small text-secondary mt-2 text-break">
                        {{ selectedDocumentFiles[document.type].name }}
                      </div>
                      <div class="document-actions">
                        <button
                          type="button"
                          class="btn btn-primary"
                          :disabled="!selectedDocumentFiles[document.type] || isDocumentBusy"
                          @click="uploadEmployeeDocument(document)"
                        >
                          <span v-if="uploadingDocumentType === document.type" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                          {{ uploadingDocumentType === document.type ? 'Uploading…' : (isEmployeeDocumentUploaded(document) ? 'Replace' : 'Upload') }}
                        </button>
                        <button
                          v-if="form[document.idField]"
                          type="button"
                          class="btn btn-outline-secondary"
                          :disabled="isDocumentBusy"
                          @click="viewEmployeeDocument(form[document.idField], document.label)"
                        >
                          <i class="bi bi-eye me-1"></i> View
                        </button>
                        <button
                          v-if="form[document.idField]"
                          type="button"
                          class="btn btn-outline-danger"
                          :disabled="isDocumentBusy"
                          @click="handleDeleteDocument(form[document.idField], document.type)"
                        >
                          <span v-if="deletingDocumentType === document.type" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                          {{ deletingDocumentType === document.type ? 'Deleting…' : 'Delete' }}
                        </button>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="previewDocument" class="preview-backdrop" @click.self="closeEmployeeDocumentPreview">
      <section class="preview-dialog" role="dialog" aria-modal="true" :aria-label="previewDocument.label">
        <header class="preview-header">
          <strong>{{ previewDocument.label }}</strong>
          <button type="button" class="btn-close" aria-label="Close preview" @click="closeEmployeeDocumentPreview"></button>
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
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import axiosClient from '../../axiosClient';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';

export default {
  name: 'UpdateEmployee',
  components: {
    Multiselect,
  },

  props: {
    employeeId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      id: '',
      name: 'xyz',
      mobile_no: '11111111',
      email: 'xyz@gmail.com',
      UpdateDocuments: false,
      isUploadingDocument: false,
      uploadingDocumentType: '',
      deletingDocumentType: '',
      selectedDocumentFiles: { adhar: null, asci: null, bank: null },
      previewDocument: null,
      previewUrl: '',
      previewMimeType: '',
      previewLoading: false,
      previewError: '',
      profile_url: '',
      form: {
        _id: '',
        user_id: '',
        name: '',
        fatherHusband_name: '',
        gender: '',
        email: '',
        whatsapp_no: '',
        password: '',
        address: '',
        city: '',
        state: '',
        country: '',
        pin_code: '',
        designation: '',
        date_of_joining: '',

        adhar_card: '',
        uan_no: '',
        pf_no: '',
        esic_no: '',
        bank_name: '',
        bank_ac_no: '',
        bank_ifsc: '',
        pf_basic: '',
        basic: '',
        gross: '',
        da: '',
        hra: '',
        food_allow: '',
        conveyance: '',
        epf: '',
        esic: '',
        lwf: '',
        e_epf: '',
        e_esic: '',
        adhar_proof: false,
        adhar_proof_url_id: '',
        adhar_proof_url: '',
        asci_proof: false,
        asci_proof_url_id: '',
        asci_proof_url: '',
        bank_proof: false,
        bank_proof_url_id: '',
        bank_proof_url: '',
        weeklyOff: [],
      },
      placeholderTeam: '',
      placeholderDepartment: '',
      placeholderRoleType: '',
      token: '',
      selected_roleType: '',
      selected_team: '',
      selected_department: '',
      departments: [],
      roles: [],
      teams: [],
      weekOffOptions: [
        { label: 'Sunday', value: 'Sunday' },
        { label: 'Monday', value: 'Monday' },
        { label: 'Tuesday', value: 'Tuesday' },
        { label: 'Wednesday', value: 'Wednesday' },
        { label: 'Thursday', value: 'Thursday' },
        { label: 'Friday', value: 'Friday' },
        { label: 'Saturday', value: 'Saturday' }
      ],
    };
  },

  async created() {
    this.getCurrent();

    const UpdateDocuments = localStorage.getItem('UpdateDocuments');
    if (UpdateDocuments) {
      this.UpdateDocuments = JSON.parse(UpdateDocuments);
    }

    try {
      console.log('employeeId: ', this.employeeId);
      const employeeRes = await axiosClient.get(`/api/v1/employee/get/${this.employeeId}`);
      console.log('res1: ', employeeRes);
      const employeeData = employeeRes.data.data;

      if (employeeData) {
        this.form = {
          _id: employeeData._id,
          user_id: employeeData.user_id,
          name: employeeData.name,
          fatherHusband_name: employeeData.fatherHusband_name,
          gender: employeeData.gender || '',
          email: employeeData.email,
          whatsapp_no: employeeData.whatsapp_no,
          address: employeeData.address,
          city: employeeData.city,
          state: employeeData.state,
          country: employeeData.country,
          pin_code: employeeData.pin_code,
          designation: employeeData.designation,
          date_of_joining: employeeData.date_of_joining,
          adhar_card: employeeData.adhar_card,
          uan_no: employeeData.uan_no,
          pf_no: employeeData.pf_no,
          esic_no: employeeData.esic_no,
          bank_name: employeeData.bank_name,
          bank_ac_no: employeeData.bank_ac_no,
          bank_ifsc: employeeData.bank_ifsc,
          pf_basic: employeeData.pf_basic,
          basic: employeeData.basic,
          gross: employeeData.gross,
          da: employeeData.da,
          hra: employeeData.hra,
          food_allow: employeeData.food_allow,
          conveyance: employeeData.conveyance,
          epf: employeeData.epf,
          esic: employeeData.esic ?? employeeData.e_esic ?? '',
          lwf: employeeData.lwf,
          esi: employeeData.esi,
          e_epf: employeeData.e_epf,
          e_esic: employeeData.e_esic ?? employeeData.esic ?? '',
          adhar_proof: employeeData.adhar_proof,
          adhar_proof_url: employeeData.adhar_proof_url,
          adhar_proof_url_id: employeeData.adhar_proof_url_id,
          asci_proof: employeeData.asci_proof,
          asci_proof_url: employeeData.asci_proof_url,
          asci_proof_url_id: employeeData.asci_proof_url_id,
          bank_proof: employeeData.bank_proof,
          bank_proof_url: employeeData.bank_proof_url,
          bank_proof_url_id: employeeData.bank_proof_url_id,
          weeklyOff: (employeeData.weeklyOff || []).map(day => {
            // Find the corresponding object from weekOffOptions
            return this.weekOffOptions.find(option => option.value === day) || { label: day, value: day };
          }),
        };
      }

      console.log('form: ', this.form);
      const departments = await axiosClient.get(`/api/v1/department/getall`);
      this.departments = departments.data.data;

      const roles = await axiosClient.get(`/api/v1/role/getall`);
      this.roles = roles.data.data;

      const teams = await axiosClient.get(`/api/v1/team/getall`);
      this.teams = teams.data.data;
      console.log('departments : ', this.departments);
      console.log('roles : ', this.roles);
      console.log('teams : ', this.teams);
    } catch (err) {}
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

  beforeUnmount() {
    this.closeEmployeeDocumentPreview();
  },

  computed: {
    employeeDocuments() {
      return [
        { type: 'adhar', label: 'Aadhaar proof', proofField: 'adhar_proof', urlField: 'adhar_proof_url', idField: 'adhar_proof_url_id' },
        { type: 'asci', label: 'ASCI document', proofField: 'asci_proof', urlField: 'asci_proof_url', idField: 'asci_proof_url_id' },
        { type: 'bank', label: 'Bank proof', proofField: 'bank_proof', urlField: 'bank_proof_url', idField: 'bank_proof_url_id' },
      ];
    },
    isDocumentBusy() {
      return this.isUploadingDocument || Boolean(this.deletingDocumentType);
    },
    formattedDate() {
      //this.form.date_of_joining = this.form.date_of_joining.split('T')[0];
      return this.form.date_of_joining.split('T')[0]; // Converts to 'YYYY-MM-DD'
    },
  },

  methods: {
    isEmployeeDocumentUploaded(document) {
      return Boolean(
        this.form[document.idField] ||
        this.form[document.urlField] ||
        this.form[document.proofField]
      );
    },

    handleGrossCal() {
      const gross = this.form.gross;
      const food_allow = this.form.food_allow;
      const basic = this.form.basic;
      const da = this.form.da;
      const hra = this.form.hra;
      const conveyance = this.form.conveyance;

      this.form.gross = food_allow + basic + da + hra + conveyance;
    },
    handleDateChange() {
      console.log('In handle Date Change');
      console.log(this.form.date_of_joining);
      this.form.date_of_joining = this.formattedDate;
      console.log(this.form.date_of_joining);
    },
    selectEmployeeDocument(event, documentType) {
      const input = event.target;
      const file = input.files?.[0] || null;
      input.value = '';
      if (!file) {
        this.selectedDocumentFiles[documentType] = null;
        return;
      }
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Choose a PDF, JPG, or PNG file.');
        this.selectedDocumentFiles[documentType] = null;
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        toast.error('The file must be 4 MB or smaller.');
        this.selectedDocumentFiles[documentType] = null;
        return;
      }
      this.selectedDocumentFiles[documentType] = file;
    },

    async uploadEmployeeDocument(document) {
      const file = this.selectedDocumentFiles[document.type];
      if (!file || this.isDocumentBusy) return;
      if (!this.form._id) {
        toast.error('Employee record is not loaded yet', { autoClose: 1500 });
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      this.isUploadingDocument = true;
      this.uploadingDocumentType = document.type;

      try {
        const documentRes = await axiosClient.post(
          `/api/v1/document/upload/employee/${document.type}/${this.form._id}`,
          formData
        );
        this.form[document.proofField] = true;
        this.form[document.urlField] = documentRes.data.location.Location;
        this.form[document.idField] = documentRes.data.file_id;
        this.selectedDocumentFiles[document.type] = null;
        toast.success(`${document.label} uploaded successfully.`);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || `Unable to upload ${document.label.toLowerCase()}.`);
      } finally {
        this.isUploadingDocument = false;
        this.uploadingDocumentType = '';
      }
    },

    async handleUpdate() {
      const UpdateDocuments = localStorage.getItem('UpdateDocuments');
      if (UpdateDocuments) {
        this.UpdateDocuments = JSON.parse(UpdateDocuments);
      }

      if (this.validateForm() == false) {
        return;
      }

      this.form.roleType = this.selected_roleType._id;
      this.form.department = this.selected_department._id;
      this.form.team = this.selected_team._id;
      
      this.form.weeklyOff = this.form.weeklyOff.map(option => option.value);

      // Single ESIC field drives both employee & employer ESIC on backend
      this.form.e_esic = this.form.esic;

      try {
        const res = await axiosClient.put(`api/v1/employee/update/${this.form._id}`, this.form);

        if (res) {
          toast.success(`Employee Updated successfully`, {
            autoClose: 1500,
          });

          setTimeout(() => {
            this.$router.push('/manage/employees');
          }, 2000);
        }
      } catch (err) {
        console.log('error: ', err);
        if (err.response.status == 404) {
          toast.error(`User Does Not Exist`, {
            autoClose: 1500,
          });
        } else {
          toast.error(`Something Went Wrong`, {
            autoClose: 1500,
          });
        }
      }

      console.log(this.form);
    },

    handleUpdateDocuments(e) {
      this.UpdateDocuments = e;
      localStorage.setItem('UpdateDocuments', e);
    },

    async viewEmployeeDocument(fileId, label = 'Employee proof') {
      if (!fileId) return;
      this.closeEmployeeDocumentPreview();
      this.previewDocument = { label };
      this.previewLoading = true;
      this.previewError = '';
      try {
        const response = await axiosClient.get(`/api/v1/document/file/${fileId}`, {
          responseType: 'blob',
        });
        this.previewMimeType = response.data.type || response.headers['content-type'] || '';
        this.previewUrl = URL.createObjectURL(response.data);
      } catch (err) {
        this.previewError = err.response?.data?.message || 'Unable to open document.';
      } finally {
        this.previewLoading = false;
      }
    },

    closeEmployeeDocumentPreview() {
      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = '';
      this.previewMimeType = '';
      this.previewLoading = false;
      this.previewError = '';
      this.previewDocument = null;
    },

    async handleDeleteDocument(fileId, fileType) {
      if (!fileId || this.isDocumentBusy) return;
      this.deletingDocumentType = fileType;
      try {
        const entityId = this.form._id || this.employeeId;
        await axiosClient.delete(`/api/v1/document/delete/${entityId}/${fileId}/${fileType}`);
        const document = this.employeeDocuments.find((item) => item.type === fileType);
        if (document) {
          this.form[document.proofField] = false;
          this.form[document.urlField] = '';
          this.form[document.idField] = '';
        }
        toast.success('Document deleted successfully.');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete document.');
      } finally {
        this.deletingDocumentType = '';
      }
    },

    validateForm() {
      if (this.form.name == '') {
        toast.info(`Enter Name`, { autoClose: 1000 });
        return false;
      }

      if (this.form.fatherHusband_name == '') {
        toast.info(`Enter Father/Husband Name`, { autoClose: 1000 });
        return false;
      }

      if (this.form.number == '') {
        toast.info(`Enter Number`, { autoClose: 1000 });
        return false;
      }
      if (this.form.email == '') {
        toast.info(`Enter Email`, { autoClose: 1000 });
        return false;
      }

      let re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(this.form.email)) {
        toast.info(`Enter Valid Email`, { autoClose: 1000 });
        return false;
      }

      if (this.form.designation == '') {
        toast.info(`Enter Designation`, { autoClose: 1000 });
        return false;
      }

      if (this.form.date_of_joining == '') {
        toast.info(`Enter Date of Joining`, { autoClose: 1000 });
        return false;
      }
      if (this.form.pin_code == '') {
        toast.info(`Enter Pin Code`, { autoClose: 1000 });
        return false;
      }

      if (this.form.city == '') {
        toast.info(`Enter City`, { autoClose: 1000 });
        return false;
      }

      if (this.form.state == '') {
        toast.info(`Enter State`, { autoClose: 1000 });
        return false;
      }

      if (this.form.country == '') {
        toast.info(`Enter Country`, { autoClose: 1000 });
        return false;
      }
      if (this.form.address == '') {
        toast.info(`Enter Address`, { autoClose: 1000 });
        return false;
      }

      return true;
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
