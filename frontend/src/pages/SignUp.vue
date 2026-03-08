<style scoped>
.main {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.main::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.signup-wrapper {
  width: 100%;
  max-width: 600px;
  position: relative;
  z-index: 1;
}

.brand-section {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-logo {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
}

.brand-title {
  color: #ffffff;
  font-size: 1.625rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.form-container {
  width: 100%;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 0.375rem;
}

.form-control {
  background-color: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.65rem 0.875rem;
  font-size: 0.875rem;
  color: #1e293b;
  transition: all 150ms ease;
}

.form-control:focus {
  background-color: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.signup-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
  margin-bottom: 1.5rem;
}

.btn-signup {
  padding: 0.7rem 2rem;
  background: linear-gradient(135deg, #1e3a5f, #2563eb);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 200ms ease;
}

.btn-signup:hover {
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
  color: #ffffff;
}

.login-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
}

.login-link:hover {
  text-decoration: underline;
}

@media (max-width: 576px) {
  .signup-wrapper { padding: 0 1rem; }
  .form-container { padding: 1.5rem; }
}
</style>

<template>
  <div class="main py-5 d-flex justify-content-center align-items-center">
    <div class="signup-wrapper">
      <div class="brand-section">
        <div class="brand-logo">D</div>
        <div class="brand-title">DigitalHR</div>
      </div>
      <form class="form-container">
        <div class="signup-title">Create Account</div>
        <div class="row">
          <div class="form-group col-12 col-md-6">
            <label for="name">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              class="form-control"
              id="name"
              placeholder="Enter name"
            />
          </div>
          <div class="form-group col-12 col-md-6">
            <label for="phone">Phone Number</label>
            <input
              v-model="form.number"
              type="number"
              class="form-control"
              id="phone"
              placeholder="Enter phone number"
            />
          </div>
          <div class="form-group col-12 col-md-6">
            <label for="email">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              id="email"
              placeholder="Enter email"
            />
          </div>
          <div class="form-group col-12 col-md-6">
            <label for="password">Password</label>
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              id="password"
              placeholder="Create password"
            />
          </div>
          <div class="form-group col-12 col-md-6">
            <div class="d-flex align-items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="checkbox"
                class="form-check-input"
                v-model="form.check"
              />
              <label for="checkbox" class="mb-0" style="font-size: 0.8125rem">Terms & Conditions</label>
            </div>
          </div>
          <div class="form-group col-12 col-md-6">
            <div class="d-flex align-items-center gap-3 mt-1">
              <div class="form-check">
                <input type="radio" id="one" class="form-check-input" value="One" v-model="form.radio" />
                <label for="one" class="form-check-label" style="font-size: 0.8125rem">One</label>
              </div>
              <div class="form-check">
                <input type="radio" id="two" class="form-check-input" value="Two" v-model="form.radio" />
                <label for="two" class="form-check-label" style="font-size: 0.8125rem">Two</label>
              </div>
            </div>
          </div>
          <div class="form-group col-12">
            <label>Select Option</label>
            <Multiselect
              v-model="form.select"
              :options="options"
              placeholder="Search and select..."
            ></Multiselect>
          </div>
        </div>
        <div class="w-100 d-flex justify-content-center align-items-center mt-2">
          <button
            @click="handleSignup"
            type="button"
            class="btn btn-signup w-50"
          >
            Sign Up
          </button>
        </div>
        <div class="w-100 text-center mt-3">
          <router-link to="/login" class="login-link">
            Already have an account? Sign in
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export default {
  name: 'SignUp',
  components: {
    Multiselect,
  },
  data() {
    return {
      options: ['option1', 'option2', 'option3', 'option4', 'option5'],
      form: {
        name: '',
        email: '',
        password: '',
        number: '',
        check: false,
        radio: '',
        select: '',
      },
    };
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
    async handleSignup(e) {
      console.log('form: ', this.form);
      toast.success(`Signup successfull`, {
        autoClose: 1500,
      });

      setTimeout(() => {
        this.$router.push('/login');
      }, 2000);
    },
  },
};
</script>
