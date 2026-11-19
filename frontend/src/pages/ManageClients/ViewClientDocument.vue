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
.document-frame { width: 100%; height: 100%; border: 0; }
.document-image { display: block; max-width: 100%; max-height: 100%; margin: auto; object-fit: contain; }

@media (max-width: 576px) {
  .form-container { padding: 1.25rem; }
}
</style>

<template>
  <div class="page-wrapper">
    <div class="vh-100">
      <div class="h-100 d-flex justify-content-center align-items-center">
        <div class="w-100 h-100 py-3">
          <img
            v-if="documentMimeType.startsWith('image/')"
            :src="documentUrl"
            alt="Uploaded document"
            class="document-image"
          />
          <iframe v-else :src="documentUrl" title="Uploaded document" class="document-frame" />
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
    docId: {
      type: String,
      required: true,
    },
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
      client: '',
      documentUrl: '',
      documentMimeType: '',
      documentObjectUrl: '',
      formPage: 1,
      form: {
        user_id: '',
        name: '',
        email: '',
        whatsapp_no: '',
        password: '',
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
    this.getCurrent();
    const clientRes = await axiosClient.get(`/api/v1/client/get/${this.clientId}`);
    const clientData = clientRes.data.data[0];
    console.log('client: ', clientData);
    this.client = clientData;
    this.form = {
      user_id: clientData.user_id,
      name: clientData.name,
      email: clientData.email,
      whatsapp_no: clientData.whatsapp_no,
      password: clientData.password,
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

    if (this.docId == 'adhar_proof_url') {
      this.documentUrl = clientData.adhar_proof_url;
    }
    if (this.docId == 'pan_proof_url') {
      this.documentUrl = clientData.pan_proof_url;
    }
    if (this.docId == 'gst_proof_url') {
      this.documentUrl = clientData.gst_proof_url;
    }
    if (this.docId == 'cin_proof_url') {
      this.documentUrl = clientData.cin_proof_url;
    }

    await this.loadDocument(this.documentUrl);

    console.log('docId', this.docId, ' ', this.clientId);
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

  beforeUnmount() {
    if (this.documentObjectUrl) URL.revokeObjectURL(this.documentObjectUrl);
  },

  methods: {
    async loadDocument(source) {
      if (!source) return;
      if (source.startsWith('/api/v1/document/file/')) {
        const response = await axiosClient.get(source, { responseType: 'blob' });
        this.documentMimeType = response.data.type || response.headers['content-type'] || '';
        this.documentObjectUrl = URL.createObjectURL(response.data);
        this.documentUrl = this.documentObjectUrl;
        return;
      }
      this.documentMimeType = /\.(png|jpe?g)(?:$|\?)/i.test(source) ? 'image/*' : 'application/pdf';
    },

    async handleUpdateClient(e) {
      this.$router.push(`/update/client/${this.clientId}`);
    },

    nameWithLang({ name }) {
      console.log(name);
      return `${name} `;
    },
    changeFormPage() {
      console.log('changeFormPage');
      this.formPage = 2;
    },

    validateForm() {
      console.log('validateForm');

      if (this.form.name === '') {
        toast.info(`Enter Name`, { autoClose: 1000 });
        this.formPage = 1;
        return false;
      }

      if (this.form.whatsapp_no === '') {
        toast.info(`Enter WhatsApp Number`, { autoClose: 1000 });
        this.formPage = 1;
        return false;
      }

      if (this.form.email === '') {
        toast.info(`Enter Email`, { autoClose: 1000 });
        this.formPage = 1;
        return false;
      }

      if (this.form.password === '') {
        toast.info(`Enter Password`, { autoClose: 1000 });
        this.formPage = 1;
        return false;
      }

      if (this.form.address === '') {
        toast.info(`Enter Address`, { autoClose: 1000 });
        this.formPage = 1;
        return false;
      }

      if (this.form.pan_card === '') {
        toast.info(`Enter PAN Card Number`, { autoClose: 1000 });
        this.formPage = 1;
        return false;
      }

      if (this.form.adhar_card === '') {
        toast.info(`Enter Aadhar Card Number`, { autoClose: 1000 });
        this.formPage = 1;
        return false;
      }

      if (this.form.gst_no === '') {
        toast.info(`Enter GST Number`, { autoClose: 1000 });
        this.formPage = 1;
        return false;
      }

      if (this.form.cin_no === '') {
        toast.info(`Enter CIN Number`, { autoClose: 1000 });
        this.formPage = 1;
        return false;
      }

      if (this.form.industry_type === '') {
        toast.info(`Enter Industry Type`, { autoClose: 1000 });
        this.formPage = 1;
        return false;
      }

      if (this.form.employee_count_range === '') {
        toast.info(`Enter Employee Count Range`, { autoClose: 1000 });
        this.formPage = 1;
        return false;
      }
      if (this.form.incorporation_type === '') {
        toast.info(`Enter Incorporation Type`, { autoClose: 1000 });
        this.formPage = 1;
        return false;
      }
      if (this.form.contact_person.name === '') {
        toast.info(`Enter Contact Person Name`, { autoClose: 1000 });
        this.formPage = 2;
        return false;
      }

      if (this.form.contact_person.email === '') {
        toast.info(`Enter Contact Person Email`, { autoClose: 1000 });
        this.formPage = 2;
        return false;
      }

      if (this.form.contact_person.contact_no === '') {
        toast.info(`Enter Contact Person Contact Number`, { autoClose: 1000 });
        this.formPage = 2;
        return false;
      }

      if (this.form.contact_person.designation === '') {
        toast.info(`Enter Contact Person Designation`, { autoClose: 1000 });
        this.formPage = 2;
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
        this.form.user_id = token.data.user._id;
      } catch (err) {
        console.log('error: ', err);
        this.$router.push('/login');
      }
    },
  },
};
</script>
