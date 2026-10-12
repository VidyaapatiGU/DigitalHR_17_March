export const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
export const roundCurrency = (value) => Math.round(toNumber(value));

export const clamp = (value, minimum, maximum) =>
  Math.min(Math.max(toNumber(value), minimum), maximum);

export const prorateAmount = (amount, periodDays, payableDays) => {
  const days = Math.max(0, toNumber(periodDays));
  if (days === 0) return 0;

  const daysPayable = clamp(payableDays, 0, days);
  return roundCurrency((toNumber(amount) / days) * daysPayable);
};

/**
 * Calculates the common payroll components used by wage slips and exports.
 * Policy values (PF ceiling, ESI threshold/rate and LWF amount) are kept here
 * so every view applies the same arithmetic and rounding rules.
 */
export const calculatePayroll = ({
  components = {},
  periodDays,
  payableDays,
  esiEligible = false,
  lwfEligible = false,
  lwfAmount = 10,
  tdsOther = 0,
  advances = 0,
  otEarnings = 0,
  reimbursement = 0,
}) => {
  const basic = toNumber(components.basic);
  const da = toNumber(components.da);
  const hra = toNumber(components.hra);
  const conveyance = toNumber(components.conveyance);
  const foodAllow = toNumber(components.foodAllow);

  const payableBasic = prorateAmount(basic, periodDays, payableDays);
  const payableDA = prorateAmount(da, periodDays, payableDays);
  const payableHra = prorateAmount(hra, periodDays, payableDays);
  const payableConveyance = prorateAmount(conveyance, periodDays, payableDays);
  const payableFoodAllow = prorateAmount(foodAllow, periodDays, payableDays);
  const payableOtherAllowance = prorateAmount(
    components.otherAllowance,
    periodDays,
    payableDays
  );

  const pfBasic = Math.min(15000, Math.max(0, payableBasic + payableDA));
  const pf = roundCurrency(pfBasic * 0.12);
  const grossSalary = roundCurrency(
    payableBasic +
      payableDA +
      payableHra +
      payableConveyance +
      payableFoodAllow +
      payableOtherAllowance +
      toNumber(otEarnings) +
      toNumber(reimbursement)
  );
  const esi =
    esiEligible && grossSalary <= 21000 ? roundCurrency(grossSalary * 0.0075) : 0;
  const payableDaysNumber = clamp(payableDays, 0, Math.max(0, toNumber(periodDays)));
  const lwf = lwfEligible && payableDaysNumber > 0 ? toNumber(lwfAmount) : 0;
  const totalDeduction = roundCurrency(
    esi + pf + lwf + toNumber(tdsOther) + toNumber(advances)
  );

  return {
    minimumBasic: basic,
    minimumHra: hra,
    minimumDA: da,
    minimumConveyance: conveyance,
    minimumFoodAllow: foodAllow,
    payableDays: payableDaysNumber,
    payableBasic,
    payableDA,
    payableHra,
    payableConveyance,
    payableFoodAllow,
    payableOtherAllowance,
    pfBasic,
    pf,
    esi,
    lwf,
    otEarnings: toNumber(otEarnings),
    reimbursement: toNumber(reimbursement),
    tdsOther: toNumber(tdsOther),
    advances: toNumber(advances),
    grossSalary,
    totalDeduction,
    netWages: grossSalary - totalDeduction,
  };
};
