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

.form-group label, .section-label {
  font-size: 0.82rem; font-weight: 500; color: var(--text-secondary);
  margin-bottom: 0.25rem; display: block;
}

.section-heading {
  font-weight: 600; font-size: 0.95rem; color: var(--text-primary);
  padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color);
  margin-top: 1.5rem; margin-bottom: 1rem;
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

.salary-input .form-control:disabled {
  background-color: #f8fafc; color: var(--text-primary); opacity: 1;
}

@media (max-width: 576px) {
  .form-container { padding: 1.25rem; }
}
</style>

<template>
  <div v-auto-animate class="page-wrapper">
    <div class="page-header-bar">
      <h5>View Employee</h5>
    </div>

    <div class="overflow-y-hidden pb-5 h-100">
      <div class="h-100 overflow-y-auto">
        <div class="container p-4">
          <div class="main2">
            <div class="container-xl px-4">
              <div v-auto-animate class="row">
                <!-- <div class="col-xl-4">
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
                            <div class="mb-3">
                              <label class="small mb-1" for="name">Username</label>
                              <input
                                disabled
                                class="form-control"
                                id="name"
                                type="text"
                                v-model="form.username"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="row mb3">
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="mb-3">
                              <label class="small mb-1" for="name">Name</label>
                              <input
                                disabled
                                class="form-control"
                                id="name"
                                type="text"
                                v-model="form.name"
                              />
                            </div>
                          </div>
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="mb-3">
                              <label class="small mb-1" for="name">Father/Husbands Name</label>
                              <input
                                disabled
                                class="form-control"
                                id="name"
                                type="text"
                                v-model="form.fatherHusband_name"
                              />
                            </div>
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label class="small mb-1" for="name">Email</label>
                            <input
                              disabled
                              class="form-control"
                              id="email"
                              type="text"
                              v-model="form.email"
                            />
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="mt-2">
                              <label class="small mb-1" for="designation">Designation</label>
                              <input
                                disabled
                                class="form-control"
                                id="designation"
                                type="text"
                                v-model="form.designation"
                              />
                            </div>
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="">
                              <label class="small mb-1" for="mobile_no">whatsapp Number</label>
                              <input
                                disabled
                                class="form-control"
                                id="mobile_no"
                                type="text"
                                v-model="form.whatsapp_no"
                              />
                            </div>
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="mt-2">
                              <label class="small mb-1" for="mobile_no">Joining Date</label>
                              <input
                                disabled
                                class="form-control"
                                id="mobile_no"
                                type="text"
                                v-model="form.date_of_joining"
                              />
                            </div>
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="">
                              <label class="small mb-1" for="city">City</label>
                              <input
                                disabled
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
                              <textarea
                                disabled
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
                              <input
                                disabled
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
                              <input
                                disabled
                                class="form-control"
                                id="country"
                                type="text"
                                v-model="form.country"
                              />
                            </div>
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="">
                              <label class="small mb-1" for="pin_code">Pin Code</label>
                              <input
                                disabled
                                class="form-control"
                                id="pin_code"
                                type="text"
                                v-model="form.pin_code"
                              />
                            </div>
                          </div>
                        </div>
                        <hr />

                        <!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

                        <div class="row source-400 mt-3">
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="Adhar " class="mt-2">Adhar No</label>
                            <input
                              disabled
                              v-model="form.adhar_card"
                              type="number"
                              class="form-control border"
                              id="Adhar"
                              placeholder="Enter Adhar No"
                            />
                          </div>
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="UAN " class="mt-2">UAN No</label>
                            <input
                              disabled
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
                              disabled
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
                              disabled
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
                            <input
                              disabled
                              v-model="form.bank_name"
                              type="text"
                              class="form-control border"
                              id="Bank_name"
                              placeholder="Enter Bank Name"
                            />
                          </div>
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="bankAc" class="mt-2">Bank A/C No</label>
                            <input
                              disabled
                              v-model="form.bank_ac_no"
                              type="number"
                              class="form-control border"
                              id="bankAc"
                              placeholder="Enter Bank A/C No"
                            />
                          </div>
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="bankIfsc" class="mt-2">Bank IFSC</label>
                            <input
                              disabled
                              v-model="form.bank_ifsc"
                              type="text"
                              class="form-control border"
                              id="bankIfsc"
                              placeholder="Enter  Bank IFSC"
                            />
                          </div>
                        </div>

                        <!-- <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for=" PFBasic" class="mt-2">PF Basic</label>
                            <input
                              disabled
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
                              <input
                                disabled
                                v-model="form.basic"
                                type="number"
                                class="form-control border"
                                id="Basic"
                                placeholder="Enter  Basic"
                              />
                            </div>
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="">
                              <label for="  D.A" class="mt-2">D.A</label>
                              <input
                                disabled
                                v-model="form.da"
                                type="number"
                                class="form-control border"
                                id=" D.A"
                                placeholder="Enter   D.A"
                              />
                            </div>
                          </div>

                          <!-- ///////////////////////////////////////////// -->
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="HRA  " class="mt-2">HRA</label>
                            <input
                              disabled
                              v-model="form.hra"
                              type="number"
                              class="form-control border"
                              id="HRA"
                              placeholder="Enter HRA"
                            />
                          </div>

                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for=" FoodAllow" class="mt-2">Food Allow</label>
                            <input
                              disabled
                              v-model="form.food_allow"
                              type="number"
                              class="form-control border"
                              id=" FoodAllow"
                              placeholder="Enter  Food Allow"
                            />
                          </div>
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="Conveyance" class="mt-2">Conveyance</label>
                            <input
                              disabled
                              v-model="form.conveyance"
                              type="number"
                              class="form-control border"
                              id="Conveyance"
                              placeholder="Enter Conveyance"
                            />
                          </div>
                          <div class="form-group col-12 col-sm-6 col-md-4">
                            <div class="">
                              <label for=" number" class="mt-2">Gross</label>
                              <input
                                disabled
                                v-model="form.gross"
                                type="number"
                                class="form-control border"
                                id="Basic"
                                placeholder="Enter  Basic"
                              />
                            </div>
                          </div>
                          <!-- <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="EPF" class="mt-2">EPF</label>
                            <input
                              disabled
                              v-model="form.epf"
                              type="number"
                              class="form-control border"
                              id="EPF"
                              placeholder="Enter EPF"
                            />
                          </div> -->
                          <!--  <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="ESIC" class="mt-2">ESIC</label>
                            <input
                              disabled
                              v-model="form.esic"
                              type="number"
                              class="form-control border"
                              id="ESIC"
                              placeholder="Enter ESIC"
                            />
                          </div> -->

                          <!-- <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="E_EPF" class="mt-2">E_EPF</label>
                            <input
                              disabled
                              v-model="form.e_epf"
                              type="number"
                              class="form-control border"
                              id="E_EPF"
                              placeholder="Enter E_EPF"
                            />
                          </div> -->
                          <!-- <div class="form-group col-12 col-sm-6 col-md-4">
                            <label for="E_ESIC" class="mt-2">E_ESIC</label>
                            <input
                              disabled
                              v-model="form.e_esic"
                              type="number"
                              class="form-control border"
                              id="E_ESIC"
                              placeholder="Enter E_ESIC"
                            />
                          </div> -->
                          <div
                            class="form-group col-12 col-sm-6 col-md-4 d-flex align-items-center py-2"
                          >
                            <div class="form-check">
                              <input
                                disabled
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
                                disabled
                                v-model="form.esi"
                                type="checkbox"
                                class="form-check-input"
                                id="esi"
                              />
                              <label class="form-check-label" for="ESIC">ESIC</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="d-flex justify-content-around mt-3">
                        <div>
                          <div
                            v-if="form.adhar_proof == true"
                            @click="
                              handleRedirect(`view/employee/document/${employeeId}/adhar_proof_url`)
                            "
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
                            v-if="form.asci == true"
                            @click="
                              handleRedirect(`view/employee/document/${employeeId}/asci_proof_url`)
                            "
                            class="pointer"
                          >
                            ASCI Proof
                            <i class="bi bi-link-45deg"></i>
                            <i class="mx-2 bi bi-check-circle icon-font-2 text-success"></i>
                          </div>
                          <div v-else class="text-secondary">ASCI Proof</div>
                        </div>
                        <div>
                          <div
                            v-if="form.bank_proof == true"
                            @click="
                              handleRedirect(`view/employee/document/${employeeId}/bank_proof_url`)
                            "
                            class="pointer"
                          >
                            Bank proof
                            <i class="bi bi-link-45deg"></i>
                            <i class="mx-2 bi bi-check-circle icon-font-2 text-success"></i>
                          </div>
                          <div v-else class="text-secondary">Bank proof</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="d-flex justify-content-center align-items-center">
                    <button
                      @click="handleUpdate"
                      type="button"
                      class="btn-sm d-block d-sm-none btn btn-primary border-0 button_bg source-500 text-light mt-4 px-5"
                    >
                      Update
                    </button>
                    <button
                      @click="handleUpdate"
                      type="button"
                      class="d-none d-sm-block btn btn-primary border-0 button_bg source-500 text-light mt-4 px-5"
                    >
                      Update
                    </button>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

      profile_url: '',
      form: {
        username: '',
        _id: '',
        user_id: '',
        name: '',
        fatherHusband_name: '',
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
        esi: '',
        e_epf: '',
        e_esic: '',
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
    };
  },

  async created() {
    this.getCurrent();
    try {
      console.log('employeeId: ', this.employeeId);
      const employeeRes = await axiosClient.get(`/api/v1/employee/get/${this.employeeId}`);
      console.log('res: ', employeeRes);
      const employeeData = employeeRes.data.data;

      if (employeeData) {
        this.form = {
          _id: employeeData._id,
          user_id: employeeData.user_id,
          username: employeeData.username,
          name: employeeData.name,
          fatherHusband_name: employeeData.fatherHusband_name,
          email: employeeData.email,
          whatsapp_no: employeeData.whatsapp_no,
          address: employeeData.address,
          city: employeeData.city,
          state: employeeData.state,
          country: employeeData.country,
          pin_code: employeeData.pin_code,
          designation: employeeData.designation,
          date_of_joining: employeeData.date_of_joining.slice(0, 10),

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
          esic: employeeData.esic,
          lwf: employeeData.lwf,
          esi: employeeData.esi,
          e_epf: employeeData.e_epf,
          e_esic: employeeData.e_esic,
          adhar_proof: employeeData.adhar_proof,
          adhar_proof_url: employeeData.adhar_proof_url,
          adhar_proof_id: employeeData.adhar_proof_id,
          asci_proof: employeeData.asci_proof,
          asci_proof_url: employeeData.asci_proof_url,
          asci_proof_id: employeeData.asci_proof_id,
          bank_proof: employeeData.bank_proof,
          bank_proof_url: employeeData.bank_proof_url,
          bank_proof_id: employeeData.bank_proof_id,
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

  methods: {
    async handleUpdate() {
      this.$router.push(`/update/employee/${this.form._id}`);
    },

    handleRedirect(link) {
      const route = this.$router.resolve(`/${link}`);
      window.open(route.href, '_blank');
    },

    validateForm() {
      if (this.form.name == '') {
        toast.info(`Enter Name`, { autoClose: 1000 });
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

      /* " 

      form: {
      
        _id: '',
        user_id: '',
        name: '',
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

        
      },
      
      " */

      if (this.form.adhar_card == '') {
        toast.info(`Enter Adhar Card`, { autoClose: 1000 });
        return false;
      }

      if (this.form.uan_no == '') {
        toast.info(`Enter UAN No`, { autoClose: 1000 });
        return false;
      }

      if (this.form.pf_no == '') {
        toast.info(`Enter PF No`, { autoClose: 1000 });
        return false;
      }

      if (this.form.esic_no == '') {
        toast.info(`Enter ESIC No`, { autoClose: 1000 });
        return false;
      }

      if (this.form.bank_name == '') {
        toast.info(`Enter Bank Name`, { autoClose: 1000 });
        return false;
      }

      if (this.form.bank_ac_no == '') {
        toast.info(`Enter Bank Account No`, { autoClose: 1000 });
        return false;
      }

      if (this.form.bank_ifsc == '') {
        toast.info(`Enter Bank IFSC`, { autoClose: 1000 });
        return false;
      }

      if (this.form.pf_basic == '') {
        toast.info(`Enter PF Basic`, { autoClose: 1000 });
        return false;
      }

      if (this.form.basic == '') {
        toast.info(`Enter Basic`, { autoClose: 1000 });
        return false;
      }

      if (this.form.gross == '') {
        toast.info(`Enter Gross`, { autoClose: 1000 });
        return false;
      }

      if (this.form.da == '') {
        toast.info(`Enter DA`, { autoClose: 1000 });
        return false;
      }

      if (this.form.hra == '') {
        toast.info(`Enter HRA`, { autoClose: 1000 });
        return false;
      }

      if (this.form.food_allow == '') {
        toast.info(`Enter Food Allowance`, { autoClose: 1000 });
        return false;
      }

      if (this.form.conveyance == '') {
        toast.info(`Enter Conveyance`, { autoClose: 1000 });
        return false;
      }

      if (this.form.epf == '') {
        toast.info(`Enter EPF`, { autoClose: 1000 });
        return false;
      }

      if (this.form.esic == '') {
        toast.info(`Enter ESIC`, { autoClose: 1000 });
        return false;
      }

      if (this.form.lwf == '') {
        toast.info(`Enter LWF`, { autoClose: 1000 });
        return false;
      }

      if (this.form.e_epf == '') {
        toast.info(`Enter E-EPF`, { autoClose: 1000 });
        return false;
      }

      if (this.form.e_esic == '') {
        toast.info(`Enter E-ESIC`, { autoClose: 1000 });
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
