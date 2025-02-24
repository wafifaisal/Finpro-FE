export interface VerifyTenantFormValues {
  name: string;
  password: string;
  confirmPassword: string;
  no_handphone: string;
}

export interface VerifyTenantFormProps {
  token?: string;
}
