<template>
  <div class="reports-bg container-fluid mt-4" style="max-height: 90vh; overflow-y: auto; padding-right: 15px;">
    <h1 class="reports-title mb-4">Download Reports</h1>

    <!-- PDF Downloads Section -->
    <div class="reports-section mb-5">
      <h3 class="reports-section-title mb-3">📄 PDF Downloads</h3>
      <div class="row">
        <div class="col-md-6">
          <div class="reports-card card">
            <div class="card-body">
              <h5 class="card-title">Standard Forms</h5>
              <div class="input-group mb-2">
                <select class="form-select" v-model="selectedPdfReport">
                  <option :value="null" disabled>-- Select a PDF --</option>
                  <option v-for="report in pdfReportsList" :key="report.file" :value="report.file">
                    {{ report.name }}
                  </option>
                </select>
                <a
                  :href="pdfDownloadUrl"
                  :class="['btn', 'btn-primary', { disabled: !selectedPdfReport }]"
                  download
                >
                  <i class="bi bi-download me-2"></i>
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Downloads Section -->
    <div class="reports-section mb-5">
      <h3 class="reports-section-title mb-3">⚙️ Settings & Notices</h3>
      <div class="row">
        <div class="col-md-6">
          <div class="reports-card card mb-3">
            <div class="card-body">
              <h5 class="card-title">Notices</h5>
              <button class="btn btn-outline-primary btn-sm mb-2 w-100 reports-btn" @click="downloadCloseNotice" title="Download Notice of Close Day">
                <i class="bi bi-download me-2"></i>Notice of Close Day
              </button>
              <button class="btn btn-outline-primary btn-sm mb-2 w-100 reports-btn" @click="downloadNoticeOfHours" title="Download Notice of Hours">
                <i class="bi bi-download me-2"></i>Notice of Hours
              </button>
              <button class="btn btn-outline-primary btn-sm w-100 reports-btn" @click="downloadMonthlySalaryNotice" title="Download Monthly Salary Notice">
                <i class="bi bi-download me-2"></i>Monthly Salary Notice
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="reports-card card mb-3">
            <div class="card-body">
              <h5 class="card-title">Forms & Policy Documents</h5>
              <button class="btn btn-outline-primary btn-sm mb-2 w-100 reports-btn" @click="downloadSalaryInspectorForm" title="Download Area Labour Inspector Form">
                <i class="bi bi-download me-2"></i>Area Labour Inspector Form
              </button>
              <button class="btn btn-outline-primary btn-sm mb-2 w-100 reports-btn" @click="downloadMinimumWagesForm" title="Download Minimum Wages Form">
                <i class="bi bi-download me-2"></i>Minimum Wages Form
              </button>
              <button class="btn btn-outline-primary btn-sm w-100 reports-btn" @click="downloadHolidaysListWord" title="Download Holidays List">
                <i class="bi bi-download me-2"></i>Holidays List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PF / EPFO Section -->
    <div class="reports-section mb-5">
      <h3 class="reports-section-title mb-3">🏛️ PF / EPFO Portal</h3>
      <div class="row">
        <div class="col-md-6">
          <div class="reports-card card mb-3">
            <div class="card-body">
              <h5 class="card-title">PF ECR Challan</h5>
              <p class="text-muted small mb-2">Generate PF challan in EPFO hash (##) format. Edit data, review, and download for upload to the EPFO portal.</p>
              <button class="btn btn-outline-primary btn-sm w-100 reports-btn" @click="$router.push('/reports/pf-challan')">
                <i class="bi bi-bank me-2"></i>Open PF Challan Generator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Excel & Data Downloads Section -->
    <div class="reports-section mb-5">
      <h3 class="reports-section-title mb-3">📊 Excel & Data Downloads</h3>
      <div class="row">
        <div class="col-md-6">
          <div class="reports-card card mb-3">
            <div class="card-body">
              <h5 class="card-title">Attendance Reports</h5>
              <button class="btn btn-outline-success btn-sm w-100 reports-btn" @click="downloadLeavesBalance" title="Download Leaves Balance">
                <i class="bi bi-download me-2"></i>Leaves Balance (CSV)
              </button>
              <!-- ESIC Month/Year Selection and Download -->
              <div class="row mb-2 mt-3">
                <div class="col-12">
                  <button class="btn btn-outline-danger btn-sm w-100 mt-2 reports-btn" @click="showEsicModal = true; fetchAttendancePeriods();" title="Download ESIC Challan Report">
                    <i class="bi bi-download me-2"></i>ESIC Challan (Excel)
                  </button>
                  <!-- ESIC Modal -->
                  <div v-if="showEsicModal" class="modal fade show" tabindex="-1" style="display:block; background:rgba(0,0,0,0.4);">
                    <div class="modal-dialog modal-dialog-centered">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title">Select Month/Year for ESIC Report</h5>
                          <button type="button" class="btn-close" @click="showEsicModal = false"></button>
                        </div>
                        <div class="modal-body">
                          <select class="form-select form-select-sm mb-3" v-model="esicPeriod">
                            <option v-if="!esicOptions.length" :value="null" disabled>No available periods</option>
                            <option v-for="opt in esicOptions" :key="opt.label" :value="opt">{{ opt.label }}</option>
                          </select>
                        </div>
                        <div class="modal-footer">
                          <button class="btn btn-secondary btn-sm" @click="showEsicModal = false">Cancel</button>
                          <button class="btn btn-danger btn-sm" :disabled="!esicPeriod" @click="showEsicModal = false; downloadEsicChallanReport();">Download</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="reports-card card mb-3">
            <div class="card-body">
              <h5 class="card-title">Employee & Holiday Data</h5>
              <button class="btn btn-outline-success btn-sm mb-2 w-100 reports-btn" @click="downloadEmployeesList" title="Download Employees List">
                <i class="bi bi-download me-2"></i>Employees List (Excel)
              </button>
              <button class="btn btn-outline-success btn-sm w-100 reports-btn" @click="downloadWeeklyHolidayExcel" title="Download Weekly Holiday Notice">
                <i class="bi bi-download me-2"></i>Weekly Holiday Notice (Excel)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import axiosClient from '../../axiosClient';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun, AlignmentType, BorderStyle, WidthType } from 'docx';

