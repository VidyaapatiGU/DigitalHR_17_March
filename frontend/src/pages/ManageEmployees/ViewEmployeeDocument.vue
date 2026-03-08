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

@media (max-width: 576px) {
  .form-container { padding: 1.25rem; }
}
</style>

<template>
  <div class="page-wrapper">
    <div class="vh-100">
      <div class="h-100 d-flex justify-content-center align-items-center">
        <div class="w-100 h-100 py-3">
          <embed
            :src="documentUrl"
            type="application/pdf"
            width="100%"
            height="100%"
            class="h-100"
          />
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
    employeeId: {
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
    console.log('docId', this.docId, ' ', this.employeeId);
    this.getCurrent();
    const clientRes = await axiosClient.get(`/api/v1/employee/get/${this.employeeId}`);
    const employeeData = clientRes.data.data;
    console.log('employeeData: ', employeeData);
    this.client = employeeData;

    if (this.docId == 'adhar_proof_url') {
      console.log('adhar_proof_url: ');
      this.documentUrl = employeeData.adhar_proof_url;
    }
    if (this.docId == 'asci_proof_url') {
      console.log('asci_proof_url: ');
      this.documentUrl = employeeData.asci_proof_url;
    }
    if (this.docId == 'gst_proof_url') {
      console.log('gst_proof_url: ');
      this.documentUrl = employeeData.bank_proof_url;
    }
  },

  mounted() {
    gsap.registerPlugin(ScrollTrigger);
    /*  gsap.from('.form-container', {
      opacity: 0,
      y: 50,
      duration: 0.5,
      scrollTrigger: {
        trigger: '.form-container',
        delay: 0.5,
        start: 'top center',
        toggleActions: 'play none none reverse',
      },
    }); */
  },

  methods: {
    async handleUpdateClient(e) {
      this.$router.push(`/update/client/${this.employeeId}`);
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
