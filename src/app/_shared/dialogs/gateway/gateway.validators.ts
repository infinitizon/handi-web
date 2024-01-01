export const ValidationMessages = {
  amount: {
    required: 'Amount is required',
  },
  payment: {
    required: 'Payment is required',
  }
};
export let FormErrors = {
  amount: '',
  payment: ''
};

export interface Gateway {
  amount: string;
  payment: string;
}
