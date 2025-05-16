class EmployeeCodeGenerator {
  private static removeVietnameseTones(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  /**
   * Generate a unique code based on the employee's full name and date of birth.
   * The code is in the format of [FULL_NAME][DATE_OF_BIRTH] where [FULL_NAME] is
   * the uppercase full name with Vietnamese tones and spaces removed, and
   * [DATE_OF_BIRTH] is the date of birth in the format of [DD][MM][YYYY].
   * @param {Object} options
   * @param {string} options.full_name The full name of the employee
   * @param {string} options.dob The date of birth of the employee
   * @param {string} [options.delimiter='/'] The delimiter used to split the date
   * of birth. Default is '/'.
   * @returns {string} The generated code
   */
  public static generate({
    full_name,
    dob,
    delimiter = '/',
  }: {
    full_name: string;
    dob: string;
    delimiter?: string;
  }): string {
    // Remove Vietnamese tones, spaces, and convert to uppercase
    const cleanName = this.removeVietnameseTones(full_name)
      .replace(/\s+/g, '')
      .toUpperCase();

    // Format date of birth
    const dobFormatted = dob.split(delimiter).join('');

    // Combine full name and formatted DOB
    return `${cleanName}${dobFormatted}`;
  }
}

export { EmployeeCodeGenerator };

// // Example usage
// const fullName = 'Tăng Ái Quốc';
// const dob = '01/08/2000';

// const employeeCode = EmployeeCodeGenerator.generate({full_name, dob});
// console.log(employeeCode); -> TANGAIQUOC01082000