export default {
  name: 'Reports',
  data() {
    return {
      selectedPdfReport: null,
      user: {},
      settings: {},
      holidays: [],
      employeeHolidayAssignments: [],
      
      // PDF Reports list
      pdfReportsList: [
        { file: 'FORM V_Abstract_MW.pdf', name: 'FORM V - Abstract of MW' },
        { file: 'FORM-V-Abstract-Under-The-Payment-Of-Wages-Act-1936-English-Version.pdf', name: 'FORM V - Payment of Wages Act 1936' },
      ],
      esicMonth: new Date().getMonth() + 1,
      esicYear: new Date().getFullYear().toString(),
      availableAttendancePeriods: [],
      showAttendancePeriods: false,

      esicOptions: [],
      esicPeriod: null,

      showEsicModal: false,
    };
  },
  computed: {
    pdfDownloadUrl() {
      if (!this.selectedPdfReport) return null;
      return `/reports/${this.selectedPdfReport}`;
    },
    esicYearOptions() {
      const current = new Date().getFullYear();
      return Array.from({ length: 5 }, (_, i) => (current - i).toString());
    },
  },
  async created() {
    await this.getCurrent();
    await this.loadSettingsData();
    await this.fetchAttendancePeriods();
  },
  methods: {
    async getCurrent() {
      try {
        const token = await axiosClient.get(`api/v1/user/getCurrent/`);
        this.user = token.data.user;
      } catch (err) {
        console.log('error: ', err);
      }
    },

    async loadSettingsData() {
      try {
        const res = await axiosClient.get(`/api/v1/settings/holiday/to_from/${this.user._id}`);
        if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          this.settings = res.data.data[0];
          this.employeeHolidayAssignments = this.settings.employeeHolidayAssignments || [];
        }
        const resHolidays = await axiosClient.get(`/api/v1/holiday/getall/client/${this.user._id}`);
        this.holidays = resHolidays.data.data || [];
      } catch (err) {
        console.log('Error loading settings/holidays:', err);
      }
    },

    getOrdinalSuffix(n) {
      const j = n % 10;
      const k = n % 100;
      if (j === 1 && k !== 11) return 'st';
      if (j === 2 && k !== 12) return 'nd';
      if (j === 3 && k !== 13) return 'rd';
      return 'th';
    },

    formatTime(val) {
      if (!val) return '';
      if (val.includes(':')) {
        const [h, m] = val.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hh = h % 12 || 12;
        return `${String(hh).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
      }
      return val;
    },

    // ===== Notice of Hours (same as Settings.vue FORM XXII) =====
    downloadNoticeOfHours() {
      try {
        const wh = this.settings.workingHours || {};

        const shifts = [];
        if (wh.shift1Start || wh.shift1End) shifts.push({ start: wh.shift1Start, end: wh.shift1End });
        if (wh.shift2Start || wh.shift2End) shifts.push({ start: wh.shift2Start, end: wh.shift2End });
        if (wh.shift3Start || wh.shift3End) shifts.push({ start: wh.shift3Start, end: wh.shift3End });
        if (wh.extraShifts && wh.extraShifts.length) wh.extraShifts.forEach(s => shifts.push({ start: s.start, end: s.end }));

        let shiftEntries = '';
        shifts.forEach((s, i) => {
          const num = 1 + i;
          shiftEntries += `<div class="shift-entry">${num}. Shift ${String(num).padStart(2, '0')} : ${this.formatTime(s.start)} to ${this.formatTime(s.end)}</div>`;
        });

        const lunches = [];
        if (wh.lunchShift1Start || wh.lunchShift1End) lunches.push({ start: wh.lunchShift1Start, end: wh.lunchShift1End });
        if (wh.lunchShift2Start || wh.lunchShift2End) lunches.push({ start: wh.lunchShift2Start, end: wh.lunchShift2End });
        if (wh.lunchShift3Start || wh.lunchShift3End) lunches.push({ start: wh.lunchShift3Start, end: wh.lunchShift3End });
        if (wh.extraLunchShifts && wh.extraLunchShifts.length) wh.extraLunchShifts.forEach(s => lunches.push({ start: s.start, end: s.end }));

        let lunchEntries = '';
        lunches.forEach((s, i) => {
          const num = 1 + i;
          lunchEntries += `<div class="shift-entry">${num}. Shift ${String(num).padStart(2, '0')} : ${this.formatTime(s.start)} to ${this.formatTime(s.end)}</div>`;
        });

        const content = `
          <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head>
            <meta charset="utf-8">
            <title>Notice of Hours</title>
            <style>
              body { font-family: 'Times New Roman', Times, serif; margin: 0; padding: 40px; }
              .page { width: 100%; }
              .header { text-align: center; margin-bottom: 30px; }
              .title { font-size: 30px; font-weight: bold; text-decoration: underline; margin-bottom: 6px; }
              .subtitle { font-size: 18px; font-weight: bold; margin: 6px 0; }
              .rule { font-size: 18px; font-weight: bold; margin-bottom: 18px; }
              .section { margin-top: 28px; }
              .section-title { font-size: 18px; font-weight: bold; text-decoration: underline; margin-bottom: 12px; }
              .content { margin-left: 40px; font-size: 15px; }
              .shift-entry { margin: 6px 0; }
              .small { font-size: 14px; }
              p { margin: 0; padding: 0; }
            </style>
          </head>
          <body>
            <div class="page">
              <div class="header">
                <div class="title">NOTICE OF HOURS</div>
                <div class="subtitle">FROM XXII</div>
                <div class="rule">RULE 31 (1)</div>
              </div>

              <div class="section">
                <div class="section-title">Working Hours in a day</div>
                <div class="content">
                  <div class="shift-entry">1. General shift : ${this.formatTime(wh.workingGeneralStart) || ''} to ${this.formatTime(wh.workingGeneralEnd) || ''}</div>
                  ${shiftEntries}
                </div>
              </div>

              <div class="section">
                <div class="section-title">Lunch / Break Time</div>
                <div class="content">
                  <div class="shift-entry">1. General shift : ${this.formatTime(wh.lunchGeneralStart) || ''} to ${this.formatTime(wh.lunchGeneralEnd) || ''}</div>
                  ${lunchEntries}
                </div>
              </div>

            </div>
          </body>
          </html>
        `;

        const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
        const element = document.createElement('a');
        element.href = URL.createObjectURL(blob);
        element.download = 'Notice_of_Hours.doc';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(element.href);

        toast.success('Notice of Hours downloaded successfully!', { autoClose: 1000 });
      } catch (err) {
        console.error(err);
        toast.error('Failed to download Notice of Hours!', { autoClose: 1000 });
      }
    },

    // ===== Close Notice (same as Settings.vue FORM XXIV) =====
    downloadCloseNotice() {
      try {
        const closeNoticeDate = this.settings.closeNoticeDate || new Date().toISOString();
        const closeNoticeType = this.settings.closeNoticeType || 'Rotational';
        const registrationNumber = this.settings.registrationNumber || '';

        const dateObj = new Date(closeNoticeDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);

        const shopName = this.user.name || '';
        const shopAddress = this.user.address || '';

        const content = `
          <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head>
            <meta charset="utf-8">
            <title>Notice of Close Day</title>
            <style>
              body { font-family: 'Times New Roman', Times, serif; margin: 60px 80px; line-height: 1.8; }
              .container { max-width: 600px; }
              .header { text-align: center; margin-bottom: 30px; }
              .title { font-size: 20px; font-weight: bold; margin-bottom: 8px; }
              .subtitle { font-size: 12px; margin-bottom: 15px; }
              .form-header { text-align: center; font-size: 18px; font-weight: bold; text-decoration: underline; margin-bottom: 30px; }
              .form-row { margin-bottom: 20px; line-height: 1.6; }
              .signature-area { margin-top: 60px; text-align: right; margin-right: 50px; }
              .signature-line { border-top: 1px solid black; width: 150px; display: inline-block; }
              .signature-label { text-align: right; font-size: 13px; margin-top: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="title">FORM XXIV</div>
                <div class="subtitle">(See Rule 31 (3) (a) )</div>
              </div>
              <div class="form-header">Notice of close day or a change in close day</div>
              <div class="form-row">
                <span>Name of Shop / Establishment and address : </span><span><strong>${shopName}, ${shopAddress}</strong></span>
              </div>
              <div class="form-row">
                <span>Registration No. </span><span><strong>${registrationNumber}</strong></span>
              </div>
              <div class="form-row">
                <span>Notice is hereby given that with effect from (date) </span><span style="font-weight: bold;">${formattedDate}</span><span> .The shop/ Establishment shall Observed </span><span style="font-weight: bold;">${closeNoticeType}</span><span> as close day every week. It shall be the Weekly for all Employees.</span>
              </div>
              <div class="signature-area">
                <div class="signature-line"></div>
                <div class="signature-label">Signature of employer</div>
              </div>
              <div class="form-row">
                <span>....................................................</span><br>
                <span>Inspection under the Goa Daman and Diu</span><br>
                <span>Shops and Establishment Act 1973.</span>
              </div>
            </div>
          </body>
          </html>
        `;

        const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
        const element = document.createElement('a');
        element.href = URL.createObjectURL(blob);
        element.download = 'Notice_of_Close_Day.doc';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(element.href);

        toast.success('Notice of Close Day downloaded successfully!', { autoClose: 1000 });
      } catch (err) {
        console.error(err);
        toast.error('Failed to generate document!', { autoClose: 1000 });
      }
    },

    // ===== Monthly Salary Notice (same as Settings.vue) =====
    downloadMonthlySalaryNotice() {
      try {
        const monthlySalaryDate = this.settings.monthlySalaryDate;
        if (!monthlySalaryDate) {
          toast.error('Monthly salary date not set in Settings!', { autoClose: 2000 });
          return;
        }

        const date = new Date(monthlySalaryDate);
        const day = date.getDate();
        const dateText = `ON OR BEFORE ${day}${this.getOrdinalSuffix(day)} OF EVERY MONTH`;

        const companyName = this.user.name || '';
        const companyAddress = `${this.user.address || ''}<br>
                              ${this.user.city || ''} - ${this.user.pin_code || ''}<br>
                              ${this.user.state || ''}, ${this.user.country || ''}`;

        const content = `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .title { font-size: 48px; font-weight: bold; text-decoration: underline; margin-bottom: 80px; }
                .content { font-size: 24px; margin: 100px 0; }
                .footer { position: absolute; bottom: 40px; right: 40px; text-align: right; }
                .company { font-size: 14px; margin-top: 0; }
              </style>
            </head>
            <body>
              <div class="title">NOTICE</div>
              <div class="content">DATE OF PAYMENT: ${dateText}</div>
              <div class="footer">
                <div class="company"><strong>M/s. ${companyName}</strong><br>${companyAddress}</div>
              </div>
            </body>
          </html>
        `;

        const blob = new Blob([content], { type: 'application/msword' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Monthly_Salary_Notice_${this.user.name || 'Company'}.doc`;
        link.click();

        toast.success('Monthly Salary Notice downloaded successfully!', { autoClose: 1000 });
      } catch (err) {
        console.error(err);
        toast.error('Failed to download Monthly Salary Notice!', { autoClose: 1000 });
      }
    },

    // ===== Salary Inspector Form (same as Settings.vue FORM VI) =====
    downloadSalaryInspectorForm() {
      try {
        const salaryInspectorName = this.settings.salaryInspectorName || 'Inspector Name';
        const salaryOptionDate = this.settings.salaryOptionDate;

        let formattedDate = '';
        if (salaryOptionDate) {
          const date = new Date(salaryOptionDate);
          formattedDate = `${date.getDate()}${this.getOrdinalSuffix(date.getDate())} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        }

        const companyName = this.user.name || '';
        const companyAddress = `${this.user.address || ''}<br>
                              ${this.user.city || ''} - ${this.user.pin_code || ''}<br>
                              ${this.user.state || ''}, ${this.user.country || ''}`;

        const content = `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; padding: 50px; }
                .title { font-size: 36px; font-weight: bold; text-align: center; margin-bottom: 20px; }
                .subtitle { font-size: 18px; text-align: center; margin-bottom: 10px; }
                .rule { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 40px; }
                table { width: 80%; margin: 50px auto; border-collapse: collapse; }
                th, td { border: 2px solid black; padding: 15px; text-align: center; }
                th { background-color: #f0f0f0; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="title">FORM VI</div>
              <div class="rule">[Rule 23(1)]</div>
              <div class="subtitle"><strong>Name and Address of Inspectors</strong></div>
              
              <table align="center" style="width:100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <table align="center" style="display: inline-table; width: 80%; margin: 0 auto;">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2</td>
                  </tr>
                  <tr>
                    <td><strong>${salaryInspectorName}</strong></td>
                    <td>
                    <strong>M/s. ${companyName}</strong><br>
                    ${companyAddress}
                    </td>
                  </tr>
                </tbody>
              </table>
            </body>
          </html>
        `;

        const blob = new Blob([content], { type: 'application/msword' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Salary_Inspector_Form_${this.user.name || 'Company'}.doc`;
        link.click();

        toast.success('Form Downloaded Successfully!', { autoClose: 1000 });
      } catch (err) {
        console.error(err);
        toast.error('Failed to download form!', { autoClose: 1000 });
      }
    },

    // ===== Minimum Wages Form (same as Settings.vue Form IV) =====
    downloadMinimumWagesForm() {
      try {
        const minimumWages = this.settings.minimumWages || {
          unskilled: { basic: 0, vda: 0, total: 0 },
          semiSkilled: { basic: 0, vda: 0, total: 0 },
          skilled: { basic: 0, vda: 0, total: 0 },
          highlySkilled: { basic: 0, vda: 0, total: 0 },
        };

        const companyName = this.user.name || '';
        const companyAddress = `${this.user.address || ''}<br>
                              ${this.user.city || ''} - ${this.user.pin_code || ''}<br>
                              ${this.user.state || ''}, ${this.user.country || ''}`;

        const content = `
          <html>
            <head>
              <style>
                html, body { height: 100%; margin: 0; padding: 0; }
                body { font-family: Arial, sans-serif; padding: 40px; position: relative; }
                .title { font-size: 36px; font-weight: bold; text-align: center; margin-bottom: 40px; }
                .subtitle { font-size: 16px; text-align: center; margin-bottom: 40px; }
                table { width: 92%; margin: 0 auto; border-collapse: collapse; table-layout: fixed; font-size: 18px; }
                th:first-child, td:first-child { width: 50%; text-align: left; padding-left: 20px; }
                th:nth-child(2), td:nth-child(2),
                th:nth-child(3), td:nth-child(3),
                th:nth-child(4), td:nth-child(4) { width: 16.66%; }
                th, td { border: 3px solid black; padding: 18px; text-align: center; font-size: 18px; font-weight: bold; overflow-wrap: anywhere; }
                th { background-color: #f0f0f0; }
                .footer {
                  position: absolute; right: 40px; bottom: 40px;
                  text-align: right; font-size: 14px; line-height: 1.4;
                }
                .company { font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="title">Form IV</div>
              <div class="subtitle">
                <strong>Notices Showing Minimum Rates of wages required under<br>
                Rule 18 W.e.f 01<sup>st</sup> April ${new Date().getFullYear()}</strong>
              </div>

              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>BASIC</th>
                    <th>VDA</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>UNSKILLED</th>
                    <td>${minimumWages.unskilled?.basic || 0}</td>
                    <td>${minimumWages.unskilled?.vda || 0}</td>
                    <td>${minimumWages.unskilled?.total || 0}</td>
                  </tr>
                  <tr>
                    <th>SEMI-SKILLED</th>
                    <td>${minimumWages.semiSkilled?.basic || 0}</td>
                    <td>${minimumWages.semiSkilled?.vda || 0}</td>
                    <td>${minimumWages.semiSkilled?.total || 0}</td>
                  </tr>
                  <tr>
                    <th>SKILLED/ CLERICAL</th>
                    <td>${minimumWages.skilled?.basic || 0}</td>
                    <td>${minimumWages.skilled?.vda || 0}</td>
                    <td>${minimumWages.skilled?.total || 0}</td>
                  </tr>
                  <tr>
                    <th>HIGHLY SKILLED</th>
                    <td>${minimumWages.highlySkilled?.basic || 0}</td>
                    <td>${minimumWages.highlySkilled?.vda || 0}</td>
                    <td>${minimumWages.highlySkilled?.total || 0}</td>
                  </tr>
                </tbody>
              </table>

              <div class="footer">
                <div class="company">M/s. ${companyName}</div>
                <div>${this.user.address || ''}</div>
                <div>${this.user.city || ''} - ${this.user.pin_code || ''}</div>
                <div>${this.user.state || ''}, ${this.user.country || ''}</div>
              </div>
            </body>
          </html>
        `;

        const blob = new Blob([content], { type: 'application/msword' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Minimum_Wages_Form_${this.user.name || 'Company'}.doc`;
        link.click();

        toast.success('Minimum Wages Form downloaded successfully!', { autoClose: 1000 });
      } catch (err) {
        console.error(err);
        toast.error('Failed to download form!', { autoClose: 1000 });
      }
    },

    // ===== Holidays List Word (same as Settings.vue FORM XXVIII with docx) =====
    async downloadHolidaysListWord() {
      try {
        if (!this.holidays.length) {
          toast.error('No holidays found!', { autoClose: 1000 });
          return;
        }

        const shopName = this.user.name || 'Establishment';
        const shopAddress = this.user.address || '';
        const registrationNo = this.settings.registrationNumber || '';
        const currentYear = new Date().getFullYear();

        const cellBorder = {
          top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
          left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
          right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
        };

        const tableRows = [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Sr. No.', bold: true })], alignment: AlignmentType.CENTER })], width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorder }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Name of the Holiday', bold: true })], alignment: AlignmentType.CENTER })], width: { size: 40, type: WidthType.PERCENTAGE }, borders: cellBorder }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Date', bold: true })], alignment: AlignmentType.CENTER })], width: { size: 25, type: WidthType.PERCENTAGE }, borders: cellBorder }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Remarks', bold: true })], alignment: AlignmentType.CENTER })], width: { size: 25, type: WidthType.PERCENTAGE }, borders: cellBorder }),
            ],
          }),
          ...this.holidays.map((holiday, idx) => {
            const holidayDate = holiday.holidayDate ? new Date(holiday.holidayDate).toLocaleDateString('en-IN') : '';
            return new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: String(idx + 1), alignment: AlignmentType.CENTER })], width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorder }),
                new TableCell({ children: [new Paragraph({ text: holiday.name || '' })], width: { size: 40, type: WidthType.PERCENTAGE }, borders: cellBorder }),
                new TableCell({ children: [new Paragraph({ text: holidayDate, alignment: AlignmentType.CENTER })], width: { size: 25, type: WidthType.PERCENTAGE }, borders: cellBorder }),
                new TableCell({ children: [new Paragraph({ text: '' })], width: { size: 25, type: WidthType.PERCENTAGE }, borders: cellBorder }),
              ],
            });
          }),
        ];

        const sections = [{
          children: [
            new Paragraph({ children: [new TextRun({ text: 'FORM XXVIII', bold: true, size: 32 })], alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: '[See sub-Rule (7) of Rule 31]', bold: true, size: 22 })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
            new Paragraph({ children: [new TextRun({ text: `List of Holidays with Wages for the Year ending December ${currentYear}`, bold: true, size: 24 })], alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
            new Paragraph({ children: [new TextRun({ text: 'Name of the Establishment: ', bold: true }), new TextRun(shopName)], spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: 'Registration No: ', bold: true }), new TextRun(registrationNo)], spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: 'Address: ', bold: true }), new TextRun(shopAddress)], spacing: { after: 200 } }),
            new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } }),
            new Paragraph({ text: '', spacing: { after: 600 } }),
            new Paragraph({ text: '______________________', alignment: AlignmentType.RIGHT }),
            new Paragraph({ text: 'Signature of the Employer', alignment: AlignmentType.RIGHT, size: 22 }),
            new Paragraph({ text: '', spacing: { after: 400 } }),
            new Paragraph({ text: 'To,', spacing: { after: 100 } }),
            new Paragraph({ text: 'The Inspector,', spacing: { after: 100 } }),
            new Paragraph({ text: 'Goa Daman & Diu,', spacing: { after: 100 } }),
            new Paragraph({ text: 'Shops & Establishments Act, 1973', spacing: { after: 100 } }),
          ],
        }];

        const doc = new Document({ sections });
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `Holidays_List_${currentYear}.docx`);
        toast.success('Holidays list downloaded successfully!', { autoClose: 1000 });
      } catch (err) {
        console.error('Error downloading Word document:', err);
        toast.error('Failed to download document!', { autoClose: 1000 });
      }
    },

    // ===== Weekly Holiday Excel (same as Settings.vue FORM XXVI) =====
    downloadWeeklyHolidayExcel() {
      try {
        if (!this.employeeHolidayAssignments.length) {
          toast.error('No holiday assignments found!', { autoClose: 1000 });
          return;
        }

        const shopName = this.user.name || 'Establishment';
        const shopAddress = this.user.address || '';
        const registrationNo = this.settings.registrationNumber || '';
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-IN');

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Weekly Holiday Notice');

        worksheet.views = [{ showGridLines: false }];
        worksheet.columns = [
          { width: 3 },
          { width: 12 },
          { width: 40 },
          { width: 28 },
          { width: 20 }
        ];

        const applyRowStyle = (row, config = {}) => {
          row.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } };
            if (config.font) cell.font = config.font;
            if (config.alignment) cell.alignment = config.alignment;
            if (config.border) cell.border = config.border;
          });
        };

        const applyLeftMarginStyle = (row) => {
          const cellA = row.getCell(1);
          cellA.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } };
          cellA.border = { left: { style: 'none' }, right: { style: 'none' }, top: { style: 'none' }, bottom: { style: 'none' } };
        };

        const thinBorder = {
          left: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } },
          top: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } }
        };

        const row1 = worksheet.addRow(['', '', '', '', '']);
        applyLeftMarginStyle(row1);

        const titleRow = worksheet.addRow(['', 'FORM XXVI', '', '', '']);
        applyRowStyle(titleRow, { font: { bold: true, size: 16 }, alignment: { horizontal: 'center', vertical: 'center' } });
        applyLeftMarginStyle(titleRow);
        worksheet.mergeCells('B2:E2');
        titleRow.height = 25;

        const subtitleRow = worksheet.addRow(['', '[See Rule 31 (3b)]', '', '', '']);
        applyRowStyle(subtitleRow, { font: { size: 13 }, alignment: { horizontal: 'center', vertical: 'center' } });
        applyLeftMarginStyle(subtitleRow);
        worksheet.mergeCells('B3:E3');
        subtitleRow.height = 20;

        const noticeRow = worksheet.addRow(['', 'Notice of weekly holiday', '', '', '']);
        applyRowStyle(noticeRow, { font: { size: 12, italic: true }, alignment: { horizontal: 'center', vertical: 'center' } });
        applyLeftMarginStyle(noticeRow);
        worksheet.mergeCells('B4:E4');
        noticeRow.height = 20;

        const row5 = worksheet.addRow(['', '', '', '', '']);
        applyLeftMarginStyle(row5);

        const estRow = worksheet.addRow(['', '', '', '', '']);
        const estCell = estRow.getCell(2);
        const shopDetails = shopAddress ? `${shopName}, ${shopAddress}` : shopName;
        estCell.value = {
          richText: [
            { font: { size: 12 }, text: 'Name and address of Establishment: ' },
            { font: { bold: true, size: 12 }, text: shopDetails }
          ]
        };
        estCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } };
        estCell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
        worksheet.mergeCells('B6:E6');
        estRow.height = 35;
        applyLeftMarginStyle(estRow);

        const regRow = worksheet.addRow(['', '', '', '', '']);
        const regCell = regRow.getCell(2);
        regCell.value = {
          richText: [
            { font: { size: 12 }, text: 'Registration No.        ' },
            { font: { bold: true, size: 12 }, text: registrationNo }
          ]
        };
        regCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } };
        regCell.alignment = { horizontal: 'left', vertical: 'center' };
        worksheet.mergeCells('B7:E7');
        regRow.height = 20;
        applyLeftMarginStyle(regRow);

        const row8 = worksheet.addRow(['', '', '', '', '']);
        applyLeftMarginStyle(row8);

        const introRow = worksheet.addRow(['', 'The person(s) employed in this Establishment shall be given a holiday on the day specified below in the week following the date of this notice and every week until further notice.', '', '', '']);
        applyRowStyle(introRow, { font: { size: 12 }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true } });
        applyLeftMarginStyle(introRow);
        worksheet.mergeCells('B9:E9');
        introRow.height = 30;

        const row10 = worksheet.addRow(['', '', '', '', '']);
        applyLeftMarginStyle(row10);

        const headerRow = worksheet.addRow(['', 'Sl. No.', 'Name of the Employee', 'Day on which holiday is allowed', 'Remarks']);
        applyRowStyle(headerRow, { font: { bold: true, size: 12 }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, border: thinBorder });
        applyLeftMarginStyle(headerRow);
        headerRow.height = 28;

        const minRows = 10;
        this.employeeHolidayAssignments.forEach((emp, idx) => {
          const dataRow = worksheet.addRow(['', idx + 1, emp.employeeName || '', emp.holidayDay || '', emp.remarks || '']);
          applyRowStyle(dataRow, { font: { size: 11 }, border: thinBorder });
          applyLeftMarginStyle(dataRow);
          dataRow.getCell(2).alignment = { horizontal: 'center', vertical: 'center' };
          dataRow.height = 20;
        });

        const blanksNeeded = Math.max(0, minRows - this.employeeHolidayAssignments.length);
        for (let i = 0; i < blanksNeeded; i++) {
          const blankRow = worksheet.addRow(['', '', '', '', '']);
          applyRowStyle(blankRow, { border: thinBorder });
          applyLeftMarginStyle(blankRow);
          blankRow.height = 20;
        }

        const spacer1 = worksheet.addRow(['', '', '', '', '']);
        applyLeftMarginStyle(spacer1);
        const spacer2 = worksheet.addRow(['', '', '', '', '']);
        applyLeftMarginStyle(spacer2);

        const sigRow = worksheet.addRow(['', `Date: ${dateStr}`, '', '', 'Signature of Employer']);
        applyRowStyle(sigRow, { font: { size: 12 }, alignment: { horizontal: 'left', vertical: 'center' } });
        applyLeftMarginStyle(sigRow);
        sigRow.height = 20;

        workbook.xlsx.writeBuffer().then(buffer => {
          const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs(blob, 'Weekly_Holiday_Notice_FORM_XXVI.xlsx');
          toast.success('Weekly holiday notice downloaded successfully!', { autoClose: 1000 });
        });
      } catch (err) {
        console.error('Error downloading Excel:', err);
        toast.error('Failed to download document!', { autoClose: 1000 });
      }
    },

    // ===== ESIC Challan Report =====
    async downloadEsicChallanReport() {
      try {
        const empRes = await axiosClient.get(`/api/v1/employee/client/${this.user._id}`);
        const employees = empRes.data.data || [];
        if (!employees.length) {
          toast.error('No employees found for ESIC report!', { autoClose: 2000 });
          return;
        }

        const year = this.esicPeriod?.year ? Number(this.esicPeriod.year) : Number(this.esicYear);
        const month = this.esicPeriod?.month ? Number(this.esicPeriod.month) : Number(this.esicMonth);

        const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const monthName = this.esicPeriod?.monthName || monthNames[month - 1];
        const paddedMonth = this.esicPeriod?.padded || String(month).padStart(2, '0');

        let attRes;
        try {
          attRes = await axiosClient.get(`/api/v1/attendance/client/${this.user._id}?year=${year}&month=${month}`);
          if (!attRes.data.data?.length) {
            attRes = await axiosClient.get(`/api/v1/attendance/client/${this.user._id}?year=${year}&month=${paddedMonth}`);
          }
          if (!attRes.data.data?.length) {
            attRes = await axiosClient.get(`/api/v1/attendance/client/${this.user._id}?year=${year}&month=${monthName}`);
          }
        } catch (err) {
          console.error('Attendance API error:', err);
          toast.error('Attendance data not available for ESIC report!', { autoClose: 2000 });
          return;
        }

        const attendanceRecords = attRes.data.data || [];
        if (!attendanceRecords.length) {
          toast.error('No attendance records found for selected month/year.', { autoClose: 3000 });
          return;
        }

        const presentDaysMap = {};
        attendanceRecords.forEach(rec => {
          const empNo = rec.emp_no || rec.empCode || '';
          if (!empNo) return;
          let presentCount = 0;
          if (typeof rec.present === 'number') presentCount = rec.present;
          else if (typeof rec.present === 'string' && rec.present.match(/^\d+$/)) presentCount = Number(rec.present);
          presentDaysMap[String(empNo)] = (presentDaysMap[String(empNo)] || 0) + (presentCount || 0);
        });

        const formatDate = (d) => {
          if (!d) return '';
          const dt = (d instanceof Date) ? d : new Date(d);
          if (isNaN(dt)) return String(d);
          const dd = String(dt.getDate()).padStart(2, '0');
          const mm = String(dt.getMonth() + 1).padStart(2, '0');
          const yyyy = dt.getFullYear();
          return `${dd}/${mm}/${yyyy}`;
        };

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('ESIC Challan');

        worksheet.columns = [
          { header: 'IP Number (10 Digits)', key: 'ip_number', width: 18 },
          { header: 'IP Name', key: 'ip_name', width: 30 },
          { header: 'No of Days for which wages paid/payable during the month', key: 'present_days', width: 18 },
          { header: 'Total Monthly Wages', key: 'total_monthly_wages', width: 18 },
          { header: 'Reason Code for Zero workings days (numeric only; provide 0 for all other reasons)', key: 'reason_code', width: 18 },
          { header: 'Last Working Day (Format DD/MM/YYYY or DD-MM-YYYY)', key: 'last_working_day', width: 18 },
        ];

        employees.forEach(emp => {
          const empCode = emp.emp_no || emp.empCode || '';
          const ipNumber = emp.esic_no || emp.ip_number || emp.ipNumber || '';
          const name = emp.name || '';
          const present = presentDaysMap[String(empCode)] ?? 0;
          const totalWages = emp.gross ?? emp.gross_salary ?? emp.monthly_wages ?? emp.salary ?? '';
          const reason = (present === 0) ? (emp.reason_code ?? '') : '';
          const lastWorking = (emp.last_working_day || emp.lastWorkingDay || emp.last_working_date) ? formatDate(emp.last_working_day || emp.lastWorkingDay || emp.last_working_date) : '';

          worksheet.addRow({
            ip_number: ipNumber,
            ip_name: name,
            present_days: present,
            total_monthly_wages: totalWages,
            reason_code: reason,
            last_working_day: lastWorking
          });
        });

        worksheet.getRow(1).font = { bold: true };

        // ===== ESIC Reason Codes Reference Sheet =====
        const refSheet = workbook.addWorksheet('ESIC Reason Codes');
        refSheet.columns = [
          { header: 'Reason Code', key: 'code', width: 14 },
          { header: 'Description', key: 'description', width: 55 },
          { header: 'Last Working Day Required?', key: 'lwd_note', width: 30 },
        ];
        const reasonCodes = [
          { code: 0, description: 'All other reasons / Currently working', lwd_note: 'No' },
          { code: 1, description: 'On leave / Out of coverage (Struck off)', lwd_note: 'Yes' },
          { code: 2, description: 'Left service / Resigned', lwd_note: 'Yes' },
          { code: 3, description: 'Retrenched', lwd_note: 'Yes' },
          { code: 4, description: 'Non-implemented area / Not covered', lwd_note: 'Yes' },
          { code: 5, description: 'Retired / Superannuated', lwd_note: 'Yes' },
          { code: 6, description: 'Expired / Deceased', lwd_note: 'Yes' },
          { code: 7, description: 'Out of coverage (Opted out)', lwd_note: 'Yes' },
          { code: 8, description: 'Duplicate IP', lwd_note: 'Yes' },
          { code: 9, description: 'Compliance by immediate employer', lwd_note: 'No' },
          { code: 10, description: 'Long term sick leave', lwd_note: 'Yes' },
          { code: 11, description: 'Lockout / Strike', lwd_note: 'Yes' },
          { code: 12, description: 'Temporary disablement', lwd_note: 'Yes' },
          { code: 13, description: 'Permanent disablement', lwd_note: 'Yes' },
        ];
        reasonCodes.forEach(rc => refSheet.addRow(rc));
        refSheet.getRow(1).font = { bold: true };
        refSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9EAD3' } };

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `ESIC_CHALLAN_${paddedMonth}_${year}.xlsx`);
        toast.success('ESIC Challan downloaded successfully!', { autoClose: 1000 });
      } catch (err) {
        console.error('Download ESIC Challan error:', err);
        toast.error('Failed to download ESIC Challan!', { autoClose: 1000 });
      }
    },

    // Attendance & Employee Data Downloads
    async downloadLeavesBalance() {
      try {
        const res = await axiosClient.get(`/api/v1/employee/client/${this.user._id}`);
        const leavesData = res.data.data || [];
        
        let csv = "Emp Code,Name,CL,SL,PL\n";
        leavesData.forEach(emp => {
          const empCode = emp.emp_no || '';
          const name = emp.name || '';
          const cl = emp.leaves?.cl?.balance || '';
          const sl = emp.leaves?.sl?.balance || '';
          const pl = emp.leaves?.pl?.balance || '';
          csv += `"${empCode}","${name}","${cl}","${sl}","${pl}"\n`;
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "Leaves_Balance.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Leaves Balance downloaded successfully!', { autoClose: 1000 });
      } catch (err) {
        console.error(err);
        toast.error('Failed to download leaves balance!', { autoClose: 1000 });
      }
    },

    async downloadEmployeesList() {
      try {
        const res = await axiosClient.get(`/api/v1/employee/client/${this.user._id}`);
        const employees = res.data.data || [];

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Employees');
        
        worksheet.columns = [
          { header: 'Employee Code', key: 'emp_no', width: 15 },
          { header: 'Name', key: 'name', width: 25 },
          { header: 'Designation', key: 'designation', width: 20 },
          { header: 'Department', key: 'department', width: 20 },
          { header: 'Email', key: 'email', width: 25 },
          { header: 'Phone', key: 'phone', width: 15 },
        ];

        employees.forEach(emp => {
          worksheet.addRow({
            emp_no: emp.emp_no,
            name: emp.name,
            designation: emp.designation,
            department: emp.department,
            email: emp.email,
            phone: emp.phone,
          });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'Employees_List.xlsx');
        
        toast.success('Employees List downloaded successfully!', { autoClose: 1000 });
      } catch (err) {
        console.error(err);
        toast.error('Failed to download employees list!', { autoClose: 1000 });
      }
    },

    async fetchAttendancePeriods() {
      try {
        let res;
        try {
          res = await axiosClient.get(`/api/v1/attendance/get/all/${this.user._id}`);
        } catch (err) {
          console.warn('Primary attendance endpoint failed, trying client attendance endpoint', err);
        }

        if (!res || (!res.data && !res.data?.length && !res.data?.data)) {
          try {
            res = await axiosClient.get(`/api/v1/attendance/client/${this.user._id}`);
          } catch (err) {
            console.warn('Fallback attendance endpoint also failed', err);
          }
        }

        let records = [];
        if (!res) {
          records = [];
        } else if (Array.isArray(res.data)) {
          records = res.data;
        } else if (Array.isArray(res.data?.data)) {
          records = res.data.data;
        } else {
          records = res.data?.data || res.data || [];
        }

        const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

        const map = {};
        records.forEach(a => {
          let m = null, y = null;
          if (a.year && a.month) {
            y = Number(a.year);
            if (typeof a.month === 'number' || String(a.month).match(/^\d+$/)) {
              m = Number(a.month);
            } else if (typeof a.month === 'string') {
              const idx = monthNames.findIndex(n => n.toLowerCase() === a.month.toLowerCase());
              if (idx !== -1) m = idx + 1;
            }
          } else if (a.month_year) {
            const d = new Date(a.month_year);
            if (!isNaN(d)) {
              m = d.getMonth() + 1;
              y = d.getFullYear();
            } else {
              const mmYYYY = /^(\d{2})-(\d{4})$/;
              const yyyyMM = /^(\d{4})-(\d{2})$/;
              if (mmYYYY.test(a.month_year)) {
                const [, mm, yy] = a.month_year.match(mmYYYY); m = Number(mm); y = Number(yy);
              } else if (yyyyMM.test(a.month_year)) {
                const [, yy, mm] = a.month_year.match(yyyyMM); m = Number(mm); y = Number(yy);
              }
            }
          }

          if (m && y) {
            const label = `${String(m).padStart(2,'0')}-${y}`;
            if (!map[label]) {
              map[label] = { label, month: m, year: y, monthName: monthNames[m - 1], padded: String(m).padStart(2,'0') };
            }
          }
        });

        const opts = Object.values(map).sort((a,b) => b.year - a.year || b.month - a.month);
        this.esicOptions = opts;
        this.availableAttendancePeriods = opts.map(o => o.label);
        this.showAttendancePeriods = true;
        if (opts.length && !this.esicPeriod) this.esicPeriod = opts[0];
      } catch (err) {
        this.availableAttendancePeriods = [];
        this.showAttendancePeriods = false;
      }
    },
  },
};
</script>