export interface ISeeder {
  seed(): Promise<void>;
}
