export const ValidationMessages = {
  title: {
    required: 'Amount is required',
  },
  summary: {
    required: 'Payment is required',
  }
};
export let FormErrors = {
  title: '',
  summary: ''
};

export interface Gateway {
  title: string;
  summary: string;
}
