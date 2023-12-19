export class ContactEntity {
  name: string;
  custom_fields_values: {
    field_id: number;
    values: {
      value: string | number;
    }[];
  }[];
}
