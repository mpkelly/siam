// Same as Bootstrap v5
export const DefaultBreakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

export const isBreakpointValues = (value: any) => {
  if (!value || new Object(value) !== value) {
    return false;
  }
  const { xs, sm, md, lg, xl, xxl } = value;
  return xs || sm || md || lg || xl || xxl;
};
