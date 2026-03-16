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

.login-wrapper {
  width: 100%;
  max-width: 420px;
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
  margin-bottom: 0.25rem;
}

.brand-subtitle {
  color: rgba(148, 163, 184, 0.8);
  font-size: 0.875rem;
}

.form-container {
  width: 100%;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.form-group {
  margin-bottom: 1.25rem;
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

.btn-login {
  width: 100%;
  padding: 0.7rem;
  background: linear-gradient(135deg, #1e3a5f, #2563eb);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 200ms ease;
}

.btn-login:hover {
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
  color: #ffffff;
}

.btn-secondary-login {
  width: 100%;
  padding: 0.6rem;
  background: transparent;
  color: #475569;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.8125rem;
  transition: all 150ms ease;
}

.btn-secondary-login:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #1e293b;
}

.login-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
  margin-bottom: 1.5rem;
}

@media (max-width: 576px) {
  .login-wrapper { padding: 0 1rem; }
  .form-container { padding: 1.5rem; }
}
</style>

<template>
  <div class="main py-5 d-flex justify-content-center align-items-center">
    <div class="login-wrapper">
      <div class="brand-section">
        <div class="brand-logo">D</div>
        <div class="brand-title">DigitalHR</div>
        <div class="brand-subtitle">Client Portal</div>
      </div>
      <form class="form-container">
        <div class="login-title">Client Login</div>
        <div class="form-group">
          <label for="email">User Name</label>
          <input
            v-model="form.username"
            type="email"
            class="form-control"
            id="email"
            placeholder="Enter Username"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="form-control"
            id="password"
            placeholder="Enter your password"
          />
        </div>
        <div class="w-100 mt-3">
          <button
            type="button"
            @click="handleLogin"
            class="btn btn-login"
          >
            Sign In
          </button>
        </div>
        <div class="w-100 mt-3">
          <button
            type="button"
            @click="handleAdminLogin"
            class="btn btn-secondary-login"
          >
            Go to Admin Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axiosClient from '../axiosClient';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
      },
    };
  },

  async created() {
    const existingToken = localStorage.getItem('token');
    if (!existingToken) return;
    try {
      const token = await axiosClient.get(`api/v1/user/getCurrent/`);
      console.log(token);
      if (token) {
        this.$router.push('/dashboard');
      }
    } catch (err) {
      // token invalid/expired; clear it and stay on login
      localStorage.removeItem('token');
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
    handleEmpLogin() {
      this.$router.push('/employee/login');
    },
    handleAdminLogin() {
      this.$router.push('/login');
    },
    async handleLogin() {
      console.log('form: ', this.form);

      if (!this.form.username) {
        toast.info(`Enter Username`, {
          autoClose: 1500,
        });
        return;
      }

      if (!this.form.password) {
        toast.info(`Enter password`, {
          autoClose: 1500,
        });
        return;
      }

      try {
        const response = await axiosClient.post(`/api/v1/client/login`, this.form);
        console.log(response.data);

        localStorage.setItem('token', response.data.token);

        toast.success(`Login successfull`, {
          autoClose: 1500,
        });

        setTimeout(() => {
          this.$router.push('/dashboard');
        }, 2000);
      } catch (err) {
        if (err.response.status == 404) {
          toast.error(`Client dosen't exist`, {
            autoClose: 1500,
          });
        } else if (err.response.status == 401) {
          toast.error(`Incorrect Password`, {
            autoClose: 1500,
          });
        } else {
          console.error('error: ', err);
          toast.error(`something went wrong`, {
            autoClose: 1500,
          });
        }
      }
    },
  },
};
</script>
