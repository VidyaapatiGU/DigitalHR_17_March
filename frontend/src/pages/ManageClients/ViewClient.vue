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

.doc-link {
  color: var(--primary); text-decoration: none; font-size: 0.875rem; font-weight: 500;
}
.doc-link:hover { text-decoration: underline; }

@media (max-width: 576px) {
  .form-container { padding: 1.25rem; }
}
</style>

<template>
  <div class="page-wrapper">
    <div class="page-header-bar">
      <h5>View Client</h5>
    </div>

    <div class="overflow-y-hidden pb-5 h-100">
      <div class="h-100 overflow-y-auto d-flex justify-content-center align-items-center">
        <div class="container" style="margin-top: 150px">
          <form v-auto-animate class="form-container">
            <h4 class="text-center form-title">Client</h4>
            <div class="row">
              <div class="col-md-4"></div>
              <div class="col-md-4">
                <label for="name source-500" class="source-500">Client Code</label>
                <input
                  disabled
                  v-model="form.clientCode"
                  type="text"
                  class="form-control border"
                  id="name"
                  placeholder="Enter Name"
                />
              </div>
              <div class="col-md-4"></div>
            </div>

            <div v-if="formPage == 1" class="row">
              <div class="form-group col-12 col-md-6 col-lg-4">
                <label for="name source-500" class="source-500">Name</label>
                <input
                  disabled
                  v-model="form.name"
                  type="text"
                  class="form-control border"
                  id="name"
                  placeholder="Enter Name"
                />
                <label for="email" class="source-500 mt-2">Email Address</label>
                <input
                  disabled
                  v-model="form.email"
                  type="email"
                  class="form-control border"
                  id="email"
                  placeholder="Enter Email"
                />
                <label for="pan_card" class="source-500 mt-2">Pan Card</label>
                <input
                  disabled
                  v-model="form.pan_card"
                  type="text"
                  class="form-control border"
                  id="pan_card"
                  placeholder="Enter Pan Number"
                />

                <label for="gst_no" class="source-500 mt-2">GST Number</label>
                <input
                  disabled
                  v-model="form.gst_no"
                  type="number"
                  class="form-control border"
                  id="gst_no"
                  placeholder="Enter GST Number"
                />
                <label for="incorporation_type" class="source-500 mt-2">Incorporation Type</label>
                <input
                  disabled
                  v-model="form.incorporation_type"
                  type="text"
                  class="form-control border"
                  id="incorporation_type"
                  placeholder="N/A"
                />
              </div>
              <!-- /////////////////////////////////////////////////////////////////////////////////////////////////// -->
              <div class="form-group col-12 col-md-6 col-lg-4">
                <label for="phone_number source-500" class="source-500">Client Username</label>
                <input
                  disabled
                  v-model="form.username"
                  type="text"
                  class="form-control border"
                  id="username"
                  placeholder="Enter username"
                />
                <label for="phone_number source-500" class="source-500">WhatsApp Number</label>
                <input
                  disabled
                  v-model="form.whatsapp_no"
                  type="number"
                  class="form-control border"
                  id="phone_number"
                  placeholder="Enter Whatsapp Number"
                />

                <!-- <label for="adhar_card" class="source-500 mt-2">Adhar Card</label>
                <input
                  disabled
                  v-model="form.adhar_card"
                  type="number"
                  class="form-control border"
                  id="adhar_card"
                  placeholder="Enter Adhar Number"
                /> -->

                <label for="cin_no" class="source-500 mt-2">CIN Number</label>
                <input
                  disabled
                  v-model="form.cin_no"
                  type="number"
                  class="form-control border"
                  id="cin_no"
                  placeholder="Enter CIN Number"
                />
                <label for="employee_count_range" class="source-500 mt-2">
                  Number Of Employees
                </label>
                <input
                  disabled
                  v-model="form.employee_count_range"
                  type="number"
                  class="form-control border"
                  id="employee_count_range"
                  placeholder="Number Of Employees"
                />
                <label for="industry_type" class="source-500 mt-2">Industry Type</label>
                <input
                  disabled
                  v-model="form.industry_type"
                  type="text"
                  class="form-control border"
                  id="employee_count_range"
                  placeholder="N/A"
                />
              </div>
              <div class="form-group col-12 col-md-6 col-lg-4">
                <label for="contact_person.name" class="source-500 mt-0">Conatact Name</label>
                <input
                  disabled
                  v-model="form.contact_person.name"
                  type="text"
                  class="form-control border"
                  id="contact_person.name"
                  placeholder="Enter Contact Name"
                />
                <label for="contact_person.contact_no" class="source-500 mt-2">
                  Conatct Number
                </label>
                <input
                  disabled
                  v-model="form.contact_person.contact_no"
                  type="number"
                  class="form-control border"
                  id="contact_person.contact_no"
                  placeholder="Enter Conatct Number"
                />
                <label for="contact_person.email" class="source-500 mt-2">Conatct Email</label>
                <input
                  disabled
                  v-model="form.contact_person.email"
                  type="text"
                  class="form-control border"
                  id="contact_person.email"
                  placeholder="Enter Conatct Email "
                />
                <label for="contact_person.designation" class="source-500 mt-2">
                  Contact Designation
                </label>
                <input
                  disabled
                  v-model="form.contact_person.designation"
                  type="text"
                  class="form-control border"
                  id="contact_person.designation"
                  placeholder="Enter Contact Designation"
                />
                <label for="address" class="source-500 mt-2">Address</label>
                <textarea
                  v-model="form.address"
                  type="text"
                  class="form-control border"
                  id="address"
                  placeholder="Enter Address"
                />
              </div>
              <div class="form-check">
                <input
                  v-model="form.pf_enable"
                  type="checkbox"
                  class="form-check-input"
                  id="pf_enable"
                  disabled
                />
                <label class="form-check-label" for="pf_enable">PF Enabled?</label>
              </div>
              <div class="form-check">
                <input
                  v-model="form.esic_enable"
                  type="checkbox"
                  class="form-check-input"
                  id="esic_enable"
                  disabled
                />
                <label class="form-check-label" for="esic_enable">ESCI Enabled?</label>
              </div>
            </div>
            <hr />
            <div v-if="formPage == 2" class="mt-3 mb-2 source-600 d-flex gap-2">
              <div v-if="formPage == 2" @click="formPage = 1" class="pointer pb-2">
                <i class="bi bi-arrow-left icon-font-2"></i>
              </div>
              <div class="w-100 text-center">
                <h5>Contact Person Information</h5>
              </div>
            </div>

            <div class="d-flex justify-content-around mt-3">
              <div>
                <div
                  v-if="client.adhar_proof == true"
                  @click="handleRedirect(`view/document/${clientId}/adhar_proof_url`)"
                  class="pointer"
                >
                  Adhar Proof
                  <i class="bi bi-link-45deg"></i>
                  <i class="mx-2 bi bi-check-circle icon-font-2 text-success"></i>
                </div>
                <div v-else class="text-secondary">Adhar Proof</div>
              </div>
              <div>
                <div
                  v-if="client.pan_proof == true"
                  @click="handleRedirect(`view/document/${clientId}/pan_proof_url`)"
                  class="pointer"
                >
                  Pan Proof
                  <i class="bi bi-link-45deg"></i>
                  <i class="mx-2 bi bi-check-circle icon-font-2 text-success"></i>
                </div>
                <div v-else class="text-secondary">Pan Proof</div>
              </div>
              <div>
                <div
                  v-if="client.gst_proof == true"
                  @click="handleRedirect(`view/document/${clientId}/gst_proof_url`)"
                  class="pointer"
                >
                  GST proof
                  <i class="bi bi-link-45deg"></i>
                  <i class="mx-2 bi bi-check-circle icon-font-2 text-success"></i>
                </div>
                <div v-else class="text-secondary">GST proof</div>
              </div>
              <div>
                <div
                  v-if="client.cin_proof == true"
                  @click="handleRedirect(`view/document/${clientId}/cin_proof_url`)"
                  class="pointer"
                >
                  CIN Proof
                  <i class="bi bi-link-45deg"></i>
                  <i class="mx-2 bi bi-check-circle icon-font-2 text-success"></i>
                </div>
                <div v-else class="text-secondary">CIN Proof</div>
              </div>
            </div>

            <div v-if="formPage == 2" class="row">
              <div class="form-group col-12 col-md-6"></div>
              <div class="form-group col-12 col-md-6"></div>
            </div>
            <div class="w-100 d-flex justify-content-end px-3 align-items-center">
              <button
                v-if="formPage == 1"
                @click="handleUpdateClient(`update/client/${clientId}`)"
                type="button"
                class="btn-submit mt-4"
              >
                <i class="bi bi-pen-fill"></i>
              </button>
              <button
                v-if="formPage == 2"
                @click="handleUpdateClient(`update/client/${clientId}`)"
                type="button"
                class="btn-submit mt-4"
              >
                <i class="bi bi-pen-fill"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosClient from '../../axiosClient';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export default {
  name: 'UpdateClientClient',
  props: {
    clientId: {
      type: String,
      required: true,
    },
  },

  components: {
    Multiselect,
  },
  data() {
    return {
      user_id: '',
      client: '',
      formPage: 1,
      form: {
        user_id: '',
        _id: '',
        name: '',
        username: '',
        clientCode: '',
        esic_enable: '',
        pf_enable: '',
        email: '',
        whatsapp_no: '',
        address: '',
        pan_card: '',
        adhar_card: '',
        gst_no: '',
        cin_no: '',
        industry_type: '',
        employee_count_range: '',
        address: '',
        contact_person: {
          name: ' ',
          email: '',
          contact_no: '',
          designation: '',
        },
        incorporation_type: '',
      },
      industry_typeOptions: ['Factories', 'Restaurants', 'Hotels', 'IT Company'],
      incorporation_typeOptions: [
        'Proprietory Firm',
        'Partnership Firm',
        'LLP',
        'Private Limited',
        'Public Limited',
        'Local Bodies / Municipal Corporations',
        'State Govt. Controlled',
        'State Govt. Department',
        'Co-Operative Society',
        'Registered Society',
        'Firms Run by Trust',
      ],
    };
  },

  async created() {
    //const currentPageUrl = window.location.href;
    //  const currentPageUrlArray = currentPageUrl.split('/');
    console.log('created');
    await this.getCurrent();
    console.log(this.user_id);
    try {
      const clientRes = await axiosClient.get(`/api/v1/client/get/${this.clientId}`);
      const clientData = clientRes.data.data[0];
      this.client = clientData;
      console.log('res: ', clientRes.data.data[0]);
      this.form = {
        _id: clientData._id,
        name: clientData.name,
        username: clientData.username,
        clientCode: clientData.client_code,
        pf_enable: clientData.pf_enable,
        esic_enable: clientData.esic_enable,
        email: clientData.email,
        whatsapp_no: clientData.whatsapp_no,
        address: clientData.address,
        pan_card: clientData.pan_card,
        adhar_card: clientData.adhar_card,
        gst_no: clientData.gst_no,
        cin_no: clientData.cin_no,
        industry_type: clientData.industry_type,
        employee_count_range: clientData.employee_count_range,
        contact_person: {
          name: clientData.contact_person.name,
          email: clientData.contact_person.email,
          contact_no: clientData.contact_person.contact_no,
          designation: clientData.contact_person.designation,
        },
        incorporation_type: clientData.incorporation_type,
      };
      console.log('user id');
      console.log(this.user_id);
      const userRes = await axiosClient.get(`/api/v1/user/get/${this.user_id}`);
      console.log('userRes');
      console.log(userRes);

      const userData = userRes.data.data[0];
      this.form.address = userData.address;

      console.log('form: ', this.form);
    } catch (err) {
      console.log(err);
    }
  },

  mounted() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.form-container', {
      opacity: 0,
      y: 50,
      duration: 0.5,
      scrollTrigger: {
        trigger: '.form-container',
        delay: 0.5,
        start: 'top center',
        toggleActions: 'play none none reverse',
      },
    });
  },

  methods: {
    handleUpdateClient(link) {
      this.$router.push(`/${link}`);
    },
    handleRedirect(link) {
      const route = this.$router.resolve(`/${link}`);
      window.open(route.href, '_blank');
    },

    async getCurrent() {
      try {
        const token = await axiosClient.get(`api/v1/user/getCurrent/`);
        console.log('Token : ', token);

        if (!token) {
          this.$router.push('/login');
        }

        this.user_id = token.data.user._id;
        console.log(this.user_id);
      } catch (err) {
        console.log('error: ', err);
        this.$router.push('/login');
      }
    },
  },
};
</script>
