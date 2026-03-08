<style scoped>
.account-page { padding: 2rem; min-height: 100vh; }
.account-header { margin-bottom: 2rem; }
.account-header h4 { font-weight: 700; color: var(--text-primary); margin: 0; }
.account-header p { color: var(--text-secondary); margin: 0.25rem 0 0; font-size: 0.9rem; }
.profile-card { background: #fff; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); overflow: hidden; height: 100%; }
.profile-card-header { background: linear-gradient(135deg, var(--primary), var(--primary-light)); padding: 2rem 1.5rem 3rem; }
.profile-card-body { padding: 1.5rem; text-align: center; margin-top: -2.5rem; }
.profile-avatar { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid #fff; box-shadow: var(--shadow-md); background: #fff; }
.profile-name { font-weight: 600; color: var(--text-primary); margin-top: 0.75rem; font-size: 1.15rem; }
.details-card { background: #fff; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); overflow: hidden; }
.details-card-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-color); font-weight: 600; color: var(--text-primary); font-size: 1rem; }
.details-card-body { padding: 1.5rem; }
.info-group { margin-bottom: 1.25rem; }
.info-group label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.35rem; }
.info-group .form-control:disabled { background-color: var(--bg-body); border-color: var(--border-color); color: var(--text-primary); opacity: 1; }
@media (max-width: 991px) { .account-page { padding: 1.25rem; } .profile-avatar { width: 100px; height: 100px; } }
</style>

<template>
  <div v-auto-animate class="account-page">
    <div class="account-header scroll">
      <h4>View User</h4>
      <p>User account information</p>
    </div>
    <div class="row g-4">
      <div class="col-xl-4">
        <div class="profile-card">
          <div class="profile-card-header"></div>
          <div class="profile-card-body scroll">
            <img v-if="profile" class="profile-avatar" :src="profile" alt="Profile Picture" />
            <img v-else class="profile-avatar" src="../assets/profile-circle.svg" alt="Default Profile Picture" />
            <div class="profile-name">{{ name }}</div>
          </div>
        </div>
      </div>
      <div class="col-xl-8">
        <div class="details-card scroll">
          <div class="details-card-header">Account Details</div>
          <div class="details-card-body">
            <div v-auto-animate>
              <div class="info-group">
                <label for="name">Name</label>
                <input :disabled="true" class="form-control" id="name" type="text" v-model="name" />
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="info-group">
                    <label for="email">Email</label>
                    <input :disabled="true" class="form-control" id="email" type="text" v-model="email" />
                  </div>
                  <div class="info-group">
                    <label for="mobile_no">Mobile Number</label>
                    <input :disabled="true" class="form-control" id="mobile_no" type="text" v-model="mobile_no" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-group" v-if="whatsapp_status">
                    <label for="mobile_no">WhatsApp Number</label>
                    <input :disabled="true" class="form-control" id="mobile_no" type="text" v-model="mobile_no" />
                  </div>
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
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export default {
  name: 'view User',
  data() {
    return {
      id: '',
      name: 'xyz',
      mobile_no: '11111111',
      email: 'xyz@gmail.com',

      profile_url: '',

      token: '',
    };
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
};
</script>
