export const ValidationMessages = {
  name: {
    required: 'Name is required',
  },
  address: {
    required: 'Address is required',
  },
  email: {
    required: 'Email is required',
    pattern: 'Enter valid email'
  },
  phone: {
    required: 'Phone number is required',
  },
  ngxCode: {
    required: 'Phone number is required',
  }
};
export let FormErrors = {
  address: '',
  email: '',
  phone: '',
  name: '',
  ngxCode: ''

};

export interface ReceivingAgent {
  name: string;
  address: string;
  email: string;
  phone: string;
  ngxCode: string
}
