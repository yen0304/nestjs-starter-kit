import 'reflect-metadata';
import validateConfig from './validate-config';
import { IsString, IsNumber } from 'class-validator';

class ValidSchema {
  @IsString()
  NAME!: string;

  @IsNumber()
  PORT!: number;
}

class InvalidSchema {
  @IsString()
  REQUIRED_FIELD!: string;
}

describe('validateConfig', () => {
  it('should return validated config when valid', () => {
    const config = { NAME: 'test', PORT: 3000 };
    const result = validateConfig(config, ValidSchema);

    expect(result).toBeInstanceOf(ValidSchema);
    expect(result.NAME).toBe('test');
    expect(result.PORT).toBe(3000);
  });

  it('should throw when validation fails', () => {
    const config = {}; // missing REQUIRED_FIELD
    expect(() => validateConfig(config, InvalidSchema)).toThrow();
  });
});
