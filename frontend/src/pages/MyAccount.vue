<style scoped>
.account-page {
  padding: 2rem;
  min-height: 100vh;
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
            <button v-if="!isEditing" @click="startEditing" class="btn btn-primary btn-sm">
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
                    :disabled="true"
                    class="form-control"
                    id="email"
                    type="text"
                    v-model="user.email"
                  />
                  <small class="text-muted" v-if="isEditing">Email cannot be changed</small>
                </div>
                <div class="info-group">
                  <label for="team">Team</label>
                  <input
                    :disabled="true"
                    class="form-control"
                    id="team"
                    type="text"
                    v-model="user.team.name"
                  />
                </div>
                <div class="info-group">
                  <label for="role">Role</label>
                  <input
                    :disabled="true"
                    class="form-control capitalize"
                    id="role"
                    type="text"
                    v-model="user.roleType.name"
                  />
                </div>
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
                <div class="info-group">
                  <label for="department">Department</label>
                  <input
                    :disabled="true"
                    class="form-control capitalize"
                    id="department"
                    type="text"
                    v-model="user.department.name"
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
        whatsapp_no: '',
        profile: null,
      },
      isEditing: false,
      loading: false,
      id: '',
      name: 'xyz',
      mobile_no: '11111111',
      email: 'xyz@gmail.com',

      profile: null,
      profile_url: '',

      token: '',
    };
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
      this.editForm.whatsapp_no = this.user.whatsapp_no;
      this.isEditing = true;
    },

    cancelEditing() {
      this.isEditing = false;
    },

    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.editForm.profile = file;
        this.profile = URL.createObjectURL(file);
      }
    },

    async saveProfile() {
      this.loading = true;
      try {
        const updateData = {
          name: this.editForm.name,
          whatsapp_no: this.editForm.whatsapp_no,
          roleType: this.user.roleType._id,
          department: this.user.department._id,
          team: this.user.team._id,
        };

        await axiosClient.put(`api/v1/user/update/${this.user._id}`, updateData);

        await this.getCurrent();
        this.isEditing = false;
        alert('Profile updated successfully!');
      } catch (err) {
        console.log('error: ', err);
        alert('Failed to update profile.');
      } finally {
        this.loading = false;
      }
    },

    async getCurrent() {
      try {
        const token = await axiosClient.get(`api/v1/user/getCurrent/`);
        if (!token) {
          this.$router.push('/login');
        }
        this.user = token.data.user;
        if (this.user.profile) {
          this.profile = `http://localhost:5000/${this.user.profile}`;
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
