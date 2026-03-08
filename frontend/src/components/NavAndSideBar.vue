<style scoped>
ul {
  list-style-type: none;
  padding-left: 0;
}

.offcanvas {
  width: 280px;
}

.top-navbar {
  background: linear-gradient(135deg, #0f172a, #1e3a5f);
  border: none;
  padding: 0.65rem 1.25rem;
}

.top-navbar .navbar-brand {
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.3px;
  color: #fff;
}

.brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  margin-right: 0.5rem;
  font-size: 0.85rem;
}

.dropdown-toggle {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-md);
  padding: 0.35rem 0.75rem;
  color: #fff;
  transition: var(--transition-fast);
}

.dropdown-toggle:hover {
  background: rgba(255, 255, 255, 0.15);
}

.dropdown-menu {
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  background: #fff;
  padding: 0.35rem;
}

.dropdown-menu .dropdown-item {
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.dropdown-menu .dropdown-item:hover {
  background: var(--bg-body);
}

.offcanvas-nav {
  background: linear-gradient(180deg, #0f172a, #1a1f35);
  border-right: none;
}

.offcanvas-nav .offcanvas-header {
  padding: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.offcanvas-nav .offcanvas-title {
  font-weight: 700;
  font-size: 1.1rem;
}

.nav-item-mobile {
  padding: 0.7rem 0.75rem;
  border-radius: var(--radius-md);
  margin-bottom: 0.25rem;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.75);
  transition: var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.nav-item-mobile:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.nav-item-mobile i {
  font-size: 1.15rem;
  width: 24px;
  text-align: center;
}

.btn-close-mobile {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  padding: 0.25rem;
}

.btn-close-mobile:hover {
  color: #fff;
}
</style>

<template>
  <div class="main source-400">
    <nav class="navbar navbar-expand-lg top-navbar pe-0 px-sm-5 shadow-sm">
      <div class="container-fluid">
        <div class="navbar-brand d-block d-sm-none">
          <div class="offacanvas-items">
            <button
              class="btn btn-transparent"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExampleNav"
              aria-controls="offcanvasExampleNav "
            >
              <span class="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
        <a class="navbar-brand d-flex align-items-center" href="#">
          <span class="brand-icon"><i class="bi bi-grid-fill"></i></span>
          DigitalHR
        </a>

        <div class="collapse navbar-collapse pe-sm-5" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <div class="text-light">
            <div v-if="ifLoggedIn" class="nav-item dropdown d-none d-sm-block">
              <button
                class="btn dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  v-if="profile"
                  class="img-account-profile rounded-circle"
                  :src="form.profile"
                  alt="Profile Picture"
                  style="width: 28px; height: 28px; object-fit: cover"
                />
                <i v-else class="bi bi-person-circle" style="font-size: 1.1rem"></i>
              </button>
              <ul class="dropdown-menu">
                <li>
                  <div @click="handleRedirect('account')" class="dropdown-item pointer">
                    My Account
                  </div>
                </li>
                <li @click="handleLogOut"><div class="dropdown-item pointer">Log Out</div></li>
              </ul>
            </div>
            <div v-else>
              <button
                type="button"
                @click="handleRedirect('login')"
                class="btn btn-transparent border-0"
              >
                <i class="bi bi-power text-light" style="font-size: 1.3rem"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div
      class="offcanvas offcanvas-start offcanvas-nav text-light"
      data-bs-backdrop="false"
      tabindex="-1"
      id="offcanvasExampleNav"
      aria-labelledby="offcanvasExampleNavLabel"
    >
      <div class="offcanvas-header d-flex justify-content-between">
        <h5 class="offcanvas-title source-400 d-flex align-items-center" id="offcanvasExampleNavLabel">
          <span class="brand-icon me-2"><i class="bi bi-grid-fill"></i></span>
          DigitalHR
        </h5>
        <button
          type="button"
          class="btn-close-mobile"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="offcanvas-body w-100 px-2">
        <ul>
          <li
            class="pointer nav-item-mobile"
            data-bs-toggle="offcanvas"
            @click="handleRedirect('dashboard')"
          >
            <i class="bi bi-speedometer"></i>
            Dashboard
          </li>
          <li
            class="pointer nav-item-mobile"
            data-bs-toggle="offcanvas"
            @click="handleRedirect('data/table')"
          >
            <i class="bi bi-table"></i>
            Data Table
          </li>
          <li
            class="pointer nav-item-mobile"
            data-bs-toggle="offcanvas"
            @click="handleRedirect('create/user')"
          >
            <i class="bi bi-person-fill-add"></i>
            Create User
          </li>
          <li
            class="pointer nav-item-mobile"
            data-bs-toggle="offcanvas"
            @click="handleRedirect('update/user')"
          >
            <i class="bi bi-person-fill-gear"></i>
            Update User
          </li>
          <li
            class="pointer nav-item-mobile"
            data-bs-toggle="offcanvas"
            @click="handleRedirect('view/user')"
          >
            <i class="bi bi-person-vcard"></i>
            View User
          </li>
          <li
            v-if="ifLoggedIn"
            class="pointer nav-item-mobile"
            data-bs-toggle="offcanvas"
            @click="handleRedirect('account')"
          >
            <i class="bi bi-person-square"></i>
            My Account
          </li>
          <li
            v-if="ifLoggedIn"
            class="pointer nav-item-mobile"
            data-bs-toggle="offcanvas"
            @click="ifLoggedIn = false"
          >
            <i class="bi bi-power text-danger"></i>
            Log Out
          </li>
          <li
            v-if="!ifLoggedIn"
            class="pointer nav-item-mobile"
            data-bs-toggle="offcanvas"
            @click="ifLoggedIn = true"
          >
            <i
              @click="handleRedirect('login')"
              class="bi bi-power"
            ></i>
            Log In
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axiosClient from '../axiosClient';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: 'SideBar',

  data() {
    return {
      profile: '',
      data: '',
      ifLoggedIn: false,
    };
  },

  async created() {
    this.getCurrent();
    this.ifLoggedIn = true;
  },

  methods: {
    async handleLogOut() {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('You Are Already Logged Out', {
          autoClose: 1500,
        });
        setTimeout(() => {
          this.$router.push('/login');
        }, 1500);
      } else {
        localStorage.removeItem('token');
        toast.info('Log Out Sucessfull', {
          autoClose: 1500,
        });
        setTimeout(() => {
          this.$router.push('/login');
        }, 1500);
      }
    },

    handleRedirect(link) {
      this.$router.push(`/${link}`);
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
