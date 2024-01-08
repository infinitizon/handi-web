export const ValidationMessages = {
  category: {
    required: 'Category is required',
  },
  name: {
    required: 'Character name is required',
  },
  type: {
    required: 'Character type is required',
  }
};
export let FormErrors = {
  category: '',
  name: '',
  type: '',
};

export interface Gateway {
  category: string;
  name: string;
  type: string;
}
